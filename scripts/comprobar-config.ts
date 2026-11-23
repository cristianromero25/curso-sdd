/**
 * Comprueba que el agente RECIBE las reglas de openspec/config.yaml.
 *
 * `openspec validate` no revisa config.yaml: si una regla rompe el YAML (p. ej. un ": " sin
 * comillas), OpenSpec solo avisa y entrega ese artefacto SIN reglas. Este script pide a OpenSpec
 * las mismas instrucciones que pedirá el agente y falla si a algún artefacto le faltan reglas.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';

const CLI = 'node_modules/@fission-ai/openspec/bin/openspec.js';
const CHANGE = 'zz-comprobar-config';

function openspec(...args: string[]) {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
  return { code: r.status ?? 1, out: r.stdout, err: r.stderr };
}

// Artefactos que declaran reglas: las claves con dos espacios de sangría bajo "rules:".
const config = readFileSync('openspec/config.yaml', 'utf8');
const bloque = config.split(/^rules:\s*$/m)[1]?.split(/^\S/m)[0] ?? '';
const artefactos = [...bloque.matchAll(/^ {2}([a-z-]+):\s*$/gm)].map((m) => m[1]!);

const fallos: string[] = [];
try {
  const nuevo = openspec('new', 'change', CHANGE);
  if (nuevo.code !== 0) throw new Error(`no se pudo crear el change temporal:\n${nuevo.err}`);
  if (/ignoring/i.test(nuevo.err)) fallos.push(nuevo.err.trim().split('\n')[0]!);
  for (const a of artefactos) {
    const r = openspec('instructions', a, '--change', CHANGE, '--json');
    const reglas = r.code === 0 ? (JSON.parse(r.out) as { rules?: string[] }).rules : undefined;
    if (!reglas?.length) fallos.push(`El artefacto '${a}' no recibe sus reglas de config.yaml.`);
  }
} finally {
  rmSync(`openspec/changes/${CHANGE}`, { recursive: true, force: true });
}

if (fallos.length) {
  console.error('config.yaml: hay reglas que el agente NO recibe:');
  for (const f of [...new Set(fallos)]) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`config.yaml: reglas entregadas a ${artefactos.join(', ')}.`);
