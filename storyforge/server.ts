/**
 * StoryForge MCP Server
 * 
 * Exposes StoryForge's AI capabilities as MCP (Model Context Protocol) tools.
 * Can be used as a library (createMcpServer) or standalone stdio server (startStdioMcpServer).
 * 
 * This is the main entry point that composes all modular tool, resource, and prompt registrations.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Tool modules
import { registerNarrativeTools } from './tools/narrative.js';
import { registerCharacterTools } from './tools/character.js';
import { registerResearchTools } from './tools/research.js';
import { registerMemoryTools } from './tools/memory.js';
import { registerMarketingTools } from './tools/marketing.js';
import { registerExportTools } from './tools/export.js';

// Resource modules
import { registerProjectResources } from './resources/projects.js';
import { registerCharacterResources } from './resources/characters.js';

// Prompt modules
import { registerMasterWriterPrompt } from './prompts/master_writer.js';
import { registerCharacterBuilderPrompt } from './prompts/character_builder.js';
import { registerMarketingAgentPrompt } from './prompts/marketing_agent.js';
import { registerProjectOrchestratorPrompt } from './prompts/project_orchestrator.js';

/**
 * Creates and configures an MCP server with StoryForge tools.
 * The server is not connected to any transport - use `server.connect(transport)` after creation.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: 'storyforge-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Register all tools
  registerNarrativeTools(server);
  registerCharacterTools(server);
  registerResearchTools(server);
  registerMemoryTools(server);
  registerMarketingTools(server);
  registerExportTools(server);

  // Register all resources
  registerProjectResources(server);
  registerCharacterResources(server);

  // Register all prompts
  registerMasterWriterPrompt(server);
  registerCharacterBuilderPrompt(server);
  registerMarketingAgentPrompt(server);
  registerProjectOrchestratorPrompt(server);

  return server;
}

/**
 * Starts the MCP server with stdio transport for use as a subprocess.
 * This function blocks until the transport is closed.
 */
export async function startStdioMcpServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with stdio protocol on stdout
  console.error('StoryForge MCP server started on stdio');
}
