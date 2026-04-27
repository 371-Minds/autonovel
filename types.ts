export type ModelRole = 'writer' | 'judge' | 'review';

export type StoryforgeProviderId =
  | 'anthropic'
  | 'hermes'
  | 'gemini'
  | 'arch-gateway'
  | 'cloudflare-ai-gateway';

export type StoryforgeProviderLabel =
  | 'Anthropic'
  | 'Hermes'
  | 'Gemini'
  | 'Arch Gateway'
  | 'Cloudflare AI Gateway';

export interface ProviderRoute {
  provider: StoryforgeProviderId;
  model: string;
}

export type RoleProviderMap = Record<ModelRole, ProviderRoute>;

export interface ProviderBinding {
  apiKeyEnv?: string;
  baseUrlEnv?: string;
}

export type ProviderBindingMap = Record<StoryforgeProviderId, ProviderBinding>;

export interface StoryforgeProviderContract {
  roles: RoleProviderMap;
  providers: ProviderBindingMap;
}

export interface AiProviderConfig {
  role?: ModelRole;
  provider: StoryforgeProviderLabel;
  model?: string;
  archGatewaySettings: {
    baseUrl: string;
    apiKey?: string;
  };
  cloudflareSettings: {
    gatewayUrl: string;
    apiToken: string;
    model: string;
  };
  anthropicSettings: {
    apiKey: string;
    baseUrl: string;
  };
  hermesSettings: {
    baseUrl: string;
    apiKey: string;
  };
  roleRouting?: RoleProviderMap;
  providerBindings?: Partial<ProviderBindingMap>;
}

export interface StructuralFramework {
  name: string;
  sop: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  baseSop: string;
  promptPlaceholder: string;
  structuralFrameworks?: StructuralFramework[];
  isCustom: boolean;
}

export interface BookOutline {
  title: string;
  synopsis: string;
  chapters: Array<{
    title: string;
  }>;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role?: string;
  description: string;
  archetype?: string;
  relationships?: unknown[];
  [key: string]: unknown;
}
