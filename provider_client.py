#!/usr/bin/env python3
"""Shared provider client for role-based text generation."""

from __future__ import annotations

import os
from typing import Any

import httpx


def _role_env_prefix(role: str) -> str:
    normalized = role.strip().upper()
    if not normalized or not normalized.replace("_", "").isalnum():
        raise ValueError(f"Invalid model role: {role!r}")
    return normalized


def get_role_provider(role: str, default: str = "anthropic") -> str:
    """Resolve the configured provider for a model role."""
    value = os.environ.get(f"AUTONOVEL_{_role_env_prefix(role)}_PROVIDER", default)
    return value.strip().lower() or default


def get_role_model(role: str, default: str) -> str:
    """Resolve the configured model for a model role."""
    value = os.environ.get(f"AUTONOVEL_{_role_env_prefix(role)}_MODEL", default)
    return value.strip() or default


def generate_text(
    *,
    role: str,
    prompt: str,
    system: str,
    default_model: str,
    max_tokens: int,
    temperature: float = 0.3,
    timeout: int = 180,
    anthropic_beta: str | None = None,
) -> str:
    """Generate text using the provider configured for the given role."""
    provider = get_role_provider(role)
    model = get_role_model(role, default_model)

    if provider == "anthropic":
        return _generate_anthropic_text(
            prompt=prompt,
            system=system,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            timeout=timeout,
            beta=anthropic_beta,
        )

    if provider == "hermes":
        return _generate_openai_compatible_text(
            prompt=prompt,
            system=system,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            timeout=timeout,
        )

    raise ValueError(f"Unsupported provider for role '{role}': {provider}")


def _generate_anthropic_text(
    *,
    prompt: str,
    system: str,
    model: str,
    max_tokens: int,
    temperature: float,
    timeout: int,
    beta: str | None,
) -> str:
    headers = {
        "x-api-key": os.environ.get("ANTHROPIC_API_KEY", ""),
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    if beta:
        headers["anthropic-beta"] = beta

    payload = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "system": system,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = httpx.post(
        _anthropic_messages_url(),
        headers=headers,
        json=payload,
        timeout=timeout,
    )
    response.raise_for_status()

    content = response.json().get("content", [])
    if not content:
        raise ValueError("Anthropic response did not include content")
    return content[0]["text"]


def _generate_openai_compatible_text(
    *,
    prompt: str,
    system: str,
    model: str,
    max_tokens: int,
    temperature: float,
    timeout: int,
) -> str:
    headers = {"content-type": "application/json"}
    api_key = os.environ.get("HERMES_API_KEY", "").strip()
    if api_key:
        headers["authorization"] = f"Bearer {api_key}"

    payload = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    }

    response = httpx.post(
        _hermes_chat_completions_url(),
        headers=headers,
        json=payload,
        timeout=timeout,
    )
    response.raise_for_status()

    choices = response.json().get("choices", [])
    if not choices:
        raise ValueError("OpenAI-compatible response did not include choices")
    message = choices[0].get("message", {})
    return _extract_openai_message_text(message.get("content", ""))


def _anthropic_messages_url() -> str:
    base = _normalize_base_url(
        os.environ.get("AUTONOVEL_API_BASE_URL", "https://api.anthropic.com"),
        ensure_v1=False,
    )
    return f"{base}/v1/messages"


def _hermes_chat_completions_url() -> str:
    base = _normalize_base_url(
        os.environ.get("HERMES_API_BASE_URL", "http://localhost:8642"),
        ensure_v1=True,
    )
    return f"{base}/chat/completions"


def _normalize_base_url(base: str, *, ensure_v1: bool) -> str:
    normalized = base.rstrip("/")
    if ensure_v1 and not normalized.endswith("/v1"):
        return f"{normalized}/v1"
    if not ensure_v1 and normalized.endswith("/v1"):
        return normalized.removesuffix("/v1")
    return normalized


def _extract_openai_message_text(content: Any) -> str:
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
            elif isinstance(item, str):
                parts.append(item)
        return "".join(parts)

    raise ValueError("Unsupported OpenAI-compatible content format")
