#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): no deja commitear CÓDIGO con los tests en rojo.
# - Solo actúa si el comando es un `git commit` (también `git -C <dir> commit`, `git -c k=v commit`…).
# - Mira lo que entra en el commit: lo preparado; con `-a`/`--all`/`-am` o `git add -A`/`.`, todo lo
#   modificado y lo nuevo; con `git add <rutas>` en el mismo comando (también `git -C . add`), solo
#   esas rutas; si el comando hace `cd`/`pushd` o genera rutas con `$(…)`, todo.
# - Limitación conocida: `git commit <ruta>`, `git stage` y los alias de git no se analizan; el CI
#   es la red final.
# - Si entra código o configuración ejecutable (src/, public/, package*.json, tsconfig.json),
#   ejecuta la suite; si falla, bloquea (exit 2) y devuelve al agente las últimas líneas.
# - Los commits de SOLO tests, specs o documentación pasan sin ejecutar nada: así se puede
#   commitear la fase ROJA de TDD («tests en rojo») sin desactivar el guardarraíl.
# Pruébalo: rompe un test, toca src/ y pide un commit; o a mano:
#   echo '{"tool_input":{"command":"git add -A && git commit -m x"}}' | bash .claude/hooks/tests-antes-de-commit.sh; echo "exit=$?"
set -uo pipefail

TEST_CMD="${TEST_CMD:-npm test}"
input="$(cat)"
if ! command -v jq >/dev/null 2>&1; then
  if [[ "$input" == *"commit"* ]]; then
    echo "BLOQUEADO: el hook tests-antes-de-commit necesita 'jq' y no está instalado (Windows: winget install jqlang.jq)." >&2
    exit 2
  fi
  exit 0
fi
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
# ¿Es un commit? También con opciones globales de git: `git -C <dir> commit`, `git -c k=v commit`,
# `git --no-pager commit`…
es_commit='(^|[;&|([:space:]])git(([[:space:]]+-[Cc][[:space:]]+[^[:space:]]+)|([[:space:]]+--[a-z-]+(=[^[:space:]]+)?))*[[:space:]]+commit([[:space:]]|$)'
[[ "$cmd" =~ $es_commit ]] || exit 0
# ¿Qué parte de lo NO preparado entra también? (el hook corre ANTES de que se ejecute el comando)
#   - `git commit -a`/`--all`/`-am`, o `git add -A`/`--all`/`-u`/`.`  → todo
#   - `cd`, `pushd` o `$(…)` en el comando                          → todo (rutas no resolubles)
#   - `git add <rutas>`                                               → solo esas rutas
#   - nada de lo anterior                                             → nada (solo lo ya preparado)
ambito=()
git_global='git(([[:space:]]+-[Cc][[:space:]]+[^[:space:]]+)|([[:space:]]+--[a-z-]+(=[^[:space:]]+)?))*'
con_a='[[:space:]](-[a-zA-Z]*a[a-zA-Z]*|--all)([[:space:]]|$)'
# Si el comando cambia de carpeta o genera las rutas (`cd`, `pushd`, `$(…)`, comillas invertidas),
# no sabemos resolverlas: lo prudente es revisar todo.
dudoso='(^|[;&|[:space:]])(cd|pushd)[[:space:]]|[$][(]|`'
[[ "$cmd" =~ $con_a || "$cmd" =~ $dudoso ]] && ambito=(.)
while IFS= read -r args; do
  read -ra palabras <<<"$args"
  for p in "${palabras[@]}"; do
    p="${p//[\"\']/}"
    case "$p" in
      -A | --all | -u | --update | . | :/ | '*') ambito=(.) ;;
      -*) ;;
      *) [[ "${ambito[*]-}" == "." ]] || ambito+=("$p") ;;
    esac
  done
done < <(grep -oE "${git_global}[[:space:]]+add([[:space:]][^;&|]*)?" <<<"$cmd" | sed -E "s/^${git_global}[[:space:]]+add//")
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

archivos="$(git diff --cached --name-only)"
if (( ${#ambito[@]} )); then
  archivos+=$'\n'"$(git diff --name-only -- "${ambito[@]}")"
  archivos+=$'\n'"$(git ls-files --others --exclude-standard -- "${ambito[@]}")"
fi

if ! grep -qE '^(src/|public/|package(-lock)?\.json$|tsconfig\.json$)' <<<"$archivos"; then
  exit 0   # solo tests, specs o docs
fi

if salida="$($TEST_CMD 2>&1)"; then
  exit 0
fi
echo "BLOQUEADO por tests-antes-de-commit: el commit incluye código y \`$TEST_CMD\` falla. Arregla el código (no cambies un test salvo que contradiga la spec) y vuelve a intentarlo. Últimas líneas:" >&2
printf '%s\n' "$salida" | tail -n 25 >&2
exit 2
