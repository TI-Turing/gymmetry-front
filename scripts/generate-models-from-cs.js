/* eslint-disable no-console */
/*
  Simple generator: converts C# classes in "Models - Base" to TypeScript interfaces in ./models
  Note: This is a heuristic converter; please review results for complex generics/relations.
*/
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'Models - Base');
const OUT_DIR = path.resolve(__dirname, '..', 'models');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source folder not found: ${SRC_DIR}`);
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

/** @type {Record<string, string>} */
const typeMap = {
  string: 'string',
  String: 'string',
  int: 'number',
  long: 'number',
  float: 'number',
  double: 'number',
  decimal: 'number',
  bool: 'boolean',
  boolean: 'boolean',
  DateTime: 'string',
  Guid: 'string',
};

function mapCSTypeToTS(csType) {
  let t = csType.trim();
  let isNullable = false;
  // Nullable types: T? or Nullable<T>
  if (/\?$/.test(t)) {
    isNullable = true;
    t = t.replace(/\?$/, '');
  }
  const nullableMatch = t.match(/^Nullable<(.+)>$/);
  if (nullableMatch) {
    isNullable = true;
    t = nullableMatch[1];
  }
  // Array syntax T[]
  if (/\[\]$/.test(t)) {
    const inner = mapCSTypeToTS(t.replace(/\[\]$/, ''));
    const base = typeof inner === 'string' ? inner : 'any';
    const ts = `${base}[]`;
    return isNullable ? `${ts} | null` : ts;
  }
  // Generic collections: List<T>, ICollection<T>, IEnumerable<T>
  const listMatch = t.match(/^(?:List|ICollection|IEnumerable)<(.+)>$/);
  if (listMatch) {
    const inner = mapCSTypeToTS(listMatch[1]);
    const base = typeof inner === 'string' ? inner : 'any';
    const ts = `${base}[]`;
    return isNullable ? `${ts} | null` : ts;
  }
  // Dictionary<K,V> -> Record<string|number,V>
  const dictMatch = t.match(/^Dictionary<([^,]+),\s*(.+)>$/);
  if (dictMatch) {
    const key = mapCSTypeToTS(dictMatch[1]);
    const val = mapCSTypeToTS(dictMatch[2]);
    const keyTs = typeof key === 'string' ? key : 'string';
    const valTs = typeof val === 'string' ? val : 'any';
    const keyParam = keyTs === 'number' ? 'number' : 'string';
    const ts = `Record<${keyParam}, ${valTs}>`;
    return isNullable ? `${ts} | null` : ts;
  }
  // Builtins or keep as-is for complex types
  const basic = typeMap[t] || t;
  return isNullable ? `${basic} | null` : basic;
}

const KNOWN_TOKENS = new Set([
  'List',
  'ICollection',
  'IEnumerable',
  'Dictionary',
  'Nullable',
  ...Object.keys(typeMap),
]);

function collectCustomTypes(csTypeRaw) {
  let t = csTypeRaw.trim();
  t = t.replace(/\?$/, ''); // nullable
  t = t.replace(/\[\]$/, ''); // array
  // split by symbols and generics delimiters
  const tokens = t
    .replace(/[<>(),]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const custom = new Set();
  for (const tok of tokens) {
    if (KNOWN_TOKENS.has(tok)) continue;
    // heuristic: consider PascalCase identifiers as custom types
    if (/^[A-Z][A-Za-z0-9_]*$/.test(tok)) custom.add(tok);
  }
  return custom;
}

function parseProperties(content) {
  const lines = content.split(/\r?\n/);
  const props = [];
  // Matches: public [virtual] Type Name { get; set; }
  const propRegex = /public\s+(?:virtual\s+)?([\w<>?,\[\]]+)\s+(\w+)\s*\{\s*get;\s*set;\s*\}/;
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(propRegex);
    if (m) {
      const [, csTypeRaw, name] = m;
      const tsType = mapCSTypeToTS(csTypeRaw);
      const customs = Array.from(collectCustomTypes(csTypeRaw));
      props.push({ name, tsType, customs });
    }
  }
  return props;
}

function generateInterface(className, props) {
  const header = `// Auto-generated from C# class ${className}. Do not edit manually.\n`;
  const lines = [];
  const importSet = new Set();
  for (const p of props) {
    for (const c of p.customs || []) {
      if (c !== className) importSet.add(c);
    }
  }
  if (importSet.size > 0) {
    const sorted = Array.from(importSet).sort();
    for (const n of sorted) {
      lines.push(`import type { ${n} } from './${n}';`);
    }
    lines.push('');
  }
  lines.push(`export interface ${className} {`);
  for (const { name, tsType } of props) {
    lines.push(`  ${name}: ${tsType};`);
  }
  lines.push('}');
  return header + lines.join('\n') + '\n';
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classMatch = content.match(/class\s+(\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];
  const props = parseProperties(content);
  const ts = generateInterface(className, props);
  const outFile = path.join(OUT_DIR, `${className}.ts`);
  fs.writeFileSync(outFile, ts, 'utf8');
  return { className, outFile, count: props.length };
}

const entries = fs.readdirSync(SRC_DIR);
let count = 0;
for (const f of entries) {
  if (!f.endsWith('.cs')) continue;
  const full = path.join(SRC_DIR, f);
  const res = processFile(full);
  if (res) count++;
}
console.log(`Generated ${count} interfaces in ${OUT_DIR}`);
