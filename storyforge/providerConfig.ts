import {
  AiProviderConfig,
  ModelRole,
  ProviderBindingMap,
  RoleProviderMap,
  StoryforgeProviderContract,
  StoryforgeProviderId,
  StoryforgeProviderLabel,
} from '../types.js';

const PROVIDER_LABELS: Record<StoryforgeProviderId, StoryforgeProviderLabel> = {
  anthropic: 'Anthropic',
  hermes: 'Hermes',
  gemini: 'Gemini',
  'arch-gateway': 'Arch Gateway',
  'cloudflare-ai-gateway': 'Cloudflare AI Gateway',
};

const PROVIDER_ALIASES: Record<string, StoryforgeProviderId> = {
  anthropic: 'anthropic',
  hermes: 'hermes',
  gemini: 'gemini',
  arch: 'arch-gateway',
  'arch gateway': 'arch-gateway',
  'arch-gateway': 'arch-gateway',
  cloudflare: 'cloudflare-ai-gateway',
  'cloudflare ai gateway': 'cloudflare-ai-gateway',
  'cloudflare-ai-gateway': 'cloudflare-ai-gateway',
};

const DEFAULT_PROVIDER_BINDINGS: ProviderBindingMap = {
  anthropic: {
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    baseUrlEnv: 'AUTONOVEL_API_BASE_URL',
  },
  hermes: {
    apiKeyEnv: 'HERMES_API_KEY',
    baseUrlEnv: 'HERMES_API_BASE_URL',
  },
  gemini: {},
  'arch-gateway': {
    apiKeyEnv: 'ARCH_GATEWAY_API_KEY',
    baseUrlEnv: 'ARCH_GATEWAY_URL',
  },
  'cloudflare-ai-gateway': {
    apiKeyEnv: 'CLOUDFLARE_API_TOKEN',
    baseUrlEnv: 'CLOUDFLARE_GATEWAY_URL',
  },
};

const DEFAULT_MODELS: Record<StoryforgeProviderId, Record<ModelRole, string>> = {
  anthropic: {
    writer: 'claude-sonnet-4-6',
    judge: 'claude-sonnet-4-6',
    review: 'claude-opus-4-6',
  },
  hermes: {
    writer: 'hermes-agent',
    judge: 'hermes-agent',
    review: 'hermes-agent',
  },
  gemini: {
    writer: 'gemini-2.5-pro',
    judge: 'gemini-2.5-pro',
    review: 'gemini-2.5-pro',
  },
  'arch-gateway': {
    writer: 'openai-compatible-model',
    judge: 'openai-compatible-model',
    review: 'openai-compatible-model',
  },
  'cloudflare-ai-gateway': {
    writer: 'gemini-2.5-pro',
    judge: 'gemini-2.5-pro',
    review: 'gemini-2.5-pro',
  },
};

function normalizeProviderId(
  provider?: string,
  fallback: StoryforgeProviderId = 'gemini'
): StoryforgeProviderId {
  if (!provider) {
    return fallback;
  }

  const normalized = provider.trim().toLowerCase();
  return PROVIDER_ALIASES[normalized] || fallback;
}

function getDefaultProviderForRole(role: ModelRole): StoryforgeProviderId {
  const legacyProvider = process.env.STORYFORGE_AI_PROVIDER;
  const fallback = normalizeProviderId(legacyProvider, 'gemini');
  return normalizeProviderId(process.env[`AUTONOVEL_${role.toUpperCase()}_PROVIDER`], fallback);
}

export function getRoleProvider(role: ModelRole): StoryforgeProviderId {
  return getDefaultProviderForRole(role);
}

export function getRoleModel(role: ModelRole, provider?: StoryforgeProviderId): string {
  const resolvedProvider = provider || getRoleProvider(role);
  const envValue = process.env[`AUTONOVEL_${role.toUpperCase()}_MODEL`]?.trim();
  if (envValue) {
    return envValue;
  }

  const legacyModel = process.env.STORYFORGE_AI_MODEL?.trim();
  if (legacyModel) {
    return legacyModel;
  }

  return DEFAULT_MODELS[resolvedProvider][role];
}

export function loadRoleProviderMap(): RoleProviderMap {
  const roles: ModelRole[] = ['writer', 'judge', 'review'];
  return roles.reduce((acc, role) => {
    const provider = getRoleProvider(role);
    acc[role] = {
      provider,
      model: getRoleModel(role, provider),
    };
    return acc;
  }, {} as RoleProviderMap);
}

export function getProviderContract(): StoryforgeProviderContract {
  return {
    roles: loadRoleProviderMap(),
    providers: DEFAULT_PROVIDER_BINDINGS,
  };
}

export function buildAiProviderConfig(options?: {
  role?: ModelRole;
  providerOverride?: string;
  modelOverride?: string;
}): AiProviderConfig {
  const role = options?.role || 'writer';
  const roleRouting = loadRoleProviderMap();
  const providerId = normalizeProviderId(options?.providerOverride, roleRouting[role].provider);
  const model = options?.modelOverride?.trim() || getRoleModel(role, providerId);

  return {
    role,
    provider: PROVIDER_LABELS[providerId],
    model,
    archGatewaySettings: {
      baseUrl: process.env.ARCH_GATEWAY_URL || 'http://localhost:8080/v1',
      apiKey: process.env.ARCH_GATEWAY_API_KEY || '',
    },
    cloudflareSettings: {
      gatewayUrl: process.env.CLOUDFLARE_GATEWAY_URL || '',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      model: process.env.CLOUDFLARE_MODEL || model,
    },
    anthropicSettings: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseUrl: process.env.AUTONOVEL_API_BASE_URL || 'https://api.anthropic.com',
    },
    hermesSettings: {
      baseUrl: process.env.HERMES_API_BASE_URL || 'http://localhost:8642/v1',
      apiKey: process.env.HERMES_API_KEY || '',
    },
    roleRouting,
    providerBindings: DEFAULT_PROVIDER_BINDINGS,
  };
}
