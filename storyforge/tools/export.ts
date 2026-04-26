/**
 * Export Domain Tools
 * 
 * Tools for document format conversion using pandoc.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { convertDocument, ExportFormat } from '../../services/exportService.js';

/**
 * Register export domain tools with the MCP server
 */
export function registerExportTools(server: McpServer): void {
  // Tool: export_convert_document
  server.registerTool(
    'export_convert_document',
    {
      description: 'Convert document format (e.g., markdown to PDF, EPUB, DOCX, HTML)',
      inputSchema: {
        content: z.string().describe("The document content to convert"),
        fromFormat: z.literal('markdown').describe("The source format (only markdown supported currently)"),
        toFormat: z.enum(['pdf', 'epub', 'docx', 'html']).describe("The target format for conversion"),
      },
    },
    async ({ content, fromFormat, toFormat }) => {
      try {
        const result = await convertDocument(content, toFormat as ExportFormat);
        
        // Return the file as base64-encoded content
        const base64Content = result.data.toString('base64');
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: `Document converted to ${toFormat} successfully`,
                format: toFormat,
                mimeType: result.mimeType,
                filename: result.filename,
                contentLength: result.data.length,
                base64Content,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                message: errorMessage,
                format: toFormat,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
