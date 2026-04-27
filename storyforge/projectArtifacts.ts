import { readdir, readFile, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface ProjectState {
  phase?: string;
  current_focus?: string | null;
  iteration?: number;
  foundation_score?: number;
  lore_score?: number;
  chapters_drafted?: number;
  chapters_total?: number;
  novel_score?: number;
  debts?: unknown[];
  [key: string]: unknown;
}

interface ChapterRecord {
  number: number;
  filename: string;
  title: string;
  content: string;
  wordCount: number;
  updatedAt: string;
}

interface CharacterRecord {
  id: string;
  name: string;
  role: string | null;
  description: string;
  section: string;
}

export interface ProjectSnapshot {
  projectId: string;
  metadata: {
    title: string;
    description: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  state: ProjectState;
  outline: string;
  world: string;
  charactersDocument: string;
  chapters: Array<{
    number: number;
    filename: string;
    title: string;
    wordCount: number;
    updatedAt: string;
  }>;
  characters: CharacterRecord[];
}

const STORYFORGE_DIR = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const PROJECT_ID = 'autonovel';
const PROJECT_ALIASES = new Set([PROJECT_ID, 'current', 'default', basename(PROJECT_ROOT).toLowerCase()]);
const CHARACTER_ID_IGNORED_QUOTES = /[\u0027\u2019]/g;

export async function readProjectSnapshot(projectId: string): Promise<ProjectSnapshot | null> {
  if (!isKnownProjectId(projectId)) {
    return null;
  }

  const [state, outline, world, charactersDocument, chapters, characters] = await Promise.all([
    readStateFile(),
    readTextFile('outline.md'),
    readTextFile('world.md'),
    readTextFile('characters.md'),
    readChapters(),
    readCharacters(),
  ]);

  const timestamps = await collectProjectTimestamps(chapters.map((chapter) => join('chapters', chapter.filename)));

  return {
    projectId: PROJECT_ID,
    metadata: {
      title: PROJECT_ID,
      description: state.current_focus ?? null,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    },
    state,
    outline,
    world,
    charactersDocument,
    chapters: chapters.map(({ content: _content, ...chapter }) => chapter),
    characters,
  };
}

export async function readProjectChapter(projectId: string, chapterNumber: number): Promise<ChapterRecord | null> {
  if (!isKnownProjectId(projectId)) {
    return null;
  }

  const chapters = await readChapters();
  return chapters.find((chapter) => chapter.number === chapterNumber) ?? null;
}

export async function readProjectCharacter(projectId: string, characterId: string): Promise<CharacterRecord | null> {
  if (!isKnownProjectId(projectId)) {
    return null;
  }

  const normalizedId = normalizeCharacterId(characterId);
  const characters = await readCharacters();
  return characters.find((character) => character.id === normalizedId) ?? null;
}

function isKnownProjectId(projectId: string): boolean {
  const normalized = projectId.trim().toLowerCase();
  return PROJECT_ALIASES.has(normalized);
}

async function readStateFile(): Promise<ProjectState> {
  try {
    const text = await readFile(join(PROJECT_ROOT, 'state.json'), 'utf8');
    return JSON.parse(text) as ProjectState;
  } catch {
    return {};
  }
}

async function readTextFile(relativePath: string): Promise<string> {
  try {
    return await readFile(join(PROJECT_ROOT, relativePath), 'utf8');
  } catch {
    return '';
  }
}

async function readChapters(): Promise<ChapterRecord[]> {
  const chapterDir = join(PROJECT_ROOT, 'chapters');
  let filenames: string[];

  try {
    filenames = await readdir(chapterDir);
  } catch {
    return [];
  }

  const chapterFiles = filenames
    .map((filename) => {
      const match = filename.match(/^ch_(\d+)\.md$/);
      return match ? { filename, number: parseInt(match[1], 10) } : null;
    })
    .filter((entry): entry is { filename: string; number: number } => entry !== null)
    .sort((left, right) => left.number - right.number);

  const chapters = await Promise.all(
    chapterFiles.map(async ({ filename, number }) => {
      const fullPath = join(chapterDir, filename);
      try {
        const content = await readFile(fullPath, 'utf8');
        const fileStat = await stat(fullPath);

        return {
          number,
          filename,
          title: inferChapterTitle(content, number),
          content,
          wordCount: countWords(content),
          updatedAt: fileStat.mtime.toISOString(),
        };
      } catch {
        return null;
      }
    })
  );

  return chapters.filter((chapter): chapter is ChapterRecord => chapter !== null);
}

async function readCharacters(): Promise<CharacterRecord[]> {
  const charactersDocument = await readTextFile('characters.md');
  return parseCharactersDocument(charactersDocument);
}

function parseCharactersDocument(markdown: string): CharacterRecord[] {
  const visibleMarkdown = stripHtmlComments(markdown);
  const matches = [...visibleMarkdown.matchAll(/^##\s+(.+)$/gm)];

  return matches.map((match, index) => {
    const name = match[1].trim();
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? visibleMarkdown.length : visibleMarkdown.length;
    const section = visibleMarkdown.slice(start, end).trim();
    const roleMatch = section.match(/^- Role:\s*(.+)$/m);
    const description = section
      .split('\n')
      .slice(1)
      .join('\n')
      .trim();

    return {
      id: normalizeCharacterId(name),
      name,
      role: roleMatch ? roleMatch[1].trim() : null,
      description,
      section,
    };
  });
}

function stripHtmlComments(content: string): string {
  let result = '';
  let index = 0;

  while (index < content.length) {
    const commentStart = content.indexOf('<!--', index);
    if (commentStart === -1) {
      result += content.slice(index);
      break;
    }

    result += content.slice(index, commentStart);

    const standardEnd = content.indexOf('-->', commentStart + 4);
    const alternateEnd = content.indexOf('--!>', commentStart + 4);
    const commentEndCandidates = [standardEnd, alternateEnd].filter((value) => value !== -1);

    if (commentEndCandidates.length === 0) {
      break;
    }

    const commentEnd = Math.min(...commentEndCandidates);
    index = commentEnd + (commentEnd === alternateEnd ? 4 : 3);
  }

  return result;
}

function inferChapterTitle(content: string, chapterNumber: number): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  const boldMatch = content.match(/^\*\*([^*]+)\*\*$/m);
  if (boldMatch) {
    return boldMatch[1].trim();
  }

  return `Chapter ${chapterNumber}`;
}

function countWords(content: string): number {
  const normalized = content.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

function normalizeCharacterId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(CHARACTER_ID_IGNORED_QUOTES, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function collectProjectTimestamps(chapterPaths: string[]): Promise<{ createdAt: string | null; updatedAt: string | null }> {
  const paths = ['state.json', 'outline.md', 'world.md', 'characters.md', ...chapterPaths];
  const timestamps: number[] = [];

  await Promise.all(
    paths.map(async (relativePath) => {
      try {
        const fileStat = await stat(join(PROJECT_ROOT, relativePath));
        timestamps.push(fileStat.mtimeMs);
      } catch {
        // Ignore missing files; resources should still resolve with partial data.
      }
    })
  );

  if (timestamps.length === 0) {
    return { createdAt: null, updatedAt: null };
  }

  return {
    createdAt: new Date(Math.min(...timestamps)).toISOString(),
    updatedAt: new Date(Math.max(...timestamps)).toISOString(),
  };
}

export const storyforgeProjectRoot = PROJECT_ROOT;
export const storyforgeProjectId = PROJECT_ID;
export const storyforgeRuntimeDir = STORYFORGE_DIR;
