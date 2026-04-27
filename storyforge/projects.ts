/**
 * Project Resources
 *
 * MCP resources for accessing project data.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  readProjectChapter,
  readProjectSnapshot,
  storyforgeProjectId,
} from './projectArtifacts.js';

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
      const uriString = uri.toString();
      const match = uriString.match(/project:\/\/([^/]+)$/);
      const projectId = match ? match[1] : 'unknown';
      const project = await readProjectSnapshot(projectId);

      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'application/json',
            text: JSON.stringify({
              status: project ? 'ok' : 'not_found',
              message: project
                ? 'Project resource resolved from the current Autonovel working directory'
                : `Project '${projectId}' was not found. Available project id: '${storyforgeProjectId}'.`,
              projectId: project?.projectId ?? projectId,
              metadata: project?.metadata ?? null,
              state: project?.state ?? {},
              outline: project?.outline ?? '',
              world: project?.world ?? '',
              charactersDocument: project?.charactersDocument ?? '',
              chapters: project?.chapters ?? [],
              characters: project?.characters ?? [],
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
      const uriString = uri.toString();
      const match = uriString.match(/project:\/\/([^/]+)\/chapters\/(\d+)$/);
      const projectId = match ? match[1] : 'unknown';
      const chapterNum = match ? parseInt(match[2], 10) : 0;
      const chapter = await readProjectChapter(projectId, chapterNum);

      return {
        contents: [
          {
            uri: uriString,
            mimeType: 'text/markdown',
            text: chapter
              ? chapter.content
              : [
                  '---',
                  `projectId: ${projectId}`,
                  `chapter: ${chapterNum}`,
                  'status: not_found',
                  `message: No chapter file exists for chapter ${chapterNum} in '${storyforgeProjectId}'.`,
                  '---',
                ].join('\n'),
          },
        ],
      };
    }
  );
}
