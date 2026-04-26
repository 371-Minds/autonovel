# Phase 1 Provider Contract

## Goal

Define one provider contract that can be implemented on both sides:

- Python for Autonovel
- TypeScript for StoryForge

The contract must preserve existing role separation in `/home/runner/work/autonovel/autonovel/.env.example` and support Hermes as judge-only first.

## Core concepts

### Provider

A backend endpoint family such as:

- Anthropic
- Hermes

### Model role

A named workload type:

- writer
- judge
- review

### Capability

A provider/model feature needed by a workload:

- text generation
- structured output
- streaming
- long context
- openai-compatible chat

## Canonical config shape

```json
{
  "roles": {
    "writer": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-6"
    },
    "judge": {
      "provider": "hermes",
      "model": "hermes-agent"
    },
    "review": {
      "provider": "anthropic",
      "model": "claude-opus-4-6"
    }
  },
  "providers": {
    "anthropic": {
      "apiKeyEnv": "ANTHROPIC_API_KEY",
      "baseUrlEnv": "AUTONOVEL_API_BASE_URL"
    },
    "hermes": {
      "apiKeyEnv": "HERMES_API_KEY",
      "baseUrlEnv": "HERMES_API_BASE_URL"
    }
  }
}
```

## Required interface

### 1. Text generation

Use for:

- chapter evaluation
- foundation evaluation
- critique/judge responses

Contract:

```text
generateText(
  role,
  prompt,
  systemInstruction?,
  options?
) -> ProviderTextResponse
```

### 2. Structured generation

Use for:

- judge outputs that must be parsed into scores
- future StoryForge structured tool responses

Contract:

```text
generateStructured(
  role,
  prompt,
  schema,
  systemInstruction?,
  options?
) -> ProviderStructuredResponse
```

### 3. Streaming generation

Needed by StoryForge UX, but not required for first Autonovel Hermes judge cutover.

Contract:

```text
streamText(
  role,
  prompt,
  systemInstruction?,
  options?
) -> async text chunks
```

## Required request fields

Every provider adapter must accept:

- `role`
- `model`
- `prompt`
- `systemInstruction` optional
- `temperature` optional
- `maxTokens` optional
- `responseFormat` optional
- `timeoutSeconds`

## Required normalized response fields

Every provider adapter must return:

- `provider`
- `model`
- `text`
- `raw`
- `usage` optional
- `finishReason` optional
- `latencyMs` optional

## Provider capability registry

Each provider/model pair must advertise:

```json
{
  "supportsText": true,
  "supportsStructuredOutput": true,
  "supportsStreaming": true,
  "supportsLongContext": false,
  "supportsImageGeneration": false,
  "protocol": "openai-compatible"
}
```

## Role requirements

### Writer

Needs:

- strong long-form prose generation
- stable long context
- predictable narrative quality

Phase 1 result:

- keep on Anthropic

### Judge

Needs:

- prompt-following
- score/rationale output
- structured output or predictable formatting
- lower latency than full-manuscript review is acceptable

Phase 1 result:

- move to Hermes first

### Review

Needs:

- strongest long-context behavior
- full-manuscript critique quality

Phase 1 result:

- keep on Anthropic

## Hermes adapter contract

Hermes should be implemented as:

- provider id: `hermes`
- protocol: `openai-compatible`
- endpoint base: `HERMES_API_BASE_URL`
- auth: optional `HERMES_API_KEY`

Expected endpoints:

- `GET /v1/models`
- `POST /v1/chat/completions`
- `GET /health` when available

## Backward-compatibility rule

The shared provider layer must support current Autonovel env usage while introducing role/provider separation.

That means existing code can be migrated in two stages:

1. read existing `AUTONOVEL_*_MODEL` values
2. resolve each role to a provider adapter

## First migration target

The first consumer of this contract should be the judge path in:

- `/home/runner/work/autonovel/autonovel/evaluate.py`
- `/home/runner/work/autonovel/autonovel/reader_panel.py`
- `/home/runner/work/autonovel/autonovel/adversarial_edit.py`
- `/home/runner/work/autonovel/autonovel/compare_chapters.py`

`/home/runner/work/autonovel/autonovel/review.py` should stay on Anthropic in the first pass.
