# Phase 1 Architecture: StoryForge + Autonovel

## Scope locked from user decisions

1. Hermes is the backend to integrate first.
2. StoryForge must support both:
   - a web UI surface
   - an MCP surface
3. Hugging Face free models are out of scope for now.
4. Hermes is judge-only in the first rollout.

## Current repo reality

### Autonovel is the execution engine

The runnable pipeline already exists in Python:

- `/home/runner/work/autonovel/autonovel/run_pipeline.py`
- `/home/runner/work/autonovel/autonovel/draft_chapter.py`
- `/home/runner/work/autonovel/autonovel/evaluate.py`
- `/home/runner/work/autonovel/autonovel/review.py`

Autonovel already separates model roles:

- writer: `AUTONOVEL_WRITER_MODEL`
- judge: `AUTONOVEL_JUDGE_MODEL`
- review: `AUTONOVEL_REVIEW_MODEL`

### StoryForge is the product shell and protocol layer

The StoryForge side already describes provider-aware routing and agent contracts:

- `/home/runner/work/autonovel/autonovel/storyforge/SERVICES.md`
- `/home/runner/work/autonovel/autonovel/storyforge/AGENTS.md`
- `/home/runner/work/autonovel/autonovel/storyforge/PROTOCOL.md`
- `/home/runner/work/autonovel/autonovel/storyforge/server.ts`

But the MCP project/character resources are still scaffolds:

- `/home/runner/work/autonovel/autonovel/storyforge/projects.ts`
- `/home/runner/work/autonovel/autonovel/storyforge/characters.ts`

## Phase 1 objective

Define the shared architecture and provider contract before modifying pipeline code.

Phase 1 does **not** change runtime behavior yet. It establishes the source-of-truth design for:

- StoryForge as UI + MCP layer
- Autonovel as workflow engine
- Hermes as first non-Anthropic judge backend
- role-based model selection

## Target architecture

```text
StoryForge Web UI
        |
        v
StoryForge App / MCP Server
        |
        v
Project + Job Layer
        |
        v
Autonovel Workflow Engine
        |
        v
Shared Provider Layer
   |           |
   v           v
Anthropic   Hermes
```

## Responsibilities by layer

### 1. StoryForge UI

Responsibilities:

- create and manage projects
- configure provider/model settings by role
- start long-running pipeline jobs
- stream logs and phase status
- inspect generated artifacts

Phase 1 rule:

- StoryForge does not call Hermes directly for novel judging yet.
- It calls the backend job/provider layer through a shared contract.

### 2. StoryForge MCP

Responsibilities:

- expose workflow actions as tools
- expose project artifacts as resources
- provide structured status for phase-level operations

Target MCP additions after Phase 1:

- `project_initialize_autonovel`
- `project_run_foundation`
- `project_run_drafting`
- `project_run_revision`
- `project_get_state`
- `chapter_evaluate`
- `manuscript_review`

### 3. Project + Job Layer

This is the missing integration seam.

Responsibilities:

- map a StoryForge project to an Autonovel working directory
- translate UI/MCP requests into Autonovel jobs
- persist phase status, logs, and job metadata
- normalize output into structured responses

Phase 1 decision:

- filesystem-backed project artifacts remain the source of truth first
- database indexing can come later

### 4. Autonovel Workflow Engine

Responsibilities:

- foundation generation
- drafting
- evaluation
- revision
- review
- export

Phase 1 decision:

- keep all existing pipeline semantics
- replace direct provider assumptions only behind a shared client in later phases

### 5. Shared Provider Layer

Responsibilities:

- normalize request/response handling across providers
- expose capability checks by role
- keep provider-specific auth and endpoint rules out of workflow code

Phase 1 provider rule:

- Anthropic remains available for writer/review paths
- Hermes is added first for judge paths only

## First rollout boundaries

### In scope

- architecture contract
- role-based provider strategy
- Hermes judge integration design
- StoryForge UI + MCP integration boundaries
- config/env specification

### Out of scope

- Hugging Face free models
- replacing the writer path with Hermes
- replacing review path with Hermes
- image-generation provider expansion
- data migration to a DB-first design

## Role strategy for first implementation

| Role | Provider target | Notes |
|---|---|---|
| Writer | Existing Anthropic path | Keep stable during judge integration |
| Judge | Hermes | First new provider rollout |
| Review | Existing Anthropic path | Preserve long-context manuscript review path |

## Hermes assumptions for implementation

Based on the user-provided Hermes docs and currently accessible references, Phase 1 assumes:

- Hermes exposes an OpenAI-compatible API surface.
- Hermes can serve chat-completions style requests.
- Hermes can run behind a configurable base URL.
- Hermes can be secured with an optional API key.

This means the first implementation should treat Hermes as an OpenAI-compatible judge provider, not as a custom protocol.

## Deliverables produced in this phase

1. This architecture file.
2. `/home/runner/work/autonovel/autonovel/DEV/PHASE1_PROVIDER_CONTRACT.md`
3. `/home/runner/work/autonovel/autonovel/DEV/PHASE1_ENV_AND_NEXT_STEPS.md`

## Exit criteria for Phase 1

- one agreed target architecture
- one shared provider contract
- one env/config contract for Hermes judge-only rollout
- clear implementation order for the next code phase
