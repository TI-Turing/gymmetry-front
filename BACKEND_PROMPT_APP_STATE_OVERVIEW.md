# 🔧 PROMPT PARA BACKEND - Corregir endpoint `/app-state/overview`

## 📋 PROBLEMA IDENTIFICADO

El endpoint `GET /app-state/overview` está devolviendo el objeto `TodayRoutine` **incompleto** cuando el usuario tiene una rutina asignada.

### **Respuesta Actual (Incorrecta):**
```json
{
  "Home": {
    "TodayRoutine": {
      "HasTrainedToday": false,
      "TodayExercises": []
    }
  }
}
```

### **Campos Faltantes:**
- ❌ `RoutineName` → **CRÍTICO** (El frontend necesita mostrar el nombre)
- ❌ `TodayRoutineDayId` → **CRÍTICO** (Para identificar el día de rutina)
- ❌ `EstimatedDurationMinutes` → Opcional pero útil
- ❌ `LastWorkout` → Opcional

---

## ✅ SOLUCIÓN REQUERIDA

### **Respuesta Esperada:**
```json
{
  "Home": {
    "TodayRoutine": {
      "HasTrainedToday": false,
      "TodayRoutineDayId": "12345-guid-de-routine-day",
      "RoutineName": "Rutina de Piernas",
      "EstimatedDurationMinutes": 45,
      "TodayExercises": ["Exercise1", "Exercise2"],
      "LastWorkout": "2025-10-09T18:30:00Z"
    }
  }
}
```

---

## 🔍 CONTEXTO TÉCNICO

### **DTO Esperado (Frontend):**
```csharp
public interface TodayRoutineDto
{
    bool HasTrainedToday { get; set; }
    string TodayRoutineDayId { get; set; }  // ← FALTA EN LA RESPUESTA
    string RoutineName { get; set; }        // ← FALTA EN LA RESPUESTA
    int EstimatedDurationMinutes { get; set; }
    string[] TodayExercises { get; set; }
    string? LastWorkout { get; set; }
}
```

### **Cómo Debe Funcionar:**

1. **Si el usuario tiene rutina asignada:**
   - Consultar `RoutineAssigned` donde `UserId = currentUserId` y `IsActive = true`
   - Obtener el `RoutineDay` correspondiente al día actual (según el calendario de la rutina)
   - Poblar el objeto `TodayRoutine` con:
     - `TodayRoutineDayId` = `RoutineDay.Id`
     - `RoutineName` = `RoutineTemplate.Name` (de la rutina asignada)
     - `EstimatedDurationMinutes` = Suma de duraciones estimadas de ejercicios
     - `TodayExercises` = Lista de nombres/IDs de ejercicios del día
     - `HasTrainedToday` = Si ya existe un `Daily` para hoy
     - `LastWorkout` = Fecha del último `Daily` completado

2. **Si NO tiene rutina asignada:**
   - Devolver `TodayRoutine = null` (o todos los campos vacíos/null)

---

## 📊 ENDPOINT RELACIONADO QUE FUNCIONA CORRECTAMENTE

El endpoint `POST /routine-assigned/find` **SÍ está devolviendo** los datos correctos:

```json
{
  "Success": true,
  "Data": [
    {
      "Id": "guid-aqui",
      "UserId": "user-guid",
      "RoutineTemplateId": "template-guid",
      "RoutineTemplates": [
        {
          "Id": "template-guid",
          "Name": "Rutina de Piernas",  // ← Este nombre debe ir en TodayRoutine
          "Description": "...",
          // ...
        }
      ],
      "IsActive": true
    }
  ]
}
```

**Deberías reutilizar la misma lógica** que usa este endpoint para obtener la rutina asignada.

---

## 🎯 EJEMPLO DE IMPLEMENTACIÓN (C# / Application Layer)

