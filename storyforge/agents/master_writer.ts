/**
 * Master Writer Prompt
 * 
 * MCP prompt for the Master Writer agent using the SOP from AGENTS.md.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Base SOP for Master Writer Agent (from AGENTS.md)
const MASTER_WRITER_SOP = `# ROLE: Master Writer Agent
## PRIMARY DIRECTIVE: You are a master writer, an expert in narrative craft and storytelling. You will generate, refine, and edit content based on the user's request and the structural framework provided.
## CORE CAPABILITIES:
- Generate complete chapters and scenes.
- Develop intricate character profiles and arcs.
- Maintain a consistent narrative voice, tone, and flow.
- Adhere strictly to the provided story structure.`;

// Structural Frameworks (from AGENTS.md)
const STRUCTURAL_FRAMEWORKS: Record<string, string> = {
  angular_momentum: `### MANDATORY WRITING FRAMEWORK: Story Structure Inspired by Conservation of Angular Momentum
You must adhere to the following 6-part structure, using the physics parallels as a guide for the story's dynamics.

1.  **Introduction: Establishing the System (Exposition)**
    *   **Physics Parallel:** Angular momentum depends on mass, velocity, and radius. The initial system is stable and in balance.
    *   **Story Application:** Introduce the story's "system" (e.g., a family, a community). Establish their relationships, roles, and the forces that keep them in balance.
2.  **Inciting Incident: External Torque**
    *   **Physics Parallel:** Angular momentum only changes when an external torque is applied.
    *   **Story Application:** Introduce a disruptive force (an event, a character, a revelation) that acts as the "torque," destabilizing the balance.
3.  **Rising Action: Redistribution of Momentum**
    *   **Physics Parallel:** When one part of a system changes (e.g., radius decreases), velocity must increase to conserve momentum.
    *   **Story Application:** Characters adapt to the disruption. Some take on more responsibility (increase velocity), while others withdraw (decrease radius). This creates tension and conflict.
4.  **Climax: Maximum Tension and Critical Rotation**
    *   **Physics Parallel:** The system reaches a critical point where forces are at their peak, and balance is most precarious.
    *   **Story Application:** The story climaxes as characters face the full consequences of the disruption. The system is spinning at its fastest; the outcome is uncertain.
5.  **Falling Action: Restoring Balance**
    *   **Physics Parallel:** The system begins to stabilize, redistributing momentum to find a new equilibrium.
    *   **Story Application:** Characters work to restore balance, either by resolving the conflict or adapting to a new normal.
6.  **Resolution: A New Equilibrium**
    *   **Physics Parallel:** The system achieves a new, stable state with angular momentum conserved in a different configuration.
    *   **Story Application:** Conclude by showing how the system has changed and what characters have learned. Highlight the new dynamics.`,

  three_act: `### MANDATORY WRITING FRAMEWORK: The Three-Act Structure
1.  **Act I: The Setup**: Introduce the protagonist and their world. The inciting incident occurs, setting the story in motion and leading to a turning point.
2.  **Act II: The Confrontation**: The protagonist faces rising stakes and obstacles, culminating in a midpoint crisis.
3.  **Act III: The Resolution**: The protagonist confronts the final challenge, leading to the climax and the ultimate resolution of the story.`,

  hero_journey: `### MANDATORY WRITING FRAMEWORK: The Hero's Journey
1.  **The Ordinary World**: Introduce the hero.
2.  **The Call to Adventure**: The hero is presented with a challenge.
3.  **Refusal of the Call**: The hero is hesitant.
4.  **Meeting the Mentor**: The hero gains guidance.
5.  **Crossing the Threshold**: The hero enters the special world.
6.  **Tests, Allies, and Enemies**: The hero faces trials.
7.  **The Ordeal**: The hero faces their greatest fear.
8.  **The Reward**: The hero achieves their goal.
9.  **The Road Back**: The journey home begins.
10. **The Resurrection**: The final, most dangerous encounter.
11. **Return with the Elixir**: The hero returns, transformed.`,
};

/**
 * Register Master Writer prompt with the MCP server
 */
export function registerMasterWriterPrompt(server: McpServer): void {
  server.registerPrompt(
    'master_writer',
    {
      description: 'Narrative generation with structural framework adherence',
      argsSchema: {
        userRequest: z.string().describe("The user's writing request or prompt"),
        framework: z.enum(['none', 'angular_momentum', 'three_act', 'hero_journey'])
          .optional()
          .describe("Structural framework to apply (none, angular_momentum, three_act, hero_journey)"),
        projectContext: z.string()
          .optional()
          .describe("Optional project context (title, characters, plot summary)"),
      },
    },
    async ({ userRequest, framework = 'none', projectContext }) => {
      // Build the complete system instruction
      let systemInstruction = MASTER_WRITER_SOP;
      if (framework !== 'none' && STRUCTURAL_FRAMEWORKS[framework]) {
        systemInstruction += '\n\n' + STRUCTURAL_FRAMEWORKS[framework];
      }

      // Build the user message with optional context
      let userContent = userRequest;
      if (projectContext) {
        userContent = `## PROJECT CONTEXT\n${projectContext}\n\n## REQUEST\n${userRequest}`;
      }

      return {
        messages: [
          {
            role: 'assistant',
            content: {
              type: 'text',
              text: systemInstruction,
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
