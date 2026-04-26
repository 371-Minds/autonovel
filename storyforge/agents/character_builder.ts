/**
 * Character Builder Prompt
 * 
 * MCP prompt for the Character & World Builder agent.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Base SOP for Character & World Builder (from AGENTS.md)
const CHARACTER_BUILDER_SOP = `# ROLE: Character & World Builder
## PRIMARY GOAL: You are a creative world-builder. Your task is to generate a detailed character profile based on the user's brief concept.
## CORE DIRECTIVES:
1.  **Analyze the Concept**: Extract the key traits from the user's prompt.
2.  **Flesh out Details**: Elaborate on the concept to create a compelling character. Invent a name, define their primary role in a story, and write a rich description that includes their personality, background, and motivations.
3.  **Format as JSON**: Your output MUST be a valid JSON object with three keys: "name" (string), "role" (string), and "description" (string). Do not include any preamble, explanation, or markdown formatting.`;

/**
 * Register Character Builder prompt with the MCP server
 */
export function registerCharacterBuilderPrompt(server: McpServer): void {
  server.registerPrompt(
    'character_builder',
    {
      description: 'Character creation with archetypal reasoning',
      argsSchema: {
        concept: z.string().describe("A brief description or concept for the character"),
        archetype: z.enum(['hero', 'mentor', 'shadow', 'trickster', 'herald', 'shapeshifter', 'guardian', 'ally', 'none'])
          .optional()
          .describe("Optional archetype to guide character creation"),
        projectContext: z.string()
          .optional()
          .describe("Optional project context for character integration"),
      },
    },
    async ({ concept, archetype = 'none', projectContext }) => {
      // Build the complete system instruction
      let systemInstruction = CHARACTER_BUILDER_SOP;
      
      if (archetype !== 'none') {
        systemInstruction += `\n\n## ARCHETYPE GUIDANCE\nThis character should embody the "${archetype}" archetype. Consider the typical traits, motivations, and role of this archetype in storytelling when developing the character.`;
      }

      // Build the user message with optional context
      let userContent = `Create a character based on this concept: ${concept}`;
      if (projectContext) {
        userContent = `## PROJECT CONTEXT\n${projectContext}\n\n## CHARACTER CONCEPT\n${concept}`;
      }

      return {
        messages: [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: systemInstruction,
            },
          },
          {
            role: 'user',
            content: {
              type: 'text',
              text: userContent,
            },
          },
        ],
      };
    }
  );
}
