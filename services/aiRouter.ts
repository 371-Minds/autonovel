import { AiProviderConfig, BookOutline, CharacterProfile } from '../types.js';

type SupportedProvider =
  | 'anthropic'
  | 'hermes'
  | 'gemini'
  | 'arch-gateway'
  | 'cloudflare-ai-gateway';

interface TextGenerationRequest {
  prompt: string;
  systemInstruction?: string;
  config: AiProviderConfig;
  responseFormat?: 'text' | 'json';
}

const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-4-6',
  openAiCompatible: 'openai-compatible-model',
  gemini: 'gemini-2.5-pro',
} as const;
const DEFAULT_OPENAI_BASE_URLS = {
  hermes: 'http://localhost:8642',
  archGateway: 'http://localhost:8080',
} as const;
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export async function generateNarrative(
  userPrompt: string,
  systemInstruction: string,
  file: { mimeType: string; data: string } | undefined,
  config: AiProviderConfig
): Promise<string> {
  const prompt = composeNarrativePrompt(userPrompt, file);
  return generateText({
    prompt,
    systemInstruction,
    config,
  });
}

export async function generateBookOutline(
  prompt: string,
  config: AiProviderConfig
): Promise<BookOutline> {
  const raw = await generateText({
    prompt,
    config,
    responseFormat: 'json',
    systemInstruction: [
      'You generate book outlines.',
      'Return only valid JSON.',
      'Schema: {"title": string, "synopsis": string, "chapters": [{"title": string}]}',
      'Use at least 3 chapter titles.',
    ].join(' '),
  });

  const parsed = parseJsonPayload<BookOutline>(raw);
  if (!parsed.title || !parsed.synopsis || !Array.isArray(parsed.chapters)) {
    throw new Error('Outline response did not match the expected schema.');
  }

  return {
    title: parsed.title,
    synopsis: parsed.synopsis,
    chapters: parsed.chapters
      .filter((chapter): chapter is { title: string } => Boolean(chapter?.title))
      .map((chapter) => ({ title: chapter.title })),
  };
}

export async function generateCharacterProfile(
  prompt: string,
  config: AiProviderConfig
): Promise<Omit<CharacterProfile, 'id'>> {
  const raw = await generateText({
    prompt,
    config,
    responseFormat: 'json',
    systemInstruction: [
      'You generate character profiles.',
      'Return only valid JSON.',
      'Schema: {"name": string, "role": string, "description": string, "archetype"?: string, "relationships"?: array}',
    ].join(' '),
  });

  const parsed = parseJsonPayload<Omit<CharacterProfile, 'id'>>(raw);
  if (!parsed.name || !parsed.description) {
    throw new Error('Character profile response did not match the expected schema.');
  }

  return parsed;
}

async function generateText({
  prompt,
  systemInstruction,
  config,
  responseFormat = 'text',
}: TextGenerationRequest): Promise<string> {
  const provider = normalizeProvider(config.provider);

  switch (provider) {
    case 'anthropic':
      return requestAnthropicText({ prompt, systemInstruction, config, responseFormat });
    case 'hermes':
    case 'arch-gateway':
    case 'cloudflare-ai-gateway':
      return requestOpenAiCompatibleText(provider, {
        prompt,
        systemInstruction,
        config,
        responseFormat,
      });
    case 'gemini':
      return requestGeminiText({ prompt, systemInstruction, config, responseFormat });
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

async function requestAnthropicText({
  prompt,
  systemInstruction,
  config,
}: TextGenerationRequest): Promise<string> {
  const apiKey = config.anthropicSettings.apiKey || env.ANTHROPIC_API_KEY || '';
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required for Anthropic requests.');
  }

  const response = await fetch(`${normalizeBaseUrl(config.anthropicSettings.baseUrl, false)}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: config.model || config.roleRouting?.[config.role || 'writer']?.model || DEFAULT_MODELS.anthropic,
      max_tokens: 4096,
      temperature: 0.7,
      system: systemInstruction,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const payload = await parseResponseJson(response);
  const content = Array.isArray(payload.content) ? payload.content : [];
  const textParts = content
    .map((item) => (item && typeof item === 'object' && 'text' in item ? String(item.text) : ''))
    .filter(Boolean);

  if (textParts.length === 0) {
    throw new Error('Anthropic response did not include text content.');
  }

  return textParts.join('').trim();
}

async function requestOpenAiCompatibleText(
  provider: Extract<SupportedProvider, 'hermes' | 'arch-gateway' | 'cloudflare-ai-gateway'>,
  {
    prompt,
    systemInstruction,
    config,
    responseFormat,
  }: TextGenerationRequest
): Promise<string> {
  const { baseUrl, apiKey } = getOpenAiCompatibleSettings(provider, config);
  const messages = [
    ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
    { role: 'user', content: prompt },
  ];

  const response = await fetch(`${normalizeBaseUrl(baseUrl, true)}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model || config.roleRouting?.[config.role || 'writer']?.model || DEFAULT_MODELS.openAiCompatible,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: responseFormat === 'json' ? { type: 'json_object' } : undefined,
      messages,
    }),
  });

  const payload = await parseResponseJson(response);
  const choice = Array.isArray(payload.choices) ? payload.choices[0] : undefined;
  const message = choice?.message;
  const content = extractOpenAiCompatibleText(message?.content);
  if (!content) {
    throw new Error(`${provider} response did not include message content.`);
  }
  return content.trim();
}

