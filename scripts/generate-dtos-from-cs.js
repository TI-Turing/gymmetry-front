/* eslint-disable no-console */
/*
  Generator: convierte clases DTO en C# (en carpetas "Dto - Base"/"DTO - Base")
  a interfaces TypeScript en ./dto con estructura Request/Response por entidad.
  - Mapea tipos C# comunes a TS
  - Tipos complejos desconocidos -> any
  - Nunca sobreescribe dto/common/ApiResponse
*/
const fs = require('fs');
const path = require('path');

// Múltiples posibles ubicaciones de origen (case-insensitive en distintos repos)
const SRC_DIRS = [
  path.resolve(__dirname, '..', 'Dto - Base'),
  path.resolve(__dirname, '..', 'DTO - Base'),
].filter(p => fs.existsSync(p));

// Output directamente en la carpeta dto (sin _generated), como se definió en la estandarización
const OUT_DIR = path.resolve(__dirname, '..', 'dto');

if (SRC_DIRS.length === 0) {
  console.error(
    `Source folders not found. Checked: ${[
      path.resolve(__dirname, '..', 'Dto - Base'),
      path.resolve(__dirname, '..', 'DTO - Base'),
    ].join(', ')}`
  );
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

/** @type {Record<string, string>} */
const typeMap = {
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

/**
 * Busca una carpeta existente en OUT_DIR que coincida (case-insensitive) con entityName
 * para reutilizar su casing físico y evitar crear duplicados en Windows.
 * Si no existe, devuelve el nombre original de la entidad para crearla tal cual.
 */
function resolveExistingEntityDirName(baseDir, entityName) {
  try {
    const entries = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    const found = entries.find(
      n => n.toLowerCase() === entityName.toLowerCase()
    );
    return found || entityName;
  } catch {
    return entityName;
  }
}

/** Prefer nullable type when two types conflict (e.g., 'string' vs 'string | null') */
function pickPreferredType(a, b) {
  if (a === b) return a;
  const aNullable = /\|\s*null\b/.test(a);
  const bNullable = /\|\s*null\b/.test(b);
  if (aNullable && !bNullable) return a;
  if (!aNullable && bNullable) return b;
  // fallback: keep first
  return a;
}

function parseProperties(content) {
  /** @type {Array<{name:string, tsType:string}>} */
  const props = [];
  const propRegex =
    /public\s+(?:virtual\s+)?([\w<>?,\[\]]+)\s+(\w+)\s*\{\s*get;\s*set;\s*\}/g;
  let m;
  while ((m = propRegex.exec(content)) !== null) {
    const [, csTypeRaw, name] = m;
    const tsType = mapCSTypeToTS(csTypeRaw);
    props.push({ name, tsType });
  }
  // De-duplicate by property name, preferring nullable types when conflicts occur
  const map = new Map();
  for (const p of props) {
    if (map.has(p.name)) {
      const prev = map.get(p.name);
      map.set(p.name, {
        name: p.name,
        tsType: pickPreferredType(prev.tsType, p.tsType),
      });
    } else {
      map.set(p.name, p);
    }
  }
  return Array.from(map.values());
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
  // Never overwrite our unified ApiResponse definition
  if (name === 'ApiResponse' && outDir.includes(path.join('dto', 'common'))) {
    return null;
  }
  const props = parseProperties(content);
  const ts = generateInterface(name, props);
  const outFile = path.join(outDir, `${name}.ts`);
  writeFileEnsured(outFile, ts);
  return { name, outFile };
}

function generate() {
  let count = 0;
  for (const SRC_DIR of SRC_DIRS) {
    const entries = fs.readdirSync(SRC_DIR, { withFileTypes: true });

    // Archivos sueltos en la raíz (comunes)
    for (const ent of entries) {
      if (ent.isFile() && ent.name.endsWith('.cs')) {
        const inFile = path.join(SRC_DIR, ent.name);
        const outDir = path.join(OUT_DIR, 'common');
        if (processCsFile(inFile, outDir)) count++;
      }
    }

    // Entidades con subcarpetas Request/Response
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const entityName = ent.name; // e.g., User, Gym
      const entityDir = path.join(SRC_DIR, entityName);
      const reqDir = path.join(entityDir, 'Request');
      const resDir = path.join(entityDir, 'Response');
      const outEntityDirName = resolveExistingEntityDirName(
        OUT_DIR,
        entityName
      );

      if (fs.existsSync(reqDir)) {
        const files = fs.readdirSync(reqDir).filter(n => n.endsWith('.cs'));
        for (const f of files) {
          const inFile = path.join(reqDir, f);
          const outDir = path.join(OUT_DIR, outEntityDirName, 'Request');
          if (processCsFile(inFile, outDir)) count++;
        }
      }
      if (fs.existsSync(resDir)) {
        const files = fs.readdirSync(resDir).filter(n => n.endsWith('.cs'));
        for (const f of files) {
          const inFile = path.join(resDir, f);
          const outDir = path.join(OUT_DIR, outEntityDirName, 'Response');
          if (processCsFile(inFile, outDir)) count++;
        }
      }
    }
  }

  // Ya no generamos barrel automáticamente para no pisar el índice curado a mano

  console.log(`Generated ${count} DTO interfaces into ${OUT_DIR}`);
}

generate();
