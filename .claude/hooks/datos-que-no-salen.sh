#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): impide commitear claves, correos reales o ficheros .env.
# Especificación:
#   - Solo actúa si el comando es un `git commit` (también `git -C <dir> commit`, `git -c k=v commit`…).
#   - Mira las líneas AÑADIDAS de `git diff --cached`; con `-a`/`--all`/`-am` o `git add -A`/`.`, también
#     todo lo no preparado y lo nuevo; con `git add <rutas>` en el mismo comando (también
#     `git -C . add`), solo esas rutas; con `cd`/`pushd`/`$(…)`, todo; con `git add -f`, también
#     los archivos ignorados.
#   - No revisa el mensaje del commit (`-m`), `git stage` ni los alias de git.
#   - Tres reglas, solo estas: (1) clave con forma reconocible, (2) correo cuyo dominio no sea
#     example.com/.org/.net ni github.com (o un subdominio,
#     p. ej. users.noreply.github.com), (3) un fichero llamado exactamente `.env`.
#   - Si encuentra algo: exit 2 + explicación por stderr + UNA línea en
#     docs/seguridad/registro-de-bloqueos.md (fecha UTC, BLOQUEADO, regla, archivo). NUNCA el valor.
# Requisitos: bash, git, jq, awk (en Windows: Git Bash + jq en el PATH).
# Pruébalo:  echo '{"tool_input":{"command":"git commit -m x"}}' | bash .claude/hooks/datos-que-no-salen.sh; echo "exit=$?"
set -uo pipefail

input="$(cat)"
if ! command -v jq >/dev/null 2>&1; then
  # Sin jq no podemos leer el comando: nunca dejamos pasar un commit sin comprobar.
  if [[ "$input" == *"commit"* ]]; then
    echo "BLOQUEADO: el hook datos-que-no-salen necesita 'jq' y no está instalado (Windows: winget install jqlang.jq)." >&2
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
#   - `git add -f`                                                    → también los ignorados
#   - `git add <rutas>`                                               → solo esas rutas
#   - nada de lo anterior                                             → nada (solo lo ya preparado)
ambito=()
forzado=0   # `git add -f`: también entran archivos ignorados (p. ej. un .env)
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
      -f | --force) forzado=1 ;;
      -*) ;;
      *) [[ "${ambito[*]-}" == "." ]] || ambito+=("$p") ;;
    esac
  done
done < <(grep -oE "${git_global}[[:space:]]+add([[:space:]][^;&|]*)?" <<<"$cmd" | sed -E "s/^${git_global}[[:space:]]+add//")

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
LOG="docs/seguridad/registro-de-bloqueos.md"

# Con `git add -f`, los ignorados que entrarían. Rutas nombradas: archivo a archivo. Con `.`, cada
# carpeta ignorada sale como una sola entrada (`--directory`), sin recorrer p. ej. node_modules/.
ignorados_forzados() {
  (( forzado )) || return 0
  if [[ "${ambito[*]}" == "." ]]; then
    git ls-files --others --ignored --exclude-standard --directory -- .
  else
    git ls-files --others --ignored --exclude-standard -- "${ambito[@]}"
  fi
}

# Flujo "archivo<TAB>línea añadida"
lineas_anadidas() {
  local diff_awk='/^\+\+\+ b\//{f=substr($0,7);next} /^\+\+\+/{next} /^\+/{print f "\t" substr($0,2)}'
  git diff --cached -U0 --no-color | awk "$diff_awk"
  if (( ${#ambito[@]} )); then
    git diff -U0 --no-color -- "${ambito[@]}" | awk "$diff_awk"
    { git ls-files --others --exclude-standard -- "${ambito[@]}"; ignorados_forzados; } | while IFS= read -r f; do
      [[ -f "$f" ]] && awk -v f="$f" '{print f "\t" $0}' "$f"
    done
  fi
}

archivos_que_entran() {
  git diff --cached --name-only
  if (( ${#ambito[@]} )); then
    git diff --name-only -- "${ambito[@]}"
    git ls-files --others --exclude-standard -- "${ambito[@]}"
    ignorados_forzados
  fi
}

hallazgo=""
# Regla 3: fichero .env (nombre exacto, cualquier carpeta). .env.example no cuenta.
while IFS= read -r f; do
  [[ "$(basename "$f")" == ".env" ]] && { hallazgo="fichero .env"$'\t'"$f"; break; }
done < <(archivos_que_entran)

# Reglas 1 y 2. Los patrones están escritos para que este propio script no se detecte a sí mismo.
if [[ -z "$hallazgo" ]]; then
  hallazgo="$(lineas_anadidas | awk -F'\t' '
    {
      f = $1; l = substr($0, length(f) + 2)
      if (l ~ /AKIA[0-9A-Z]{16}|sk[-]ant-|ghp[_]|github[_]pat_|AIza[0-9A-Za-z_-]{35}|xox[bpa]-|-----BEGIN [A-Z ]*PRIVATE KEY-----/ || l ~ /^[ \t]*APP_KEY=[^ \t]+/) {
        print "clave reconocible\t" f; exit
      }
      s = l
      # El dominio debe acabar en un TLD de letras: así `accion@v1.2.0` no cuenta como correo.
      while (match(s, /[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}/)) {
        e = substr(s, RSTART, RLENGTH); d = tolower(substr(e, index(e, "@") + 1))
        if (d != "example.com" && d != "example.org" && d != "example.net" && d != "github.com" && d !~ /\.github\.com$/) {
          print "correo real\t" f; exit
        }
        s = substr(s, RSTART + RLENGTH)
      }
    }')"
fi

[[ -z "$hallazgo" ]] && exit 0

regla="${hallazgo%%$'\t'*}"
archivo="${hallazgo#*$'\t'}"
mkdir -p "$(dirname "$LOG")"
[[ -f "$LOG" ]] || echo "# Registro de bloqueos del hook datos-que-no-salen (sin datos: solo regla y archivo)" > "$LOG"
echo "- $(date -u +%Y-%m-%dT%H:%M:%SZ) BLOQUEADO regla=\"$regla\" archivo=\"$archivo\"" >> "$LOG"

echo "BLOQUEADO por datos-que-no-salen: regla «$regla» en «$archivo». Sustituye el dato por uno inventado (p. ej. un correo @example.com o <REDACTED>) y vuelve a intentarlo. El bloqueo quedó registrado en $LOG (sin el dato)." >&2
exit 2
