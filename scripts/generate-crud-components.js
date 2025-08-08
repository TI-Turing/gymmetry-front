/* eslint-disable no-console */
// Genera componentes CRUD por entidad a partir de services/functions/*FunctionsService.ts
// Crea: List, Detail y Form (create/update) siguiendo el estilo base y sin registrar rutas.

const fs = require('fs');
const path = require('path');

const FUNC_SERVICES_DIR = path.resolve(
  __dirname,
  '..',
  'services',
  'functions'
);
const COMPONENTS_DIR = path.resolve(__dirname, '..', 'components');

function toLowerCamel(str) {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}

function toPascal(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

function readServiceMethods(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportVarMatch = content.match(/export\s+const\s+(\w+)\s*=\s*\{/);
  const varName = exportVarMatch ? exportVarMatch[1] : null;
  const methodRegex = /\s*(\w+)\s*\(/g;
  const methods = new Set();
  const blockMatch = content.match(
    /export\s+const\s+\w+\s*=\s*\{([\s\S]*?)\};/
  );
  if (blockMatch) {
    let m;
    while ((m = methodRegex.exec(blockMatch[1])) !== null) {
      const name = m[1];
      if (!['async'].includes(name)) methods.add(name);
    }
  }
  return { varName, methods: Array.from(methods) };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}

function generateForEntity(entityName, serviceVar, methods) {
  const entKebab = toLowerCamel(entityName);
  const entPascal = toPascal(entityName);
  const compDir = path.join(COMPONENTS_DIR, entKebab);
  ensureDir(compDir);

  const hasGetAll = methods.some(m => /^getAll/i.test(m));
  const hasGetById = methods.some(m => /(get.*ById|getById)/i.test(m));
  const hasAdd = methods.some(m => /^add/i.test(m) || /create/i.test(m));
  const hasUpdate = methods.some(m => /^update/i.test(m));
  const hasDelete = methods.some(m => /^delete/i.test(m) || /^remove/i.test(m));
  const hasFind = methods.some(m => /^find/i.test(m) || /search/i.test(m));

  const importHeader = `import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import FormInput from '@/components/common/FormInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Colors from '@/constants/Colors';
import { ${serviceVar} } from '@/services/functions';
`;

  // List component
  const listBody = `
export function ${entPascal}List() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      ${
        hasGetAll
          ? `const res = await ${serviceVar}.${methods.find(m => /^getAll/i.test(m))}();
      setItems(res.Data || []);`
          : hasFind
            ? `const res = await ${serviceVar}.${methods.find(m => /^find|search/i.test(m))}({});
      setItems(res.Data || []);`
            : `setError('Listado no disponible');`
      }
    } catch (e) {
      setError('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${entPascal} - Lista</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{JSON.stringify(item)}</Text>
          </View>
        )}
      />
      <Button title="Refrescar" onPress={load} />
    </View>
  );
}
`;

  // Detail component
  const detailBody = `
export function ${entPascal}Detail() {
  const [id, setId] = useState('');
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      ${
        hasGetById
          ? `const res = await ${serviceVar}.${methods.find(m => /(get.*ById|getById)/i.test(m))}(id);
      setItem(res.Data);`
          : `setError('Consulta por Id no disponible');`
      }
    } catch (e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${entPascal} - Detalle</Text>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Consultar" onPress={fetchOne} />
      {loading ? <LoadingSpinner /> : item ? (
        <View style={styles.card}><Text style={styles.cardText}>{JSON.stringify(item, null, 2)}</Text></View>
      ) : error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
`;

  // Form component (create/update)
  const formBody = `
export function ${entPascal}Form() {
  const [payload, setPayload] = useState<string>('{}');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onAdd = async () => {
    setLoading(true);
    setMsg(null);
    try {
      ${
        hasAdd
          ? `const body = JSON.parse(payload);
      const res = await ${serviceVar}.${methods.find(m => /^add|create/i.test(m))}(body);
      setMsg(res.Message || 'Creado');`
          : `setMsg('Creación no disponible');`
      }
    } catch {
      setMsg('Error al crear');
    } finally { setLoading(false); }
  };

  const onUpdate = async () => {
    setLoading(true);
    setMsg(null);
    try {
      ${
        hasUpdate
          ? `const body = JSON.parse(payload);
      const res = await ${serviceVar}.${methods.find(m => /^update/i.test(m))}(body);
      setMsg(res.Message || 'Actualizado');`
          : `setMsg('Actualización no disponible');`
      }
    } catch {
      setMsg('Error al actualizar');
    } finally { setLoading(false); }
  };

  const onDelete = async () => {
    setLoading(true);
    setMsg(null);
    try {
      ${
        hasDelete
          ? `const res = await ${serviceVar}.${methods.find(m => /^delete|remove/i.test(m))}(id);
      setMsg(res.Message || 'Eliminado');`
          : `setMsg('Eliminación no disponible');`
      }
    } catch {
      setMsg('Error al eliminar');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${entPascal} - Formulario</Text>
      <Text style={styles.label}>Campos (JSON)</Text>
      <TextInput
        style={styles.textarea}
        value={payload}
        onChangeText={setPayload}
        multiline
        numberOfLines={8}
      />
      <View style={styles.row}>
        <Button title="Crear" onPress={onAdd} />
        <Button title="Actualizar" onPress={onUpdate} />
      </View>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Eliminar" onPress={onDelete} />
      {loading ? <LoadingSpinner /> : msg ? <Text style={styles.info}>{msg}</Text> : null}
    </View>
  );
}
`;

  const styles = `
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  error: { color: 'red', marginVertical: 8 },
  info: { color: Colors.tint, marginTop: 8 },
  card: { backgroundColor: '#fff2', padding: 12, borderRadius: 8, marginVertical: 6 },
  cardText: { fontSize: 12 },
  label: { marginBottom: 6, color: Colors.text },
  textarea: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, minHeight: 120, textAlignVertical: 'top', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginVertical: 8 },
});
export default styles;
`;

  writeFile(
    path.join(compDir, `${entPascal}List.tsx`),
    importHeader + listBody + styles
  );
  writeFile(
    path.join(compDir, `${entPascal}Detail.tsx`),
    importHeader + detailBody + styles
  );
  writeFile(
    path.join(compDir, `${entPascal}Form.tsx`),
    importHeader + formBody + styles
  );
  writeFile(
    path.join(compDir, 'index.ts'),
    `export { ${entPascal}List } from './${entPascal}List';
export { ${entPascal}Detail } from './${entPascal}Detail';
export { ${entPascal}Form } from './${entPascal}Form';
`
  );
}

function main() {
  const files = fs
    .readdirSync(FUNC_SERVICES_DIR)
    .filter(f => f.endsWith('FunctionsService.ts') && f !== 'index.ts');

  for (const f of files) {
    const abs = path.join(FUNC_SERVICES_DIR, f);
    const entity = f.replace('FunctionsService.ts', '');
    const entityName = entity.charAt(0).toUpperCase() + entity.slice(1); // pascal
    const { varName, methods } = readServiceMethods(abs);
    if (!varName) continue;
    generateForEntity(entityName, varName, methods);
  }

  console.log(
    `Componentes generados para ${files.length} entidades en ${COMPONENTS_DIR}`
  );
}

main();
