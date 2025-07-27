# 🔧 Guía para Desarrolladores - Gymmetry App

## 🚀 Quick Start para Nuevos Desarrolladores

### 1. Setup Inicial

```bash
# Clonar el repositorio
git clone <repo-url>
cd gymmetry-front

# Instalar dependencias
npm install

# Verificar que todo está bien
npm run doctor
npm run type-check
```

### 2. Configuración de Entorno

```bash
# Copiar archivo de ambiente (crear desde template)
cp environment/.env.template environment/.env.local

# Editar variables necesarias
# EXPO_PUBLIC_API_BASE_URL=http://YOUR_IP:7160/api
# EXPO_PUBLIC_CATALOGS_API_BASE_URL=https://your-azure-functions.azurewebsites.net/api
```

### 3. Ejecutar en Desarrollo

```bash
# Iniciar servidor
npm start

# En otra terminal, verificar tipos en tiempo real
npm run type-check -- --watch
```

## 📝 Flujo de Desarrollo Recomendado

### Antes de Empezar a Programar

```bash
# 1. Verificar estado del código
npm run type-check

# 2. Formatear código existente
npm run format

# 3. Limpiar cache si hay problemas
npm run clean
```

### Durante el Desarrollo

```bash
# Verificación continua (en terminal separada)
npm run type-check -- --watch

# Formateo automático (configurar en VS Code)
# O manual: npm run format
```

### Antes de Commit

```bash
# Verificaciones finales
npm run type-check      # Debe salir sin errores
npm run format-check    # Verificar formato
npm run build          # Test de build
```

## 🏗️ Arquitectura de Componentes

### Patrón de Componentes Step

```typescript
// Estructura típica de un Step
interface StepXProps {
  userId: string;
  onNext: (data: StepXData) => void;
  initialData?: StepXData;
}

const StepX: React.FC<StepXProps> = ({ userId, onNext, initialData }) => {
  // 1. Hook personalizado para lógica
  const { data, errors, handleSubmit } = useStepXForm({
    userId,
    onNext,
    initialData
  });

  // 2. Render con validación
  return (
    <AuthContainer>
      {/* Formulario con validación en tiempo real */}
    </AuthContainer>
  );
};
```

### Patrón de Custom Hooks

```typescript
// useStepXForm.ts
export const useStepXForm = (props: UseStepXFormProps) => {
  // 1. Estado local
  const [data, setData] = useState<StepXData>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 2. Validación en tiempo real
  const validateField = useCallback((field: string, value: any) => {
    // Lógica de validación
  }, []);

  // 3. Submit con manejo de errores
  const handleSubmit = useCallback(async () => {
    try {
      await apiCall(data);
      props.onNext(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [data]);

  return { data, errors, handleSubmit, validateField };
};
```

## 🔍 Debugging y Troubleshooting

### Errores Comunes y Soluciones

#### 1. TypeScript Errors

```bash
# Error: Property 'x' does not exist
# Solución: Verificar tipos en dto/ o types/
npm run type-check

# Error: undefined is not assignable
# Solución: Agregar validación null-safe
if (data?.property) { ... }
```

#### 2. API Connection Issues

```bash
# Error: Network request failed
# Verificar IP en variables de entorno
ipconfig  # Windows
ifconfig  # Mac/Linux

# El dispositivo debe estar en la misma red
# IP común: 192.168.0.X o 192.168.1.X
```

#### 3. Metro Bundler Issues

```bash
# Error: Metro bundler issues
npm run clean              # Limpiar cache
npx expo start -c          # Inicio limpio
npx expo start --tunnel    # Si hay problemas de red
```

#### 4. Build Errors

```bash
# Error en builds
npx expo doctor           # Diagnóstico
npm run type-check        # Verificar TypeScript
npx expo install --fix    # Actualizar dependencias
```

### Logs Útiles para Debug

```javascript
// API Debugging
console.log('[API] Request:', requestData);
console.log('[API] Response:', response.data);
console.log('[API] Error:', error.response?.data);

// Form Debugging
console.log('[FORM] Data:', formData);
console.log('[FORM] Errors:', validationErrors);
console.log('[FORM] Step:', currentStep);

// Navigation Debugging
console.log('[NAV] Current route:', route.name);
console.log('[NAV] Params:', route.params);
```

## 🧪 Testing (Preparado para implementar)

### Estructura de Tests Recomendada

```bash
__tests__/
├── components/
│   ├── auth/
│   │   ├── Step1.test.tsx
│   │   └── useStep1Form.test.ts
├── services/
│   └── apiService.test.ts
└── utils/
    └── formatUtils.test.ts
```

### Test Template

```typescript
// Step1.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import Step1 from '../Step1';

describe('Step1 Component', () => {
  const mockProps = {
    userId: 'test-id',
    onNext: jest.fn(),
  };

  it('should validate email correctly', () => {
    const { getByTestId } = render(<Step1 {...mockProps} />);
    // Test logic
  });
});
```

## 📋 Checklist para Nuevas Features

### ✅ Antes de implementar

- [ ] Revisar arquitectura existente
- [ ] Definir interfaces TypeScript
- [ ] Crear DTOs si es necesario
- [ ] Planificar validaciones

### ✅ Durante implementación

- [ ] Seguir patrones existentes
- [ ] Usar custom hooks para lógica
- [ ] Implementar error handling
- [ ] Agregar logs de debug

### ✅ Antes de PR

- [ ] `npm run type-check` sin errores
- [ ] `npm run format` aplicado
- [ ] Testing manual completo
- [ ] Documentar cambios

## 🎨 Styling Guidelines

### Theming

```typescript
// Usar sistema de temas
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.medium,
  },
});
```

### Responsive Design

```typescript
// Responsive utilities
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isTablet = width > 768;
```

## 🔄 Deployment Pipeline

### Development → Staging → Production

```bash
# Development
npm start                 # Local development

# Staging
npm run build            # Test build
npx expo publish         # OTA update

# Production
npx eas build --platform all  # Native builds
npx eas submit                 # App store submission
```

---

💡 **Tip**: Mantén esta guía actualizada conforme evoluciona el proyecto
