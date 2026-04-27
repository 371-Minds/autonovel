# Phase 1 Environment and Next Steps

## Environment contract for first rollout

Current repo env:

- `.env.example`

Current state is Anthropic-first and single-base-url oriented.

## Proposed additions

```dotenv
# Provider routing by role
AUTONOVEL_WRITER_PROVIDER=anthropic
AUTONOVEL_JUDGE_PROVIDER=hermes
AUTONOVEL_REVIEW_PROVIDER=anthropic

# Existing model selections remain valid
AUTONOVEL_WRITER_MODEL=claude-sonnet-4-6
AUTONOVEL_JUDGE_MODEL=hermes-agent
AUTONOVEL_REVIEW_MODEL=claude-opus-4-6

# Anthropic
ANTHROPIC_API_KEY=
AUTONOVEL_API_BASE_URL=https://api.anthropic.com

# Hermes
HERMES_API_BASE_URL=http://localhost:8642/v1
HERMES_API_KEY=
HERMES_HEALTH_URL=http://localhost:8642/health
```

## StoryForge-side config additions

The provider shape documented in `storyforge/SERVICES.md` should be expanded from:

- Gemini
- Arch Gateway
- Cloudflare AI Gateway

to also include:

- Anthropic
- Hermes

Hermes should be modeled as an OpenAI-compatible provider with:

- base URL
- optional API key
- default model

## Implementation order for the next code phase

### Step 1

Create a shared Python provider client module for Autonovel.

Target:

- centralize all HTTP calls now duplicated across the Python scripts

### Step 2

Move judge-only scripts to the shared client.

Order:

1. `evaluate.py`
2. `adversarial_edit.py`
3. `compare_chapters.py`
4. `reader_panel.py`

### Step 3

Leave review on Anthropic.

Do not move:

- `review.py`

### Step 4

Define StoryForge provider/types updates so both UI and MCP can express:

- provider by role
- model by role
- base URL by provider
- secret fields by provider

### Step 5

Replace scaffold MCP project resources with real project-backed reads after the provider layer exists.

## Success criteria for next code phase

- judge path can target Hermes without changing writer/review behavior
- no direct Anthropic-specific logic remains in migrated judge scripts
- provider selection is role-based, not global-only
- StoryForge config contract matches backend reality

## Risk controls

### Risk: judge output format drift

Mitigation:

- require structured score blocks or normalized parseable sections
- add adapter-level validation before returning to pipeline code

### Risk: Hermes endpoint mismatch

Mitigation:

- verify `/v1/chat/completions` and `/v1/models` first
- implement health check and startup validation

### Risk: breaking review quality

Mitigation:

- keep `review.py` on Anthropic in first rollout

### Risk: StoryForge spec drift from backend

Mitigation:

- use these Phase 1 files as the source docs for the next implementation phase
