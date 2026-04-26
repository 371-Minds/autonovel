import { Agent, StructuralFramework } from '../types';

let cachedAgents: Agent[] | null = null;

const parseMarkdownToAgents = (markdown: string): Agent[] => {
    const agents: Agent[] = [];
    const sections = markdown.split('\n## ').slice(1);

    for (const section of sections) {
        if (section.includes('Marketing Agent Suite')) {
            const marketingAgentBlocks = section.split('\n### Agent ');
            for (const agentBlock of marketingAgentBlocks.slice(1)) {
                const nameMatch = agentBlock.match(/^\d+: (.*?)\n/);
                if (!nameMatch) continue;
                
                const name = nameMatch[1].trim();
                const id = `agent-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                
                const descriptionMatch = agentBlock.match(/\*\*Description\*\*: (.*?)\n/);
                const description = descriptionMatch ? descriptionMatch[1].trim() : "A specialized marketing agent.";

                const sopMatch = agentBlock.match(/### Base SOP\n```\n([\s\S]*?)\n```/);
                const baseSop = sopMatch ? sopMatch[1].trim() : '';
                
                agents.push({
                    id,
                    name,
                    description,
                    baseSop,
                    promptPlaceholder: 'The full text of your story will be automatically used as the prompt for this agent.',
                    isCustom: false
                });
            }
        } else {
            const nameMatch = section.match(/^\d+\. (.*?)\n/);
            if (!nameMatch) continue;

            const name = nameMatch[1].trim();
            const id = `agent-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            const descriptionMatch = section.match(/\*\*Description\*\*: (.*?)\n/);
            const description = descriptionMatch ? descriptionMatch[1].trim() : '';

            const baseSopMatch = section.match(/### Base SOP \(for `systemInstruction`\)\n```\n([\s\S]*?)\n```/);
            const baseSop = baseSopMatch ? baseSopMatch[1].trim() : '';
            
            const promptPlaceholder = `Enter your prompt for the ${name}...`;

            const structuralFrameworks: StructuralFramework[] = [];
            const frameworkSectionMatch = section.match(/### Available Structural Frameworks[\s\S]*/);
            if (frameworkSectionMatch) {
                const frameworkMatches = [...frameworkSectionMatch[0].matchAll(/#### (.*?)\n```\n([\s\S]*?)\n```/g)];
                for (const match of frameworkMatches) {
                    structuralFrameworks.push({
                        name: match[1].trim(),
                        sop: match[2].trim(),
                    });
                }
                if (frameworkMatches.length > 0) {
                    structuralFrameworks.push({ name: 'None', sop: '' });
                }
            }
            
            // Skip "User-Created Custom Agents" as it's just descriptive text
            if (name.toLowerCase().includes('user-created')) continue;
             if (name.toLowerCase().includes('character & world builder')) continue;


            agents.push({ id, name, description, baseSop, promptPlaceholder, structuralFrameworks, isCustom: false });
        }
    }
    return agents;
};

export const getAgents = async (): Promise<Agent[]> => {
    if (cachedAgents) {
        return cachedAgents;
    }

    try {
        const response = await fetch('/api/agents');
        if (!response.ok) {
            throw new Error(`Could not fetch agents: ${response.status} ${response.statusText}`);
        }
        const agents = await response.json() as Agent[];
        cachedAgents = agents;
        return [...cachedAgents];
    } catch (error) {
        console.error("Failed to load agents:", error);
        return []; // Return empty array on failure
    }
};