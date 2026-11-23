#!/usr/bin/env bash
# Hook PostToolUse (matcher Edit|Write): formatea con Prettier SOLO el archivo que el agente acaba
# de editar. Respeta .prettierignore (Markdown, openspec/ y .claude/ no se formatean a propósito).
set -uo pipefail
command -v jq >/dev/null 2>&1 || exit 0   # formatear es una comodidad: sin jq, no hace nada
f="$(cat | jq -r '.tool_input.file_path // empty')"
[[ -n "$f" && -f "$f" ]] || exit 0
case "$f" in
  *.ts|*.tsx|*.js|*.mjs|*.cjs|*.json|*.css|*.html)
    npx --no-install prettier --write "$f" --log-level warn >/dev/null 2>&1 || true ;;
esac
exit 0