```csharp
// En tu Application Layer: GetAppStateOverviewHandler o similar

public async Task<HomeStateDto> GetHomeStateAsync(string userId)
{
    // 1. Obtener rutina asignada activa
    var assignedRoutine = await _context.RoutineAssigned
        .Include(ra => ra.RoutineTemplate)
        .ThenInclude(rt => rt.RoutineDays)
        .ThenInclude(rd => rd.RoutineDayExercises)
        .FirstOrDefaultAsync(ra => ra.UserId == userId && ra.IsActive);

    TodayRoutineDto todayRoutine = null;

    if (assignedRoutine != null)
    {
        // 2. Determinar el día de rutina actual (según lógica de ciclo)
        var currentRoutineDay = DetermineCurrentRoutineDay(assignedRoutine);

        if (currentRoutineDay != null)
        {
            // 3. Verificar si ya entrenó hoy
            var today = DateTime.UtcNow.Date;
            var hasTrainedToday = await _context.Daily
                .AnyAsync(d => d.UserId == userId && d.Date.Date == today);

            // 4. Obtener último workout
            var lastWorkout = await _context.Daily
                .Where(d => d.UserId == userId)
                .OrderByDescending(d => d.Date)
                .Select(d => d.Date)
                .FirstOrDefaultAsync();

            // 5. Construir DTO completo
            todayRoutine = new TodayRoutineDto
            {
                HasTrainedToday = hasTrainedToday,
                TodayRoutineDayId = currentRoutineDay.Id.ToString(),
                RoutineName = assignedRoutine.RoutineTemplate.Name,
                EstimatedDurationMinutes = currentRoutineDay.RoutineDayExercises
                    .Sum(rde => rde.Exercise?.EstimatedDurationMinutes ?? 5),
                TodayExercises = currentRoutineDay.RoutineDayExercises
                    .Select(rde => rde.Exercise?.Name ?? "Sin nombre")
                    .ToArray(),
                LastWorkout = lastWorkout?.ToString("o") // ISO 8601
            };
        }
    }

    return new HomeStateDto
    {
        // ... otros campos
        TodayRoutine = todayRoutine
    };
}
```

---

## ⚠️ IMPORTANTE

### **Validaciones Necesarias:**

1. ✅ Si no hay rutina asignada → `TodayRoutine` debe ser `null` (no un objeto vacío)
2. ✅ `RoutineName` **NUNCA** debe ser vacío/null si existe `TodayRoutine`
3. ✅ `TodayRoutineDayId` **NUNCA** debe ser vacío/null si existe `TodayRoutine`
4. ✅ Manejar casos donde el usuario tiene rutina pero hoy es día de descanso
5. ✅ Considerar zonas horarias del usuario (usar su timezone, no UTC)

### **Testing:**

```csharp
// Test 1: Usuario CON rutina asignada
var result = await GetHomeStateAsync("user-with-routine");
Assert.NotNull(result.TodayRoutine);
Assert.False(string.IsNullOrEmpty(result.TodayRoutine.RoutineName));
Assert.False(string.IsNullOrEmpty(result.TodayRoutine.TodayRoutineDayId));

// Test 2: Usuario SIN rutina asignada
var result2 = await GetHomeStateAsync("user-without-routine");
Assert.Null(result2.TodayRoutine);
```

---

## 📝 RESUMEN

**ACCIÓN REQUERIDA:**
Modificar el endpoint `/app-state/overview` para que el objeto `TodayRoutine` incluya **siempre** los campos `RoutineName` y `TodayRoutineDayId` cuando el usuario tenga una rutina asignada activa.

**PRIORIDAD:** 🔴 ALTA (El frontend está usando un workaround temporal que muestra "Rutina del día" genérico)

**ARCHIVO FRONTEND CON WORKAROUND:**
- `hooks/useHomeDashboardAdapter.ts` (línea ~115-120)

**ENDPOINT A CORREGIR:**
- `GET /app-state/overview` → Sección `Home.TodayRoutine`

**BENEFICIO:**
Los usuarios verán correctamente el nombre de su rutina asignada en la pantalla de inicio, mejorando significativamente la UX.
