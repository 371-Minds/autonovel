/**
 * Research Domain Tools
 * 
 * Tools for web search and fact-checking using Brave Search API.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { webSearch, factCheck } from '../../services/braveSearchService.js';

/**
 * Register research domain tools with the MCP server
 */
export function registerResearchTools(server: McpServer): void {
  // Tool: research_web_search
  server.registerTool(
    'research_web_search',
    {
      description: 'Search web for research, trends, comparable works',
      inputSchema: {
        query: z.string().describe("The search query"),
        maxResults: z.number().optional().describe("Maximum number of results to return (default: 10)"),
      },
    },
    async ({ query, maxResults }) => {
      try {
        const results = await webSearch(query, maxResults);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                query,
                maxResults: maxResults || 10,
                resultCount: results.length,
                results,
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
                query,
                results: [],
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: research_fact_check
  server.registerTool(
    'research_fact_check',
    {
      description: 'Verify factual claims in narrative',
      inputSchema: {
        claim: z.string().describe("The factual claim to verify"),
        context: z.string().describe("Additional context for the claim"),
      },
    },
    async ({ claim, context }) => {
      try {
        const result = await factCheck(claim, context);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                claim: result.claim,
                assessment: result.assessment,
                resultCount: result.searchResults.length,
                searchResults: result.searchResults,
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
                claim,
                context,
                searchResults: [],
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
