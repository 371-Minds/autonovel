/**
 * Marketing Domain Tools
 * 
 * Tools for generating promotional copy and scheduling social media posts.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { generateNarrative } from '../../services/aiRouter.js';
import { queuePost } from '../../services/socialScheduler.js';
import { AiProviderConfig } from '../../types.js';

// Default AI provider configuration for MCP tools
function getDefaultAiConfig(provider?: string): AiProviderConfig {
  const providerType = provider || process.env.STORYFORGE_AI_PROVIDER || 'Gemini';
  
  return {
    provider: providerType as AiProviderConfig['provider'],
    archGatewaySettings: {
      baseUrl: process.env.ARCH_GATEWAY_URL || 'http://localhost:8080',
    },
    cloudflareSettings: {
      gatewayUrl: process.env.CLOUDFLARE_GATEWAY_URL || '',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      model: process.env.CLOUDFLARE_MODEL || 'gemini-2.5-pro',
    },
  };
}

// Marketing SOPs from AGENTS.md
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
 * Register marketing domain tools with the MCP server
 */
export function registerMarketingTools(server: McpServer): void {
  // Tool: marketing_generate_copy
  server.registerTool(
    'marketing_generate_copy',
    {
      description: 'Generate promotional copy (synopsis, social posts, campaign plans)',
      inputSchema: {
        type: z.enum(['synopsis', 'social', 'campaign']).describe("The type of marketing copy to generate"),
        content: z.string().describe("The story content to base the marketing copy on"),
        provider: z.string().optional().describe("Optional AI provider override (Gemini, Arch Gateway, Cloudflare AI Gateway)"),
      },
    },
    async ({ type, content, provider }) => {
      try {
        const config = getDefaultAiConfig(provider);
        const systemInstruction = MARKETING_SOPS[type] || MARKETING_SOPS.synopsis;
        
        const prompt = `Please generate marketing copy based on the following story content:\n\n${content}`;
        
        const result = await generateNarrative(prompt, systemInstruction, undefined, config);
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error generating marketing copy: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: marketing_schedule_post
  server.registerTool(
    'marketing_schedule_post',
    {
      description: 'Schedule social media posts across platforms',
      inputSchema: {
        platform: z.enum(['twitter', 'linkedin', 'bluesky']).describe("The social media platform"),
        content: z.string().describe("The post content"),
        scheduledAt: z.string().optional().describe("ISO 8601 timestamp for when to schedule the post"),
      },
    },
    async ({ platform, content, scheduledAt }) => {
      try {
        const result = queuePost(platform, content, scheduledAt);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: result.message,
                post: result.post,
                scheduled: true,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                message: `Failed to schedule post: ${errorMessage}`,
                platform,
                content,
                scheduledAt,
                scheduled: false,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
