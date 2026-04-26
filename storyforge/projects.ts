/**
 * Project Resources
 * 
 * MCP resources for accessing project data.
 * These are scaffolds - resource templates are registered for discovery.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register project resources with the MCP server
 */
export function registerProjectResources(server: McpServer): void {
  // Resource: project://{projectId}
  server.registerResource(
    'project-metadata',
    new ResourceTemplate('project://{projectId}', {
      list: undefined,
    }),
    {
      mimeType: 'application/json',
      description: 'Full project metadata and content',
    },
    async (uri) => {
      // Extract projectId from URI
      const uriString = uri.toString();
      const match = uriString.match(/project:\/\/([^/]+)$/);
      const projectId = match ? match[1] : 'unknown';
      
      // Placeholder: Return scaffold data
      // In the future, this will fetch from the database
      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'application/json',
            text: JSON.stringify({
              status: 'scaffold',
              message: 'Project resource scaffold - database integration pending',
              projectId,
              metadata: {
                title: null,
                description: null,
                createdAt: null,
                updatedAt: null,
              },
              chapters: [],
              characters: [],
            }, null, 2),
          },
        ],
      };
    }
  );

  // Resource: project://{projectId}/chapters/{chapterNum}
  server.registerResource(
    'project-chapter',
    new ResourceTemplate('project://{projectId}/chapters/{chapterNum}', {
      list: undefined,
    }),
    {
      mimeType: 'text/markdown',
      description: 'Individual chapter content',
    },
    async (uri) => {
      // Extract projectId and chapterNum from URI
      const uriString = uri.toString();
      const match = uriString.match(/project:\/\/([^/]+)\/chapters\/(\d+)$/);
      const projectId = match ? match[1] : 'unknown';
      const chapterNum = match ? parseInt(match[2], 10) : 0;
      
      // Placeholder: Return scaffold data
      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'text/markdown',
            text: JSON.stringify({
              status: 'scaffold',
              message: 'Chapter resource scaffold - database integration pending',
              projectId,
              chapterNum,
              chapter: {
                title: null,
                content: null,
                order: chapterNum,
              },
            }, null, 2),
          },
        ],
      };
    }
  );
}
