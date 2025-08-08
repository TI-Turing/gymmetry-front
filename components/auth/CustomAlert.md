# Sistema de Alertas Personalizado

## Descripción

Componente de alerta elegante y personalizable que reemplaza los Alert nativos de React Native con un diseño que sigue el estilo de la aplicación.

## Características

- ✨ Diseño elegante con animaciones suaves
- 🎨 Se adapta automáticamente al tema claro/oscuro
- 📱 Responsive y compatible con diferentes tamaños de pantalla
- 🔧 Altamente personalizable
- 🎯 4 tipos de alerta: success, error, warning, info
- 🎭 Iconos FontAwesome integrados
- ⚡ Hook personalizado para fácil uso

## Uso Básico

### Importar

```typescript
import { useCustomAlert } from './CustomAlert';
```

### En el componente

```typescript
export default function MiComponente() {
  const { showAlert, AlertComponent } = useCustomAlert();

  const handleError = () => {
    showAlert('error', 'Error', 'Algo salió mal');
  };

  const handleSuccess = () => {
    showAlert('success', 'Éxito', '¡Operación completada!');
  };

  return (
    <View>
      {/* Tu contenido aquí */}

      {/* Importante: Agregar el componente de alerta */}
      <AlertComponent />
    </View>
  );
}
```

## Tipos de Alerta

### Error

```typescript
showAlert('error', 'Error', 'Mensaje de error');
```

### Éxito

```typescript
showAlert('success', 'Éxito', 'Operación exitosa');
```

### Advertencia

```typescript
showAlert('warning', 'Advertencia', 'Ten cuidado');
```

### Información

```typescript
showAlert('info', 'Información', 'Dato importante');
```

## Opciones Avanzadas

### Con botones personalizados

```typescript
showAlert('warning', 'Confirmar', '¿Estás seguro?', {
  showCancel: true,
  confirmText: 'Sí, continuar',
  cancelText: 'Cancelar',
  onConfirm: () => {
    // Acción de confirmación
  },
  onCancel: () => {
    // Acción de cancelación
  },
});
```

## Colores por Tipo

- **Success**: Verde (#4CAF50)
- **Error**: Rojo (#F44336)
- **Warning**: Naranja (#FF9800)
- **Info**: Azul (#2196F3)

## Animaciones

- Entrada: Spring con scale + fade in
- Salida: Fade out suave
- Duración: 200ms entrada, 150ms salida
