/* eslint-disable no-console */
/*
  Generator: converts C# DTO classes in "Dto - Base" to TypeScript interfaces in ./dto/_generated
  - Preserves Request/Response subfolder structure per entity
  - Maps common C# types to TS
  - Unknown complex types -> any (to avoid missing import errors)
  - Skips existing files is not needed because output goes to _generated
*/
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'Dto - Base');
const OUT_DIR = path.resolve(__dirname, '..', 'dto', '_generated');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source folder not found: ${SRC_DIR}`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

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
  if (/\?$/.test(t)) {
    isNullable = true;
    t = t.replace(/\?$/, '');
  }
  const nullableMatch = t.match(/^Nullable<(.+)>$/);
  if (nullableMatch) {
    isNullable = true;
    t = nullableMatch[1];
  }
  if (/\[\]$/.test(t)) {
    const inner = mapCSTypeToTS(t.replace(/\[\]$/, ''));
    const base = typeof inner === 'string' ? inner : 'any';
    const ts = `${base}[]`;
    return isNullable ? `${ts} | null` : ts;
  }
  const listMatch = t.match(/^(?:List|ICollection|IEnumerable)<(.+)>$/);
  if (listMatch) {
    const inner = mapCSTypeToTS(listMatch[1]);
    const base = typeof inner === 'string' ? inner : 'any';
    const ts = `${base}[]`;
    return isNullable ? `${ts} | null` : ts;
  }
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
  const basic = typeMap[t];
  const tsBasic = basic || 'any';
  return isNullable ? `${tsBasic} | null` : tsBasic;
}

function parseProperties(content) {
  const props = [];
  const propRegex = /public\s+(?:virtual\s+)?([\w<>?,\[\]]+)\s+(\w+)\s*\{\s*get;\s*set;\s*\}/g;
  let m;
  while ((m = propRegex.exec(content)) !== null) {
    const [, csTypeRaw, name] = m;
    const tsType = mapCSTypeToTS(csTypeRaw);
    props.push({ name, tsType });
  }
  return props;
}

function generateInterface(name, props) {
  const header = `// Auto-generated from C# DTO ${name}. Do not edit manually.\n`;
  const lines = [];
  lines.push(`export interface ${name} {`);
  for (const { name: propName, tsType } of props) {
    lines.push(`  ${propName}: ${tsType};`);
  }
  lines.push('}');
  return header + lines.join('\n') + '\n';
}

function writeFileEnsured(outPath, content) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
}

function processCsFile(inFile, outDir) {
  const content = fs.readFileSync(inFile, 'utf8');
  const classMatch = content.match(/class\s+(\w+)/);
  if (!classMatch) return null;
  const name = classMatch[1];
  const props = parseProperties(content);
  const ts = generateInterface(name, props);
  const outFile = path.join(outDir, `${name}.ts`);
  writeFileEnsured(outFile, ts);
  return { name, outFile };
}

function generate() {
  let count = 0;
  const entries = fs.readdirSync(SRC_DIR, { withFileTypes: true });

  // Handle root-level common DTOs
  for (const ent of entries) {
    if (ent.isFile() && ent.name.endsWith('.cs')) {
      const inFile = path.join(SRC_DIR, ent.name);
      const outDir = path.join(OUT_DIR, 'common');
      if (processCsFile(inFile, outDir)) count++;
    }
  }

  // Handle entities
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const entityName = ent.name; // e.g., User, Gym
    const entityDir = path.join(SRC_DIR, entityName);
    const reqDir = path.join(entityDir, 'Request');
    const resDir = path.join(entityDir, 'Response');

    if (fs.existsSync(reqDir)) {
      const files = fs.readdirSync(reqDir).filter(n => n.endsWith('.cs'));
      for (const f of files) {
        const inFile = path.join(reqDir, f);
        const outDir = path.join(OUT_DIR, entityName, 'Request');
        if (processCsFile(inFile, outDir)) count++;
      }
    }
    if (fs.existsSync(resDir)) {
      const files = fs.readdirSync(resDir).filter(n => n.endsWith('.cs'));
      for (const f of files) {
        const inFile = path.join(resDir, f);
        const outDir = path.join(OUT_DIR, entityName, 'Response');
        if (processCsFile(inFile, outDir)) count++;
      }
    }
  }

  // Write a root barrel index
  try {
    const barrelLines = [];
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full);
        } else if (name.endsWith('.ts')) {
          const rel = path.relative(OUT_DIR, full).replace(/\\/g, '/');
          barrelLines.push(`export * from './${rel.replace(/\.ts$/, '')}';`);
        }
      }
    };
    walk(OUT_DIR);
    writeFileEnsured(path.join(OUT_DIR, 'index.ts'), barrelLines.sort().join('\n') + '\n');
  } catch (e) {
    console.error('Failed to write barrel index:', e);
  }

  console.log(`Generated ${count} DTO interfaces into ${OUT_DIR}`);
}

generate();
