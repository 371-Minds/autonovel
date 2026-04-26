/**
 * StoryForge MCP Server - Stdio Entry Point
 * 
 * Launches the MCP server in stdio mode for use as a subprocess by MCP clients.
 * 
 * Usage:
 *   node dist/mcp/stdio.js
 * 
 * Or via tsx for development:
 *   npx tsx src/mcp/stdio.ts
 */

import { startStdioMcpServer } from './server.js';

startStdioMcpServer().catch((error) => {
  console.error('Fatal error starting MCP server:', error);
  process.exit(1);
});
