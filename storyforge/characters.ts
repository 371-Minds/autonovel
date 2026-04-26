/**
 * Character Resources
 * 
 * MCP resources for accessing character profile data.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register character resources with the MCP server
 */
export function registerCharacterResources(server: McpServer): void {
  // Resource: character://{projectId}/{characterId}
  server.registerResource(
    'character-profile',
    new ResourceTemplate('character://{projectId}/{characterId}', {
      list: undefined,
    }),
    {
      mimeType: 'application/json',
      description: 'Character profile data',
    },
    async (uri) => {
      // Extract projectId and characterId from URI
      const uriString = uri.toString();
      const match = uriString.match(/character:\/\/([^/]+)\/(.+)$/);
      const projectId = match ? match[1] : 'unknown';
      const characterId = match ? match[2] : 'unknown';
      
      // Placeholder: Return scaffold data
      // In the future, this will fetch from the database
      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'application/json',
            text: JSON.stringify({
              status: 'scaffold',
              message: 'Character resource scaffold - database integration pending',
              projectId,
              characterId,
              character: {
                id: characterId,
                name: null,
                role: null,
                description: null,
                archetype: null,
                relationships: [],
              },
            }, null, 2),
          },
        ],
      };
    }
  );
}
