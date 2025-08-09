const fs = require('fs');
const path = require('path');

console.log('🔨 Final cleanup for specific parsing errors...');

// Lista de archivos que todavía tienen errores de parsing
const problemFiles = [
  'components/dailyExercise/DailyExerciseList.tsx',
  'components/dailyHistory/DailyHistoryList.tsx',
  'components/employeeRegisterDaily/EmployeeRegisterDailyList.tsx',
  'components/employeeType/EmployeeTypeList.tsx',
  'components/employeeUser/EmployeeUserList.tsx',
  'components/equipment/EquipmentList.tsx',
  'components/exercise/DailyExerciseHistoryList.tsx',
  'components/exercise/DailyExerciseList.tsx',
  'components/exercise/ExerciseList.tsx',
  'components/feed/FeedList.tsx',
  'components/fitUser/FitUserList.tsx',
  'components/gymImage/GymImageList.tsx',
  'components/gymPlanSelectedModule/GymPlanSelectedModuleList.tsx',
  'components/gymPlanSelectedType/GymPlanSelectedTypeList.tsx',
  'components/gymType/GymTypeList.tsx',
  'components/gym/GymList.tsx',
  'components/history/DailyHistoryList.tsx',
  'components/journeyEmployee/JourneyEmployeeList.tsx',
  'components/like/LikeList.tsx',
  'components/logUninstall/LogUninstallList.tsx',
  'components/machineCategory/MachineCategoryList.tsx',
  'components/machine/MachineList.tsx',
  'components/module/ModuleList.tsx',
  'components/notificationOption/NotificationOptionList.tsx',
  'components/notification/NotificationList.tsx',
  'components/occupancy/CurrentOccupancyList.tsx',
  'components/otp/OtpList.tsx',
  'components/paymentMethod/PaymentMethodList.tsx',
  'components/permission/PermissionList.tsx',
  'components/physicalAssessment/PhysicalAssessmentList.tsx',
  'components/planType/PlanTypeList.tsx',
  'components/plan/PlanList.tsx',
  'components/routineAssigned/RoutineAssignedList.tsx',
  'components/routineDay/RoutineDayList.tsx',
  'components/routineExercise/RoutineExerciseList.tsx',
  'components/routineTemplate/RoutineTemplateList.tsx',
  'components/schedule/ScheduleList.tsx',
  'components/signalR/SignalRList.tsx',
  'components/subModule/SubModuleList.tsx',
  'components/uninstallOption/UninstallOptionList.tsx',
  'components/userType/UserTypeList.tsx'
];

let fixed = 0;

problemFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const original = content;

    // Fix pattern: },\n  }, []);  =>  }\n  }, []);
    content = content.replace(/\},\s*\n\s*\},\s*\[\]/g, '}\n  }, []');
    
    // Fix pattern: return [];\n  },\n  }, []);  =>  return [];\n    }\n  }, []);
    content = content.replace(/(return [^;]+;)\s*\n\s*\},\s*\n\s*\},\s*\[\]/g, '$1\n    }\n  }, []');
    
    // Fix any remaining double commas
    content = content.replace(/\},\s*\n\s*\}/g, '}\n  }');
    
    // Fix misplaced semicolons in object properties
    content = content.replace(/(\w+):\s*([^,;]+);([^}]*\})/g, '$1: $2,$3');
    
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      fixed++;
    }
  } catch (error) {
    console.error(`❌ Error: ${filePath}`);
  }
});

console.log(`✅ Fixed ${fixed} files with final cleanup`);
