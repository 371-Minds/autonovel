/**
 * Character Domain Tools
 * 
 * Tools for character creation, analysis, and archetype management.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateCharacterProfile } from '../../services/aiRouter.js';
import {
  getAllArchetypes,
  getArchetypeById,
  enhancePromptWithArchetype,
} from '../../services/archetypeService.js';
import {
  getEntityById,
  queryRelationships,
  checkConsistency,
} from '../../services/memoryStore.js';
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
 * Register character domain tools with the MCP server
 */
export function registerCharacterTools(server: McpServer): void {
  // Tool: character_create
  server.registerTool(
    'character_create',
    {
      description: 'Generate detailed character profile from concept',
      inputSchema: {
        prompt: z.string().describe("A brief description or concept for the character"),
        archetype: z.string().optional().describe("Optional archetype ID (hero, mentor, shadow, trickster, herald, shapeshifter, guardian, ally)"),
        provider: z.string().optional().describe("Optional AI provider override (Gemini, Arch Gateway, Cloudflare AI Gateway)"),
      },
    },
    async ({ prompt, archetype, provider }) => {
      try {
        const config = getDefaultAiConfig(provider);
        
        // Enhance prompt with archetype context if provided
        const enhancedPrompt = archetype
          ? enhancePromptWithArchetype(prompt, archetype)
          : prompt;
        
        const result = await generateCharacterProfile(enhancedPrompt, config);
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
              text: `Error generating character: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: character_analyze_consistency
  server.registerTool(
    'character_analyze_consistency',
    {
      description: 'Check character behavior consistency across chapters',
      inputSchema: {
        characterId: z.string().describe("The unique identifier of the character to analyze"),
        projectId: z.string().describe("The project ID containing the character"),
        chapterText: z.string().optional().describe("Optional chapter text to check against stored character properties"),
      },
    },
    async ({ characterId, projectId, chapterText }) => {
      try {
        // Get the character entity from memory store
        const entity = getEntityById(projectId, characterId);
        
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'error',
                  message: `Character with ID '${characterId}' not found in project '${projectId}'`,
                  characterId,
                  projectId,
                  analysis: {
                    consistencyScore: null,
                    violations: [],
                    recommendations: [],
                  },
                }, null, 2),
              },
            ],
            isError: true,
          };
        }

        // Get character relationships for context
        const relationships = queryRelationships(projectId, entity.name, 2);

        // Check consistency if chapter text is provided
        let consistencyIssues: Array<{
          type: string;
          entityName: string;
          expected?: string;
          found?: string;
          message: string;
        }> = [];
        
        if (chapterText) {
          consistencyIssues = checkConsistency(projectId, chapterText);
          // Filter to only issues related to this character
          consistencyIssues = consistencyIssues.filter(
            issue => issue.entityName.toLowerCase() === entity.name.toLowerCase()
          );
        }

        // Calculate consistency score based on issues found
        const consistencyScore = chapterText
          ? Math.max(0, 100 - consistencyIssues.length * 20)
          : null;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: 'Character consistency analysis complete',
                characterId,
                projectId,
                character: {
                  name: entity.name,
                  type: entity.type,
                  properties: entity.properties,
                },
                relationships: relationships.related.map(r => ({
                  entityName: r.entity.name,
                  relationshipType: r.relationship.type,
                  direction: r.direction,
                })),
                analysis: {
                  consistencyScore,
                  violations: consistencyIssues,
                  recommendations: consistencyIssues.length > 0
                    ? ['Review the flagged inconsistencies', 'Update character properties if the changes are intentional']
                    : ['No consistency issues detected'],
                },
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                message: errorMessage,
                characterId,
                projectId,
                analysis: {
                  consistencyScore: null,
                  violations: [],
                  recommendations: [],
                },
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: character_list_archetypes
  server.registerTool(
    'character_list_archetypes',
    {
      description: 'List available character archetypes (Hero, Mentor, Shadow, etc.)',
      inputSchema: {
        id: z.string().optional().describe("Optional archetype ID to get specific archetype details"),
      },
    },
    async ({ id }) => {
      try {
        if (id) {
          // Return specific archetype
          const archetype = getArchetypeById(id);
          if (!archetype) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    error: `Archetype with id '${id}' not found`,
                    availableIds: getAllArchetypes().map(a => a.id),
                  }, null, 2),
                },
              ],
              isError: true,
            };
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ archetype }, null, 2),
              },
            ],
          };
        }

        // Return all archetypes
        const archetypes = getAllArchetypes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ archetypes }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error listing archetypes: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
