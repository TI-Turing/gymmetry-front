# Script de refactoring masivo para componentes List
# Este script refactoriza todos los componentes *List.tsx al patrón EntityList

$baseDir = "c:\Users\Usuario\source\repos\TI-Turing\gymmetry-front\components"

# Lista de componentes a refactorizar (excluyendo los ya refactorizados)
$components = @(
    @{Path="accessMethodType\AccessMethodTypeList.tsx"; Service="accessMethodTypeFunctionsService"; Title="Tipos de Acceso"; Entity="AccessMethodType"; EmptyMsg="métodos de acceso"},
    @{Path="bill\BillList.tsx"; Service="billFunctionsService"; Title="Facturas"; Entity="Bill"; EmptyMsg="facturas"},
    @{Path="branchMedia\BranchMediaList.tsx"; Service="branchMediaFunctionsService"; Title="Media de Sucursales"; Entity="BranchMedia"; EmptyMsg="archivos multimedia"},
    @{Path="subModule\SubModuleList.tsx"; Service="subModuleFunctionsService"; Title="Sub-Módulos"; Entity="SubModule"; EmptyMsg="sub-módulos"},
    @{Path="routineDay\RoutineDayList.tsx"; Service="routineDayFunctionsService"; Title="Días de Rutina"; Entity="RoutineDay"; EmptyMsg="días de rutina"},
    @{Path="routineExercise\RoutineExerciseList.tsx"; Service="routineExerciseFunctionsService"; Title="Ejercicios de Rutina"; Entity="RoutineExercise"; EmptyMsg="ejercicios de rutina"},
    @{Path="planType\PlanTypeList.tsx"; Service="planTypeFunctionsService"; Title="Tipos de Plan"; Entity="PlanType"; EmptyMsg="tipos de plan"},
    @{Path="physicalAssessment\PhysicalAssessmentList.tsx"; Service="physicalAssessmentFunctionsService"; Title="Evaluaciones Físicas"; Entity="PhysicalAssessment"; EmptyMsg="evaluaciones"},
    @{Path="routineAssigned\RoutineAssignedList.tsx"; Service="routineAssignedFunctionsService"; Title="Rutinas Asignadas"; Entity="RoutineAssigned"; EmptyMsg="rutinas asignadas"},
    @{Path="otp\OtpList.tsx"; Service="otpFunctionsService"; Title="Códigos OTP"; Entity="Otp"; EmptyMsg="códigos OTP"}
)

# Función para generar el template refactorizado
function Generate-RefactoredComponent {
    param(
        [string]$ComponentName,
        [string]$ServiceName,
        [string]$Title,
        [string]$EntityType,
        [string]$EmptyMessage
    )
    
    $functionName = $ComponentName -replace "List$", ""
    $lowerFunctionName = $functionName.ToLower()
    
    return @"
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { $ServiceName } from '@/services/functions';

export function $ComponentName() {
  const load${functionName}s = useCallback(async () => {
    const response = await $ServiceName.getAll${functionName}s();
    return response.Data || [];
  }, []);

  const render${functionName}Item = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.title || `$functionName ${'$'}{item.id?.slice(0, 8) || 'N/A'}`}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        
        {item.user && (
          <Text style={styles.user}>
            Usuario: {item.user.name || item.user.email || 'N/A'}
          </Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='$Title'
      loadFunction={load${functionName}s}
      renderItem={render${functionName}Item}
      keyExtractor={keyExtractor}
      emptyTitle='No hay $EmptyMessage'
      emptyMessage='No se encontraron $EmptyMessage registrados'
      loadingMessage='Cargando $EmptyMessage...'
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 60,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  user: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});

export default $ComponentName;
"@
}

Write-Host "Iniciando refactoring masivo de $($components.Count) componentes..."

foreach ($comp in $components) {
    $componentName = [System.IO.Path]::GetFileNameWithoutExtension($comp.Path)
    $content = Generate-RefactoredComponent -ComponentName $componentName -ServiceName $comp.Service -Title $comp.Title -EntityType $comp.Entity -EmptyMessage $comp.EmptyMsg
    
    $filePath = Join-Path $baseDir $comp.Path
    $backupPath = $filePath + ".backup"
    
    Write-Host "Refactorizando: $componentName"
    
    # Crear backup del archivo original
    if (Test-Path $filePath) {
        Copy-Item $filePath $backupPath -Force
        # Escribir el nuevo contenido
        $content | Out-File -FilePath $filePath -Encoding UTF8 -Force
        Write-Host "  ✓ Completado: $componentName"
    } else {
        Write-Host "  ✗ Archivo no encontrado: $filePath"
    }
}

Write-Host "Refactoring masivo completado!"
