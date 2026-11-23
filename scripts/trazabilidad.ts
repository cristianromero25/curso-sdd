/**
 * Matriz de trazabilidad spec ↔ tests (guardarraíl determinista).
 * - Lee los Scenario de la spec viva (openspec/specs) y de los changes activos (openspec/changes,
 *   sin el archivo): cada uno debe llevar un id, p. ej. "#### Scenario: [T-CREAR-1] …".
 * - Busca ese id en el NOMBRE de los tests: it('[T-CREAR-1] …') o test('[T-CREAR-1] …').
 * - Falla (exit 1) si hay scenarios sin id, scenarios sin test o tests que citan un id inexistente.
 * Uso: npm run trazabilidad
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function archivos(dir: string, filtro: (f: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? archivos(ruta, filtro) : filtro(ruta) ? [ruta] : [];
  });
}

const fuentes = [
  ...archivos('openspec/specs', (f) => f.endsWith('spec.md')),
  ...archivos('openspec/changes', (f) => f.endsWith('spec.md') && !/[\\/]archive[\\/]/.test(f)),
];

const scenarios = new Map<string, string>(); // id -> archivo de spec
const sinId: string[] = [];
for (const spec of fuentes) {
  for (const linea of readFileSync(spec, 'utf8').split('\n')) {
    if (!linea.startsWith('#### Scenario:')) continue;
    const id = /^#### Scenario: \[(T-[A-Z]+-\d+)\]/.exec(linea)?.[1];
    if (id) scenarios.set(id, spec);
    else sinId.push(`${spec}: ${linea.trim()}`);
  }
}

const NOMBRE_TEST = /\b(?:it|test)\(\s*['"`]\[(T-[A-Z]+-\d+)\]/g;
const enTests = new Map<string, string[]>(); // id -> archivos de test
for (const test of archivos('tests', (f) => f.endsWith('.test.ts'))) {
  for (const [, id] of readFileSync(test, 'utf8').matchAll(NOMBRE_TEST)) {
    enTests.set(id, [...(enTests.get(id) ?? []), test]);
  }
}

const orden = (a: string, b: string) => a.localeCompare(b, 'es', { numeric: true });
const ids = [...scenarios.keys()].sort(orden);
const sinTest = ids.filter((id) => !enTests.has(id));
const huerfanos = [...enTests.keys()].filter((id) => !scenarios.has(id)).sort(orden);

console.log('Scenario       Test');
for (const id of ids) console.log(`${id.padEnd(14)} ${enTests.has(id) ? 'OK' : 'FALTA TEST'}`);
console.log(`\n${ids.length} scenarios · ${ids.length - sinTest.length} cubiertos`);

if (sinId.length || sinTest.length || huerfanos.length) {
  if (sinId.length) console.error(`\nScenarios sin id [T-…]:\n  ${sinId.join('\n  ')}`);
  if (sinTest.length) console.error(`\nScenarios sin test: ${sinTest.join(', ')}`);
  if (huerfanos.length)
    console.error(
      `\nTests con un id que no está en ninguna spec (viva ni change activo): ${huerfanos.join(', ')}`,
    );
  process.exit(1);
}
