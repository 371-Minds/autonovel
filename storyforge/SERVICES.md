# StoryForge AI: Services Contract

## 1. Overview

**Developer Note:** This document is the source of truth for all interactions with external AI services, as mandated by the **StoryCraft Protocol**. The `services/geminiService.ts` file is the concrete implementation of this contract. All frontend components must interact with the service layer through these defined functions.

This ensures a clear separation of concerns, predictable data flow, and a stable interface for AI capabilities, even if the underlying model or provider changes.

---

## 2. Text Generation Services

### `generateTextSuggestion(prompt: string, config: AiProviderConfig): Promise<string>`

-   **Description**: Generates a short, contextual text suggestion to help overcome writer's block.
-   **Input**: 
    -   `prompt` (string) - A detailed prompt that includes the user's current story context.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<string>` - A promise that resolves to the raw text of the AI's suggestion.
-   **Model**: Provider-dependent (e.g., `gemini-2.5-flash`).
-   **Error Handling**: Returns a user-friendly error message as a string if the API call fails.

### `generateBookOutline(prompt: string, config: AiProviderConfig): Promise<BookOutline>`

-   **Description**: Takes a user's high-level book idea and generates a title, synopsis, and a list of chapter titles. This is the first step in the autonomous book generation process.
-   **Input**:
    -   `prompt` (string) - The user's book concept (e.g., "A sci-fi story about a sentient starship.").
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<BookOutline>` - A promise that resolves to a JSON object with the book's structure. The `BookOutline` type is `{ title: string; synopsis: string; chapters: { title: string }[] }`.
-   **Model**: Provider-dependent (e.g., `gemini-2.5-pro`), must support JSON mode.
-   **Error Handling**: Throws an `Error` if the generation fails.

### `generateNarrative(userPrompt: string, systemInstruction: string, file: {mimeType: string, data: string} | undefined, config: AiProviderConfig): Promise<string>`

-   **Description**: The primary service for generating long-form narrative content based on a detailed set of instructions and an optional file for context.
-   **Input**:
    -   `userPrompt` (string) - The user's specific request (e.g., "Write the next scene where the hero finds the sword.").
    -   `systemInstruction` (string) - The combined SOP from the selected AI Assistant and structural framework, defining the AI's role and constraints.
    -   `file` (optional object) - An object containing the `mimeType` and base64-encoded `data` of a user-uploaded file for additional context.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<string>` - A promise that resolves to the generated narrative content, expected to be in Markdown format.
-   **Model**: Provider-dependent (e.g., `gemini-2.5-pro`).
-   **Error Handling**: Returns a user-friendly error message as a string if the API call fails.

### `generateNarrativeStream(userPrompt: string, systemInstruction: string, file: {mimeType: string, data: string} | undefined, config: AiProviderConfig): AsyncGenerator<string>`

-   **Description**: A streaming version of `generateNarrative`. Generates long-form narrative content and yields text chunks as they become available.
-   **Input**: Same as `generateNarrative`.
-   **Output**: `AsyncGenerator<string>` - An async generator that yields strings (text chunks).
-   **Model**: Provider-dependent (e.g., `gemini-2.5-pro`).
-   **Error Handling**: The generator throws an error if the API call fails, which must be caught by the calling component.

### `rewriteText(text: string, config: AiProviderConfig): Promise<string>`

-   **Description**: Rewrites a selected piece of text to be more compelling or vivid. Used by the Smart Toolbar.
-   **Input**: 
    -   `text` (string) - The text selected by the user in the editor.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<string>` - A promise that resolves to the rewritten text.
-   **Model**: Provider-dependent (e.g., `gemini-2.5-flash`).
-   **Error Handling**: Returns a user-friendly error message as a string if the API call fails.

### `completeText(context: string, config: AiProviderConfig): Promise<string>`

-   **Description**: Continues writing from the current cursor position based on the preceding text. Used by the Smart Toolbar.
-   **Input**: 
    -   `context` (string) - The text in the editor leading up to the user's cursor.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<string>` - A promise that resolves to the next sentence or paragraph of the story.
-   **Model**: Provider-dependent (e.g., `gemini-2.5-flash`).
-   **Error Handling**: Returns a user-friendly error message as a string if the API call fails.

### `generateCharacterProfile(prompt: string, config: AiProviderConfig): Promise<Omit<CharacterProfile, 'id'>>`

-   **Description**: Generates a detailed character profile based on a user's prompt.
-   **Input**: 
    -   `prompt` (string) - A short description of the character concept.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<Omit<CharacterProfile, 'id'>>` - A promise that resolves to a JSON object matching the `CharacterProfile` interface (excluding the `id`).
-   **Model**: Provider-dependent (e.g., `gemini-2.5-pro`), must support JSON mode.
-   **Error Handling**: Throws an `Error` if generation fails.

---

## 3. Image Generation Services

### `generateImage(prompt: string, config: AiProviderConfig): Promise<string>`

-   **Description**: Generates a book cover image based on a user's prompt.
-   **Input**: 
    -   `prompt` (string) - The full, final prompt for the image generation model.
    -   `config` (AiProviderConfig) - The active AI provider configuration.
-   **Output**: `Promise<string>` - A promise that resolves to a base64-encoded data URL (`data:image/jpeg;base64,...`) of the generated image.
-   **Model**: `imagen-4.0-generate-001` (Gemini-only at present).
-   **Error Handling**: Throws a `Error` if the generation fails or if the model does not return a valid image, which should be caught by the calling component.

---

## 4. AI Provider Configuration

The application supports multiple AI providers. The active provider is configured in the **Settings** view. The service functions within `services/geminiService.ts` (acting as a generic AI service router) now accept an `AiProviderConfig` object to determine which backend to call.

### Supported Providers

-   **Gemini**: The default cloud-based provider. Uses the API key from the environment. All features are supported.
-   **Arch Gateway**: A local provider that connects to an OpenAI-compatible API, such as one provided by Arch Gateway or Ollama.
    -   **Configuration**: Requires a Base URL (e.g., `http://localhost:12000/v1`).
    -   **Image Generation**: The `generateImage` service is **not supported** with this provider.
-   **Cloudflare AI Gateway**: A managed gateway for running inference on Cloudflare's global network.
    -   **Configuration**: Requires a Gateway URL, an API Token, and a model identifier (e.g., `@cf/meta/llama-3.1-8b-instruct`).
    -   **Image Generation**: The `generateImage` service is **not supported** with this provider.

### `AiProviderConfig` Interface

```typescript
interface AiProviderConfig {
  provider: 'Gemini' | 'Arch Gateway' | 'Cloudflare AI Gateway';
  archGatewaySettings: {
    baseUrl: string;
  };
  cloudflareSettings: {
    gatewayUrl: string;
    apiToken: string;
    model: string;
  };
}
```