/**
 * Character Resources
 * 
 * MCP resources for accessing character profile data.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  readProjectCharacter,
  storyforgeProjectId,
} from './projectArtifacts.js';

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
      const uriString = uri.toString();
      const match = uriString.match(/character:\/\/([^/]+)\/(.+)$/);
      const projectId = match ? match[1] : 'unknown';
      const characterId = match ? match[2] : 'unknown';
      const character = await readProjectCharacter(projectId, characterId);

      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'application/json',
            text: JSON.stringify({
              status: character ? 'ok' : 'not_found',
              message: character
                ? 'Character resource resolved from characters.md in the current Autonovel working directory'
                : `Character '${characterId}' was not found for project '${projectId}'. Available project id: '${storyforgeProjectId}'.`,
              projectId,
              characterId,
              character,
            }, null, 2),
          },
        ],
      };
    }
  );
}
