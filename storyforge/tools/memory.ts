/**
 * Memory Domain Tools
 * 
 * Tools for knowledge graph operations: entity storage, consistency checking, and relationship queries.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  storeEntity,
  getEntities,
  queryRelationships,
  checkConsistency,
} from '../../services/memoryStore.js';

/**
 * Register memory domain tools with the MCP server
 */
export function registerMemoryTools(server: McpServer): void {
  // Tool: memory_store_entity
  server.registerTool(
    'memory_store_entity',
    {
      description: 'Store entity state in knowledge graph',
      inputSchema: {
        entity: z.string().describe("The entity name or identifier"),
        properties: z.record(z.any()).describe("Entity properties as key-value pairs"),
        projectId: z.string().describe("The project ID to associate the entity with"),
        type: z.enum(['character', 'location', 'event', 'item', 'concept']).describe("The type of entity"),
      },
    },
    async ({ entity, properties, projectId, type }) => {
      try {
        const storedEntity = storeEntity(projectId, {
          name: entity,
          type,
          properties,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: `Entity "${entity}" stored successfully`,
                entity: storedEntity,
                stored: true,
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
                message: `Failed to store entity: ${errorMessage}`,
                entity,
                stored: false,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: memory_check_consistency
  server.registerTool(
    'memory_check_consistency',
    {
      description: 'Check for continuity violations',
      inputSchema: {
        chapterId: z.string().describe("The chapter ID to check for consistency"),
        projectId: z.string().describe("The project ID containing the chapter"),
        chapterText: z.string().describe("The chapter text content to analyze"),
      },
    },
    async ({ chapterId, projectId, chapterText }) => {
      try {
        const issues = checkConsistency(projectId, chapterText);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                chapterId,
                projectId,
                issueCount: issues.length,
                hasIssues: issues.length > 0,
                issues,
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
                message: `Failed to check consistency: ${errorMessage}`,
                chapterId,
                projectId,
                issues: [],
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: memory_query_relationships
  server.registerTool(
    'memory_query_relationships',
    {
      description: 'Query entity relationships from knowledge graph',
      inputSchema: {
        entity: z.string().describe("The entity name to query relationships for"),
        projectId: z.string().describe("The project ID to search within"),
        depth: z.number().optional().describe("Relationship depth to traverse (default: 1)"),
      },
    },
    async ({ entity, projectId, depth }) => {
      try {
        const result = queryRelationships(projectId, entity, depth || 1);

        if (!result.entity) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'not_found',
                  message: `Entity "${entity}" not found in project "${projectId}"`,
                  entity,
                  projectId,
                  relationships: [],
                }, null, 2),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                entity: result.entity,
                projectId,
                depth: depth || 1,
                relationshipCount: result.related.length,
                relationships: result.related.map(r => ({
                  relatedEntity: r.entity,
                  relationship: r.relationship,
                  direction: r.direction,
                })),
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
                message: `Failed to query relationships: ${errorMessage}`,
                entity,
                projectId,
                relationships: [],
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
