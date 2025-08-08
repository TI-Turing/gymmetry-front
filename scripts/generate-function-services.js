/* eslint-disable no-console */
// Genera servicios TS a partir de las Azure Functions C# en "Functions - Base"
// - Un servicio por carpeta de entidad
// - Una función por cada [Function("...")] encontrada
// - Mapea rutas/métodos del HttpTrigger y busca DTOs/Models existentes para tipos

const fs = require('fs');
const path = require('path');

const FUNCTIONS_DIR = path.resolve(__dirname, '..', 'Functions - Base');
const OUT_DIR = path.resolve(__dirname, '..', 'services', 'functions');
const DTO_DIR = path.resolve(__dirname, '..', 'dto');
const MODELS_DIR = path.resolve(__dirname, '..', 'models');

if (!fs.existsSync(FUNCTIONS_DIR)) {
  console.error(`No se encontró la carpeta: ${FUNCTIONS_DIR}`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const guidLike = new Set(['Guid', 'guid', 'System.Guid']);

function toLowerCamel(str) {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}

function toValidIdentifier(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

function mapCSTypeToTSType(csType) {
  if (!csType) return 'any';
  const t = csType.trim();
  // IEnumerable/List/Array
  const enumM =
    t.match(/IEnumerable<\s*([\w\.]+)\s*>/i) ||
    t.match(/List<\s*([\w\.]+)\s*>/i);
  if (enumM) {
    const inner = mapCSTypeToTSType(enumM[1]);
    return `${inner}[]`;
  }
  if (t.endsWith('[]')) {
    const inner = mapCSTypeToTSType(t.slice(0, -2));
    return `${inner}[]`;
  }
  if (guidLike.has(t)) return 'string';
  if (/^string$/i.test(t)) return 'string';
  if (/^(?:int|long|float|double|decimal)$/i.test(t)) return 'number';
  if (/^(?:bool|boolean)$/i.test(t)) return 'boolean';
  if (/DateTime/i.test(t)) return 'string';
  // Dictionary -> Record<string, any>
  if (/^Dictionary<.+>$/i.test(t)) return 'Record<string, any>';
  // Qualified name like Namespace.Type
  const last = t.split('.').pop();
  return last || 'any';
}

function findTypeImport(typeName) {
  if (!typeName) return null;
  const name = typeName.split('.').pop();
  // Buscar en DTOs
  const dtoPath = findFileByName(DTO_DIR, `${name}.ts`);
  if (dtoPath) {
    const rel = normalizeAlias(dtoPath, 'dto');
    return { import: name, from: rel, isDefault: false };
  }
  // Buscar en models
  const modelPath = path.join(MODELS_DIR, `${name}.ts`);
  if (fs.existsSync(modelPath)) {
    return { import: name, from: '@/models/' + name, isDefault: false };
  }
  return null;
}

function findFileByName(root, file) {
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && ent.name === file) return full;
    }
  }
  return null;
}

function normalizeAlias(absPath, aliasRoot) {
  // abs dto path -> '@/dto/...'
  const parts = absPath.split(path.sep);
  const idx = parts.lastIndexOf(aliasRoot);
  const sub = parts
    .slice(idx + 1)
    .join('/')
    .replace(/\.ts$/, '');
  return `@/${aliasRoot}/${sub}`;
}

function ensureKnownTsType(tsType) {
  const isArray = /\[\]$/.test(tsType);
  const baseName = tsType.replace(/\[\]$/, '');
  const imp = findTypeImport(baseName);
  if (imp) {
    return { ts: tsType, import: imp };
  }
  return { ts: isArray ? 'any[]' : 'any', import: null };
}

function extractApiResponseInner(block) {
  const marker = 'ApiResponse<';
  const start = block.indexOf(marker);
  if (start === -1) return null;
  let i = start + marker.length;
  let depth = 1;
  let inner = '';
  while (i < block.length && depth > 0) {
    const ch = block[i];
    if (ch === '<') depth++;
    else if (ch === '>') depth--;
    if (depth > 0) inner += ch;
    i++;
  }
  return inner.trim() || null;
}

