/**
 * Narrative Domain Tools
 * 
 * Tools for generating narrative content: scenes, chapters, and book outlines.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateNarrative, generateBookOutline } from '../../services/aiRouter.js';
import { AiProviderConfig } from '../../types.js';

// Default AI provider configuration for MCP tools
function getDefaultAiConfig(provider?: string): AiProviderConfig {
  const providerType = provider || process.env.STORYFORGE_AI_PROVIDER || 'Gemini';
  
  return {
    provider: providerType as AiProviderConfig['provider'],
    archGatewaySettings: {
      baseUrl: process.env.ARCH_GATEWAY_URL || 'http://localhost:8080',
    },
    cloudflareSettings: {
      gatewayUrl: process.env.CLOUDFLARE_GATEWAY_URL || '',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      model: process.env.CLOUDFLARE_MODEL || 'gemini-2.5-pro',
    },
  };
}

/**
 * Register narrative domain tools with the MCP server
 */
export function registerNarrativeTools(server: McpServer): void {
  // Tool: narrative_generate_scene
  server.registerTool(
    'narrative_generate_scene',
    {
      description: 'Generate a complete scene based on outline and character context',
      inputSchema: {
        prompt: z.string().describe("The scene writing prompt or request"),
        systemInstruction: z.string().describe("System instructions to guide the AI (e.g., agent SOP + framework)"),
        file: z.object({
          mimeType: z.string(),
          data: z.string(),
        }).optional().describe("Optional context file (image reference)"),
        provider: z.string().optional().describe("Optional AI provider override (Gemini, Arch Gateway, Cloudflare AI Gateway)"),
      },
    },
    async ({ prompt, systemInstruction, file, provider }) => {
      try {
        const config = getDefaultAiConfig(provider);
        const result = await generateNarrative(prompt, systemInstruction, file, config);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error generating scene: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: narrative_generate_chapter
  server.registerTool(
    'narrative_generate_chapter',
    {
      description: 'Generate a full chapter with structural framework adherence',
      inputSchema: {
        prompt: z.string().describe("The chapter writing prompt or request"),
        systemInstruction: z.string().describe("System instructions to guide the AI (e.g., agent SOP + framework)"),
        chapterIndex: z.number().describe("The index of the chapter being generated"),
        file: z.object({
          mimeType: z.string(),
          data: z.string(),
        }).optional().describe("Optional context file (image reference)"),
        provider: z.string().optional().describe("Optional AI provider override (Gemini, Arch Gateway, Cloudflare AI Gateway)"),
      },
    },
    async ({ prompt, systemInstruction, chapterIndex, file, provider }) => {
      try {
        const config = getDefaultAiConfig(provider);
        // Enhance system instruction with chapter context
        const enhancedSystemInstruction = `${systemInstruction}\n\n## CHAPTER CONTEXT\nYou are writing Chapter ${chapterIndex + 1}. Ensure this chapter flows naturally from previous events and advances the overall narrative arc.`;
        
        const result = await generateNarrative(prompt, enhancedSystemInstruction, file, config);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error generating chapter: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: narrative_generate_outline
  server.registerTool(
    'narrative_generate_outline',
    {
      description: 'Create story outline with act/chapter structure',
      inputSchema: {
        prompt: z.string().describe("The book concept or premise"),
        provider: z.string().optional().describe("Optional AI provider override (Gemini, Arch Gateway, Cloudflare AI Gateway)"),
      },
    },
    async ({ prompt, provider }) => {
      try {
        const config = getDefaultAiConfig(provider);
        const result = await generateBookOutline(prompt, config);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error generating outline: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
