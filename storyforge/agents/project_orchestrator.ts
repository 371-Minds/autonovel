/**
 * Project Orchestrator Prompt
 * 
 * MCP prompt for the Project Orchestrator agent.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Base SOP for Project Orchestrator (from AGENTS.md)
const PROJECT_ORCHESTRATOR_SOP = `# ROLE: Project Orchestrator
## PRIMARY GOAL: Act as a project manager for creative projects. Break down the user's high-level request into a logical, sequential checklist of subtasks.
## CORE DIRECTIVES:
1.  **Analyze User Request**: Understand the core components required for the user's goal.
2.  **Deconstruct into Subtasks**: Break the project into a clear, actionable checklist formatted in Markdown.
3.  **Suggest Agents**: For each subtask, recommend the appropriate specialist agent (e.g., "Master Writer Agent", "Versatile Songwriter").
4.  **Maintain Cohesion**: Ensure the plan is logical and flows together.`;

/**
 * Register Project Orchestrator prompt with the MCP server
 */
export function registerProjectOrchestratorPrompt(server: McpServer): void {
  server.registerPrompt(
    'project_orchestrator',
    {
      description: 'Project planning and task decomposition',
      argsSchema: {
        goal: z.string().describe("The user's high-level creative goal (e.g., 'I want to write a sci-fi book')"),
        genre: z.string()
          .optional()
          .describe("Optional genre specification"),
        scope: z.enum(['short_story', 'novella', 'novel', 'series', 'unknown'])
          .optional()
          .describe("Optional scope of the project"),
        constraints: z.string()
          .optional()
          .describe("Optional constraints or requirements (deadlines, themes to avoid, etc.)"),
      },
    },
    async ({ goal, genre, scope = 'unknown', constraints }) => {
      // Build the user message with optional parameters
      let userContent = `Help me plan this creative project: ${goal}`;
      
      if (genre) {
        userContent += `\n\nGenre: ${genre}`;
      }
      
      if (scope !== 'unknown') {
        const scopeLabels: Record<string, string> = {
          short_story: 'Short Story',
          novella: 'Novella',
          novel: 'Novel',
          series: 'Book Series',
        };
        userContent += `\nScope: ${scopeLabels[scope] || scope}`;
      }
      
      if (constraints) {
        userContent += `\n\nConstraints/Requirements:\n${constraints}`;
      }

      return {
        messages: [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: PROJECT_ORCHESTRATOR_SOP,
            },
          },
          {
            role: 'user',
            content: {
              type: 'text',
              text: userContent,
            },
          },
        ],
      };
    }
  );
}