function parseFunctions(content) {
  const blocks = [];
  const re = /\[Function\(\"([^\"]+)\"\)\][\s\S]*?(?=(?:\[Function\(|$))/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const blockFull = m[0];
    const funcName = m[1];
    const methodMatch = blockFull.match(
      /HttpTrigger\([^\)]*\"(get|post|put|patch|delete)\"/i
    );
    const routeMatch = blockFull.match(/Route\s*=\s*\"([^\"]+)\"/i);
    const reqDtoMatch = blockFull.match(
      /Deserialize(?:Object)?<\s*([\w\.]+)\s*>/
    );
    const respTypeInner = extractApiResponseInner(blockFull);
    const method = methodMatch ? methodMatch[1].toLowerCase() : 'get';
    const route = routeMatch ? routeMatch[1] : '';
    const reqType = reqDtoMatch ? reqDtoMatch[1] : null;
    const respT = respTypeInner;
    blocks.push({ funcName, method, route, reqType, respT, blockFull });
  }
  return blocks;
}

function guessEntityNameFromFolder(folderName) {
  // e.g., AccessMethodTypeFunction -> AccessMethodType
  return folderName.replace(/Function[s]?$/i, '');
}

function toFunctionNameFromAttr(attrName) {
  // AccessMethodType_GetAllAccessMethodTypesFunction -> getAllAccessMethodTypes
  const parts = attrName.split('_');
  const tail = parts.length > 1 ? parts.slice(1).join('_') : attrName;
  const base = tail.replace(/Function$/i, '');
  return toLowerCamel(base);
}

function buildService(entityFolder) {
  const entityName = guessEntityNameFromFolder(entityFolder);
  const absEntityDir = path.join(FUNCTIONS_DIR, entityFolder);
  const files = fs.readdirSync(absEntityDir).filter(f => f.endsWith('.cs'));
  let functions = [];
  for (const f of files) {
    const content = fs.readFileSync(path.join(absEntityDir, f), 'utf8');
    functions = functions.concat(parseFunctions(content));
  }
  if (functions.length === 0) return null;

  const imports = new Map();
  imports.set('apiService', { import: 'apiService', from: './apiService' });
  imports.set('ApiResponse', { import: 'ApiResponse', from: './apiService' });

  const lines = [];
  lines.push(`// Auto-generated service for ${entityName} Azure Functions`);
  const varName = toLowerCamel(entityName) + 'FunctionsService';
  lines.push(`export const ${varName} = {`);

  for (const fn of functions) {
    const name = toFunctionNameFromAttr(fn.funcName);
    const method = fn.method;
    const route = fn.route.startsWith('/') ? fn.route : `/${fn.route}`;

    // Response type mapping
    let respTsType = 'any';
    if (fn.respT) {
      const tsT = mapCSTypeToTSType(fn.respT);
      const known = ensureKnownTsType(tsT);
      respTsType = known.ts;
      if (known.import)
        imports.set(
          `${known.import.from}:${known.import.import}`,
          known.import
        );
    }

    // Request type mapping
    let reqParam = '';
    let callArg = '';
    if (/(post|put|patch)/i.test(method)) {
      let reqTsType = 'any';
      if (fn.reqType) {
        const base = mapCSTypeToTSType(fn.reqType);
        const known = ensureKnownTsType(base);
        reqTsType = known.ts;
        if (known.import)
          imports.set(
            `${known.import.from}:${known.import.import}`,
            known.import
          );
      } else if (/find$/i.test(route)) {
        // Heurística: Find<Entity>ByFieldsRequest
        const guess = `Find${entityName}sByFieldsRequest`;
        const imp = findTypeImport(guess);
        if (imp) {
          reqTsType = guess;
          imports.set(`${imp.from}:${imp.import}`, imp);
        } else {
          reqTsType = 'Record<string, any>';
        }
      }
      reqParam = `request: ${reqTsType}`;
      callArg = ', request';
    }

    // URL params (id)
  const fnParams = [];
    if (/\{id:guid\}/i.test(route) || /\{id\}/i.test(route)) {
      fnParams.push('id: string');
    }
    if (reqParam) fnParams.push(reqParam);

    // Compose TS call
  const typeArg = respTsType ? `<${respTsType}>` : '';
    const methodCall = method.toLowerCase();
  const urlExpr = '`' + route.replace(/\{id(?::guid)?\}/gi, '${id}') + '`';

    if (methodCall === 'get' || methodCall === 'delete') {
      lines.push(
        `  async ${toValidIdentifier(name)}(${fnParams.join(', ')}): Promise<ApiResponse<${respTsType}>> {`
      );
      lines.push(
        `    const response = await apiService.${methodCall}${typeArg}(${urlExpr});`
      );
      lines.push('    return response;');
      lines.push('  },');
    } else {
      lines.push(
        `  async ${toValidIdentifier(name)}(${fnParams.join(', ')}): Promise<ApiResponse<${respTsType}>> {`
      );
      lines.push(
        `    const response = await apiService.${methodCall}${typeArg}(${urlExpr}${callArg});`
      );
      lines.push('    return response;');
      lines.push('  },');
    }
  }

  lines.push('};');

  // Build import lines
  const importLines = [];
  // apiService & ApiResponse
  importLines.push(`import { apiService, ApiResponse } from '../apiService';`);
  for (const imp of imports.values()) {
    if (imp.from === './apiService') continue;
    importLines.push(`import type { ${imp.import} } from '${imp.from}';`);
  }

  return {
    varName,
    content: importLines.join('\n') + '\n\n' + lines.join('\n') + '\n',
  };
}

function generate() {
  const entities = fs
    .readdirSync(FUNCTIONS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const created = [];
  for (const folder of entities) {
    const serviceObj = buildService(folder);
    if (!serviceObj) continue;
    const entityName = guessEntityNameFromFolder(folder);
    const fileName = toLowerCamel(entityName) + 'FunctionsService.ts';
    const outPath = path.join(OUT_DIR, fileName);
    fs.writeFileSync(outPath, serviceObj.content, 'utf8');
    created.push({ entityName, fileName, varName: serviceObj.varName });
  }

  // Barrel para services/functions
  const indexLines = created
    .map(
      c =>
        `export { ${c.varName} } from './${c.fileName.replace(/\.ts$/, '')}';`
    )
    .join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexLines + '\n', 'utf8');

  console.log(`Servicios generados: ${created.length} en ${OUT_DIR}`);
}

generate();