async function requestGeminiText({
  prompt,
  systemInstruction,
  config,
  responseFormat,
}: TextGenerationRequest): Promise<string> {
  const apiKey =
    env.API_KEY ||
    env.GEMINI_API_KEY ||
    env.GOOGLE_API_KEY ||
    '';
  if (!apiKey) {
    throw new Error('API_KEY (or GEMINI_API_KEY / GOOGLE_API_KEY) is required for Gemini requests.');
  }

  const model = config.model || config.roleRouting?.[config.role || 'writer']?.model || DEFAULT_MODELS.gemini;
  const endpoint = `${DEFAULT_GEMINI_BASE_URL}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: systemInstruction
        ? {
            parts: [{ text: systemInstruction }],
          }
        : undefined,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain',
      },
    }),
  });

  const payload = await parseResponseJson(response);
  const candidate = Array.isArray(payload.candidates) ? payload.candidates[0] : undefined;
  const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
  const text = parts
    .map((part) => (part && typeof part === 'object' && 'text' in part ? String(part.text) : ''))
    .filter(Boolean)
    .join('');

  if (!text) {
    throw new Error('Gemini response did not include text content.');
  }

  return text.trim();
}

function composeNarrativePrompt(
  prompt: string,
  file: { mimeType: string; data: string } | undefined
): string {
  if (!file) {
    return prompt;
  }

  const preview = file.data.length > 2000 ? `${file.data.slice(0, 2000)}...` : file.data;
  return [
    prompt,
    '',
    '## ATTACHED FILE CONTEXT',
    `mimeType: ${file.mimeType}`,
    `base64DataPreview: ${preview}`,
  ].join('\n');
}

function normalizeProvider(provider: AiProviderConfig['provider']): SupportedProvider {
  switch (provider) {
    case 'Anthropic':
      return 'anthropic';
    case 'Hermes':
      return 'hermes';
    case 'Gemini':
      return 'gemini';
    case 'Arch Gateway':
      return 'arch-gateway';
    case 'Cloudflare AI Gateway':
      return 'cloudflare-ai-gateway';
    default:
      throw new Error(`Unsupported provider label: ${String(provider)}`);
  }
}

function getOpenAiCompatibleSettings(
  provider: Extract<SupportedProvider, 'hermes' | 'arch-gateway' | 'cloudflare-ai-gateway'>,
  config: AiProviderConfig
): { baseUrl: string; apiKey: string } {
  switch (provider) {
    case 'hermes':
      return {
        baseUrl: config.hermesSettings.baseUrl || env.HERMES_API_BASE_URL || DEFAULT_OPENAI_BASE_URLS.hermes,
        apiKey: config.hermesSettings.apiKey || env.HERMES_API_KEY || '',
      };
    case 'arch-gateway':
      return {
        baseUrl: config.archGatewaySettings.baseUrl || env.ARCH_GATEWAY_URL || DEFAULT_OPENAI_BASE_URLS.archGateway,
        apiKey: config.archGatewaySettings.apiKey || env.ARCH_GATEWAY_API_KEY || '',
      };
    case 'cloudflare-ai-gateway':
      return {
        baseUrl: config.cloudflareSettings.gatewayUrl || env.CLOUDFLARE_GATEWAY_URL || '',
        apiKey: config.cloudflareSettings.apiToken || env.CLOUDFLARE_API_TOKEN || '',
      };
  }
}

function normalizeBaseUrl(baseUrl: string, ensureV1: boolean): string {
  const normalized = baseUrl.trim().replace(/\/+$/, '');
  if (!normalized) {
    throw new Error('Provider base URL is required.');
  }
  if (ensureV1 && !normalized.endsWith('/v1')) {
    return `${normalized}/v1`;
  }
  if (!ensureV1 && normalized.endsWith('/v1')) {
    return normalized.slice(0, -3);
  }
  return normalized;
}

async function parseResponseJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Provider request failed (${response.status}): ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Provider returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function extractOpenAiCompatibleText(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        if (item && typeof item === 'object' && 'text' in item) {
          return String(item.text);
        }
        return '';
      })
      .join('');
  }

  return '';
}

function parseJsonPayload<T>(raw: string): T {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
  return JSON.parse(candidate) as T;
}
