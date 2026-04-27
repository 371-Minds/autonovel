/**
 * Narrative Domain Tools
 * 
 * Tools for generating narrative content: scenes, chapters, and book outlines.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateNarrative, generateBookOutline } from '../../services/aiRouter.js';
import { ModelRole } from '../../types.js';
import { buildAiProviderConfig } from '../providerConfig.js';

/**
 * Register narrative domain tools with the MCP server
 */
export function registerNarrativeTools(server: McpServer): void {
  const roleSchema = z.enum(['writer', 'judge', 'review']);

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
        role: roleSchema.optional().describe("Optional model role override (writer, judge, review)"),
        provider: z.string().optional().describe("Optional AI provider override (Anthropic, Hermes, Gemini, Arch Gateway, Cloudflare AI Gateway)"),
        model: z.string().optional().describe("Optional model override for the selected role/provider"),
      },
    },
    async ({ prompt, systemInstruction, file, role, provider, model }) => {
      try {
        const config = buildAiProviderConfig({
          role: (role || 'writer') as ModelRole,
          providerOverride: provider,
          modelOverride: model,
        });
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
        role: roleSchema.optional().describe("Optional model role override (writer, judge, review)"),
        provider: z.string().optional().describe("Optional AI provider override (Anthropic, Hermes, Gemini, Arch Gateway, Cloudflare AI Gateway)"),
        model: z.string().optional().describe("Optional model override for the selected role/provider"),
      },
    },
    async ({ prompt, systemInstruction, chapterIndex, file, role, provider, model }) => {
      try {
        const config = buildAiProviderConfig({
          role: (role || 'writer') as ModelRole,
          providerOverride: provider,
          modelOverride: model,
        });
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
          role: roleSchema.optional().describe("Optional model role override (writer, judge, review)"),
          provider: z.string().optional().describe("Optional AI provider override (Anthropic, Hermes, Gemini, Arch Gateway, Cloudflare AI Gateway)"),
          model: z.string().optional().describe("Optional model override for the selected role/provider"),
        },
      },
    async ({ prompt, role, provider, model }) => {
      try {
        const config = buildAiProviderConfig({
          role: (role || 'writer') as ModelRole,
          providerOverride: provider,
          modelOverride: model,
        });
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
