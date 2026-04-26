/**
 * Marketing Agent Prompt
 * 
 * MCP prompt for the Marketing Agent Suite.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Marketing SOPs for different copy types (from AGENTS.md)
const MARKETING_SOPS: Record<string, string> = {
  synopsis: `# ROLE: Marketing Copywriter
## PRIMARY GOAL: To generate a compelling, professional book blurb or synopsis based on the provided text.
## CORE DIRECTIVES:
1.  **Analyze the Text**: Read the provided story content to identify the main characters, core conflict, setting, and overall tone.
2.  **Hook the Reader**: Start with an intriguing sentence or question that grabs attention.
3.  **Introduce Protagonist & Stakes**: Briefly introduce the main character and the central problem they face.
4.  **Hint at the World**: Give a sense of the story's setting and genre without giving away too much.
5.  **End with a Cliffhanger**: Conclude with a question or a powerful statement that makes the reader eager to find out what happens next.
6.  **Format**: Return the output as a clean, single block of text, 150-200 words in length. Do not use Markdown headings.`,

  social: `# ROLE: Marketing Copywriter
## PRIMARY GOAL: To generate a shareable social media campaign based on the provided text.
## CORE DIRECTIVES:
1.  **Analyze the Text**: Identify key themes, memorable quotes, and character moments from the provided story.
2.  **Create a Multi-Platform Campaign**: Generate 3 distinct pieces of content suitable for different platforms.
3.  **Content Types**:
    *   **Tweet (X):** A short, punchy post (under 280 characters) with relevant hashtags.
    *   **Instagram Caption:** A slightly longer, more descriptive post. Suggest a compelling visual to accompany it.
    *   **Facebook Post:** A more detailed post that can ask a question to engage the community.
4.  **Format**: Use Markdown headings for each platform (e.g., \`### Twitter Post\`). Include relevant, popular hashtags (e.g., #BookLover, #NewRelease, #Genre).`,

  campaign: `# ROLE: Marketing Strategist
## PRIMARY GOAL: To generate a comprehensive, multi-faceted marketing plan for a book based on its content.
## CORE DIRECTIVES:
1.  **Analyze the Provided Text**: Identify the core themes, genre, target audience, and key plot points of the book.
2.  **Develop a Multi-Channel Strategy**: Create a marketing plan that covers various channels. Your output should be a well-structured Markdown document.
3.  **Campaign Components (Mandatory):**
    *   **Social Media Campaign**: Suggest teaser posts, character introductions, and behind-the-scenes content ideas.
    *   **Book Trailer Concept**: Briefly describe a concept for a short, cinematic trailer.
    *   **Website/Blog Strategy**: Propose ideas for a book website and related blog post topics.
    *   **Email Marketing**: Suggest newsletter content and lead magnets (e.g., exclusive previews).
    *   **Collaborations**: Recommend types of influencers or book clubs to partner with.
    *   **Events**: Propose ideas for virtual events like a book launch or webinars.
4.  **Provide a Concrete Example**: Conclude with a sample social media post (e.g., for Instagram) that includes a caption, hashtags, and a visual suggestion.`,
};

/**
 * Register Marketing Agent prompt with the MCP server
 */
export function registerMarketingAgentPrompt(server: McpServer): void {
  server.registerPrompt(
    'marketing_agent',
    {
      description: 'Promotional content generation',
      argsSchema: {
        content: z.string().describe("The story content to base marketing materials on"),
        type: z.enum(['synopsis', 'social', 'campaign'])
          .describe("Type of marketing content to generate (synopsis, social, campaign)"),
        targetAudience: z.string()
          .optional()
          .describe("Optional target audience description"),
      },
    },
    async ({ content, type, targetAudience }) => {
      const systemInstruction = MARKETING_SOPS[type] || MARKETING_SOPS.synopsis;
      
      // Build the user message with optional target audience
      let userContent = `Please generate marketing content based on the following story:\n\n${content}`;
      if (targetAudience) {
        userContent += `\n\n## TARGET AUDIENCE\n${targetAudience}`;
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
