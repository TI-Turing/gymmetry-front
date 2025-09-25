export type Dict = Record<string, string>;

const es: Dict = {
  settings_title: 'Ajustes',
  appearance: 'Apariencia',
  theme: 'Tema',
  system: 'Sistema',
  light: 'Claro',
  dark: 'Oscuro',
  reduce_motion: 'Reducir animaciones',
  preferences: 'Preferencias',
  language: 'Idioma',
  data_saver: 'Ahorro de datos',
  image_quality: 'Calidad de imágenes',
  notifications: 'Notificaciones',
  enable_notifications: 'Habilitar notificaciones',
  training_notifications: 'Recordatorios durante entreno',
  quiet_hours: 'Horas silenciosas',
  wellness: 'Bienestar',
  hydration_reminders: 'Recordatorios de hidratación',
  hydration_interval: 'Intervalo hidratación',
  active_breaks: 'Pausas activas',
  breaks_interval: 'Intervalo pausas',
  diagnostics_cache: 'Diagnóstico y caché',
  analytics: 'Analítica y telemetría',
  log_level: 'Nivel de logs',
  offline_cache: 'Caché offline',
  training: 'Entrenamiento',
  sound_cues: 'Señales sonoras / vibración',
  prep_time: 'Tiempo de preparación entre ciclos',
  test_hydration: 'Probar hidratación (5s)',
  test_break: 'Probar pausa (5s)',
  back: 'Atrás',
  menu_title: 'Menú',
  menu_open: 'Abrir menú',
  menu_close: 'Cerrar menú',
  routines: 'Rutinas',
  plans: 'Planes',
  physical_assessment: 'Estado físico',
  user_exercise_max_short: 'RM',
  settings_label: 'Ajustes',
  support_contact: 'Contactar Soporte',
  report_bug: 'Reportar un problema o bug',
  logout: 'Cerrar Sesión',
  login_subtitle: 'Inicia sesión para continuar',
  username_or_email: 'Usuario o Email',
  password_label: 'Contraseña',
  show_password: 'Mostrar contraseña',
  hide_password: 'Ocultar contraseña',
  sign_in: 'Iniciar sesión',
  signing_in: 'Iniciando sesión...',
  no_account: '¿No tienes cuenta?',
  go_register: 'Regístrate',
  step_credentials: 'Credenciales',
  step_basic: 'Datos básicos',
  step_personal: 'Información personal',
  step_fitness: 'Datos fitness',
  step_profile: 'Perfil',
  fill_all_fields: 'Por favor completa todos los campos',
  unknown_error: 'Error desconocido',
  connection_error:
    'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
  incorrect_credentials: 'Credenciales incorrectas',
  server_error: 'Error del servidor. Intenta más tarde.',
  get_user_error: 'Error al obtener los datos del usuario',
  welcome: 'Bienvenido',
  login_success: 'Has iniciado sesión exitosamente.',

  // Navigation/Dashboard
  home: 'Inicio',
  gym: 'Gym',
  progress: 'Progreso',

  // Gym Screen
  loading: 'Cargando...',
  loading_gyms: 'Cargando gimnasios...',

  // No Gym View
  connect_gym_title: '¡Conecta con tu Gym! 🏋️‍♂️',
  connect_gym_subtitle:
    'Vincula tu cuenta con un gimnasio para comenzar tu experiencia',
  connect_gym_info:
    'Una vez vinculado, podrás ver información en tiempo real del gimnasio, horarios, ocupación y mucho más.',
  scan_qr: 'Escanear código QR',
  search_gyms: 'Buscar gimnasios',
  register_gym: 'Registrar gimnasio',
  open_scanner: 'Abrir Escáner',
  qr_scanner: 'Escáner QR',
  qr_scanner_info:
    'Apunta con la cámara al código QR proporcionado por tu gimnasio para vincular tu cuenta.',
  // Gym List
  gyms_title: 'Gimnasios',
  no_gyms_title: 'No hay gimnasios',
  no_gyms_message: 'No se encontraron gimnasios registrados',
  gym_no_name: 'Gimnasio sin nombre',

  // Gym Registration Steps
  gym_step_basic_info: 'Información Básica',
  gym_step_type_description: 'Tipo y Descripción',
  gym_step_location: 'Ubicación',
  gym_step_digital_presence: 'Presencia Digital',
  gym_step_multimedia: 'Multimedia',

  // Common actions
  next: 'Siguiente',
  previous: 'Anterior',
  cancel: 'Cancelar',
  complete: 'Completar',
  save: 'Guardar',
  edit: 'Editar',
  delete: 'Eliminar',
  confirm: 'Confirmar',
  accept: 'Aceptar',
  close: 'Cerrar',
  continue: 'Continuar',
  finish: 'Finalizar',

  // Form labels
  name: 'Nombre',
  description: 'Descripción',
  address: 'Dirección',
  phone: 'Teléfono',
  email: 'Email',
  website: 'Sitio web',
  type: 'Tipo',

  // Status/States
  connected: 'Conectado',
  disconnected: 'Desconectado',
  active: 'Activo',
  inactive: 'Inactivo',
  available: 'Disponible',
  unavailable: 'No disponible',

  // Gym Step 1
  gym_step1_title: 'Información Básica',
  gym_step1_subtitle: 'Comencemos con los datos principales de tu gimnasio',
  gym_name_label: 'Nombre del Gimnasio *',
  corporate_email_label: 'Email Corporativo *',
  main_phone_label: 'Teléfono Principal *',
  nit_label: 'NIT o Identificación Tributaria *',
  gym_step1_info:
    'Esta información será verificada por nuestro equipo. Asegúrate de que sea correcta y esté actualizada.',
  loading_registering_gym: 'Registrando gimnasio...',
  save_continue: 'Guardar y Continuar',

  // Gym Step 2 - Type and Description
  gym_step2_title: 'Tipo y Descripción',
  gym_step2_subtitle:
    'Cuéntanos qué tipo de gimnasio es y sus características principales',
  gym_type_label: 'Tipo de Gimnasio *',
  slogan_label: 'Slogan (Opcional)',
  gym_description_label: 'Descripción del Gimnasio *',
  selected_type_label: 'Tipo seleccionado:',
  gym_type_required: 'Debes seleccionar un tipo de gimnasio',
  gym_description_required: 'La descripción es requerida',
  error_loading_gym_types: 'No se pudieron cargar los tipos de gimnasio',
  connection_error_gym_types: 'Error de conexión al cargar tipos de gimnasio',
  error_updating_info: 'Error al actualizar la información',
  loading_saving: 'Guardando...',

  // Gym Step 3 - Location
  gym_step3_title: 'Ubicación de la empresa',
  gym_step3_subtitle:
    'Selecciona el país, región, ciudad en el que se encuentra registrado el gimnasio',
  main_office_address_label: 'Dirección de la oficina principal*',
  error_loading_countries: 'No se pudieron cargar los países',
  error_loading_regions: 'No se pudieron cargar las regiones',
  error_loading_cities: 'No se pudieron cargar las ciudades',
  country_required: 'Selecciona un país',
  region_required: 'Selecciona una región',
  city_required: 'Selecciona una ciudad',
  address_required: 'Ingresa la dirección',
  error_saving_location: 'No se pudo guardar la información de ubicación',

  // Gym Step 4 - Digital Presence
  gym_step4_title: 'Presencia Digital',
  gym_step4_subtitle:
    'Agrega los enlaces a tus redes sociales y sitio web (opcional)',
  website_label: 'Sitio Web',
  instagram_label: 'Instagram',
  facebook_label: 'Facebook',
  digital_presence_info:
    'Todos los campos son opcionales. Puedes agregarlos más tarde.',
  invalid_website_url: 'La URL del sitio web no es válida',
  invalid_instagram_url: 'La URL de Instagram no es válida',
  invalid_facebook_url: 'La URL de Facebook no es válida',
  error_saving_digital_presence:
    'No se pudo guardar la información de presencia digital',

  // Gym Step 5 - Multimedia
  gym_step5_title: 'Multimedia',
  gym_step5_subtitle:
    'Agrega imágenes y videos para mostrar tu gimnasio (opcional)',
  gym_logo_section: 'Logo del Gimnasio',
  cover_image_section: 'Imagen de Portada',
  gallery_images_section: 'Galería de Imágenes',
  videos_section: 'Videos',
  select_logo: 'Seleccionar Logo',
  select_cover_image: 'Seleccionar Imagen de Portada',
  add_gallery_images: 'Agregar Imágenes',
  add_videos: 'Agregar Videos',
  logo_selected: 'Logo seleccionado',
  cover_image_selected: 'Imagen de portada seleccionada',
  multimedia_info:
    'Todos los archivos multimedia son opcionales. Podrás agregarlos más tarde desde tu perfil.',
  finish_registration: 'Finalizar Registro',
  functionality_in_development: 'Funcionalidad en desarrollo',
  logo_selection_development: 'Selección de logo en desarrollo',
  cover_image_selection_development:
    'Selección de imagen de portada en desarrollo',
  gallery_images_development: 'Agregar imágenes a la galería en desarrollo',
  videos_development: 'Agregar videos en desarrollo',
  error_saving_multimedia: 'No se pudo guardar la información multimedia',

  // Gym Type Dropdown
  select_option: 'Seleccione',
  dropdown_hint: 'Presiona para abrir la lista de tipos de gimnasio',
  select_gym_type_modal_title: 'Selecciona el tipo de gimnasio',
  no_options_available: 'Sin opciones disponibles',

  // Gym Options
  scan_qr_title: 'Escanear Código QR',
  scan_qr_subtitle: 'Escanea el código QR disponible en tu gimnasio',
  search_gyms_title: 'Buscar Gimnasios',
  search_gyms_subtitle: 'Encuentra gimnasios cercanos a tu ubicación',
  register_gym_title: '¿Eres el dueño de un Gym?',
  register_gym_subtitle: 'Registra tu gimnasio aquí y conecta con más usuarios',
  registering: 'Registrando...',

  // Validation messages
  gym_name_required: 'El nombre del gimnasio es requerido',
  email_required: 'El email es requerido',
  email_invalid: 'El email no es válido',
  phone_required: 'El teléfono es requerido',
  nit_required: 'El NIT es requerido',
  complete_required_fields: 'Por favor completa todos los campos requeridos',
  registration_error: 'Error al registrar el gimnasio',
  connection_error_retry: 'Error de conexión. Intenta nuevamente.',

  // Routine Templates
  routine_templates_title: 'Plantillas de Rutinas',
  routine_template_detail: 'RoutineTemplate - Detalle',
  detail_query_id: 'Consulta por Id no disponible',
  detail_query_error: 'Error al consultar',
  query_button: 'Consultar',
  active_routine: 'Rutina Activa',
  no_active_routine: 'Sin rutina activa',
  available_routines: 'Rutinas Disponibles',
  assign_routine: 'Asignar Rutina',
  routine_assigned_success: 'Rutina asignada exitosamente',
  routine_assignment_error: 'Error al asignar la rutina',
  start_routine: 'Iniciar Rutina',
  continue_routine: 'Continuar Rutina',
  view_details: 'Ver Detalles',
  assign_comment_label: 'Comentario (opcional)',
  assign_comment_placeholder: 'Agrega un comentario sobre esta asignación...',
  assigning_routine: 'Asignando rutina...',

  // Routine Filters
  filters: 'Filtros',
  filter_options: 'Opciones de Filtrado',
  equipment_required: 'Requiere Equipos',
  calisthenics: 'Calistenia',
  objectives: 'Objetivos',
  clear_filters: 'Limpiar Filtros',
  apply_filters: 'Aplicar Filtros',
  active_filters: 'filtros activos',
  filter_intensity_low: 'Bajo',
  filter_intensity_medium: 'Medio',
  filter_intensity_high: 'Alto',
  total_results: 'resultados',

  // Routine Objectives
  objective_weight_loss: 'Pérdida de Peso',
  objective_muscle_mass: 'Masa Muscular',
  objective_muscle_definition: 'Definición Muscular',
  objective_strength: 'Fuerza',
  objective_endurance: 'Resistencia Física',
  objective_toning: 'Tonificación',
  objective_mobility: 'Movilidad',
  objective_posture: 'Postura',
  objective_rehabilitation: 'Rehabilitación',
  objective_cardiovascular: 'Salud Cardiovascular',
  objective_stress_relief: 'Anti Estrés',
  objective_energy: 'Energía',
  objective_sleep: 'Sueño',
  objective_elderly: 'Adulto Mayor',
  objective_chronic_diseases: 'Enfermedades Crónicas',
  objective_functional_training: 'Entrenamiento Funcional',
  objective_specific_sports: 'Deportes Específicos',
  objective_physical_tests: 'Pruebas Físicas',
  objective_hiit: 'HIIT',

  // Exercise Modal
  exercise_details: 'Detalles del Ejercicio',
  sets_and_reps: 'Series y Repeticiones',
  completed_sets: 'Series Completadas',
  set_number: 'Serie',
  rest_time: 'Tiempo de Descanso',
  next_set: 'Siguiente Serie',
  finish_exercise: 'Finalizar Ejercicio',
  mark_set_complete: 'Marcar Serie como Completada',
  undo_set: 'Deshacer Serie',
  exercise_completed: 'Ejercicio Completado',
  congratulations: '¡Felicitaciones!',
  motivational_phrase: 'Frase Motivacional',
  continue_routine_exercise: 'Continuar Rutina',
  exercise_instructions: 'Instrucciones del Ejercicio',
  exercise_tips: 'Tips para el Ejercicio',
  weight_used: 'Peso Utilizado',
  reps_completed: 'Repeticiones Completadas',
  notes: 'Notas',
  save_progress: 'Guardar Progreso',
  exercise_timer: 'Temporizador de Ejercicio',
  start_timer: 'Iniciar Temporizador',
  pause_timer: 'Pausar Temporizador',
  reset_timer: 'Reiniciar Temporizador',
  timer_finished: 'Tiempo Completado',
  time_remaining: 'Tiempo Restante',

  // Exercise States
  preparing: 'PREPARÁNDOSE',
  exercising: 'EJERCITÁNDOSE',
  resting: 'DESCANSANDO',
  get_ready: '¡PREPÁRATE!',
  start_now: '¡COMIENZA!',
  rest_now: '¡DESCANSA!',
  next_exercise: 'Siguiente Ejercicio',
  routine_complete: 'Rutina Completada',

  // Exercise Progress
  progress_saved: 'Progreso guardado',
  progress_error: 'Error al guardar el progreso',
  loading_exercise: 'Cargando ejercicio...',
  exercise_not_found: 'Ejercicio no encontrado',
  invalid_exercise_data: 'Datos de ejercicio inválidos',

  // Additional Routine Messages
  user_not_authenticated: 'Usuario no autenticado',
  loading_routines_error: 'Error al cargar rutinas',
  no_active_routines: 'Sin rutinas activas en este momento.',
  available_routines_in_plan: 'Rutinas Disponibles en tu plan activo',
  no_routines_match_filters:
    'No hay rutinas que coincidan con los filtros seleccionados.',
  no_routines_available: 'No hay rutinas disponibles.',
  premium: 'Premium',
  free: 'Gratis',
  set_as_routine: 'Establecer como mi rutina',
  set_routine: 'Establecer Rutina',
  add_comment_placeholder: 'Agregar un comentario...',
  set_as_routine_button: 'Establecer como rutina',
  create_new_routine: 'Crear nueva rutina',
  routine_plans: 'Planes',
  routine_settings: 'Ajustes',
  routine_logout: 'Cerrar Sesión',

  // Additional System Terms
  of: 'de',
  routine: 'rutina',
  assign_routine_error: 'Error al asignar rutina',
  open_filters: 'Abrir filtros',
  comment_optional: 'Comentario (opcional)',

  // Routine Filters
  routine_filters: 'Filtros de Rutinas',
  found: 'encontrada',
  clear: 'Limpiar',
  characteristics: 'Características',
  objectives_and_characteristics: 'Objetivos y Características',
  select_focus_level: 'Selecciona el nivel de enfoque para cada objetivo',
  all: 'Todos',
  yes: 'Sí',
  no: 'No',

  // Intensity Levels
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',

  // Exercise Modal
  complete_exercise: 'Completar Ejercicio',
  undo_set_exercise: 'Deshacer Set',
  prepare: 'PREPÁRATE',
  timer_active: 'ACTIVO',
  rest: 'DESCANSO',
  stopped: 'Detenido',
  restart_timer: 'Reiniciar tiempo',
  start_set: 'Iniciar {ordinal} set',
  stop: 'Detener',
  finish_set: 'Terminar Set',

  // Timer phrases
  timer_on: 'ACTIVO',
  timer_off: 'DESCANSO',
  timer_prep: 'PREPÁRATE',
  timer_stopped: 'Detenido',

  // Exercise Info
  sets: 'Sets',
  reps: 'Reps',

  // Reps Prompt Modal
  repetitions_completed: 'Repeticiones realizadas',
  set_of: 'Set {current} de {total}',
  reps_placeholder: 'Ej. 8',
  skip: 'Omitir',
  save_reps: 'Guardar',

  // Exercise Categories
  warmup: 'Calentamiento',
  main_workout: 'Entrenamiento Principal',
  cooldown: 'Enfriamiento',
  cardio: 'Cardio',
  compound_exercise: 'Ejercicio principal (compuesto)',
  functional: 'Funcional',
  isolated_focused: 'Aislado (focalizado)',
  stretching: 'Estiramiento',
  other: 'Otros',

  // Routine Day Screen
  todays_routine: 'Rutina de Hoy',
  view_summary: 'Ver resumen',
  share: 'Compartir',
  explore_routines: 'Explorar rutinas',
  mark_all_and_finish: 'Marcar todo y finalizar',
  finish_with_current_progress: 'Finalizar con avance actual',
  restart_progress: 'Reiniciar progreso',
  finish_routine: 'Finalizar rutina',
  restart: 'Reiniciar',
  reps_label: 'Reps:',
  resume_routine_notification_title: '¿Retomas tu rutina?',
  resume_routine_notification_body:
    'Tienes una rutina en curso. Cuando puedas, vuelve a darle.',

  // Days of the week
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',

  // General terms
  today: 'Hoy',

  // Confirmation messages
  restart_progress_message:
    'Perderás el avance registrado en todos los ejercicios. ¿Deseas continuar?',

  // Alerts
  day_in_progress_title: 'Día en progreso',
  day_in_progress_message:
    'Ya iniciaste los ejercicios del día {fromDay}. Debes cancelar ese avance para poder continuar con el día {toDay}.',

  // Completion messages
  training_completed: '¡Entrenamiento completado!',
  great_job_subtitle:
    'Gran trabajo, mantén la constancia. Marca la diferencia cada día.',
  routine_finished_partial: 'Rutina finalizada (avance {progress}%)',
  good_effort_subtitle:
    'Buen esfuerzo aunque no hayas terminado todo. La constancia se construye día a día.',
  how_to_finish_title: '¿Cómo prefieres terminar esta rutina?',
  how_to_finish_subtitle:
    'Puedes cerrar con tu avance actual o marcar todo como completado.',

  // Info modal
  no_description: 'Sin descripción.',
  minimum_progress_required:
    'Necesitas al menos 30% de avance para esta opción.',

  // Routine Assigned Card
  assigned_routine: 'Rutina asignada',
  assigned_on: 'Asignada el',
  status_label: 'Estado:',
  active_status: 'Activa',
  inactive_status: 'Inactiva',
  premium_badge: 'Premium',
  free_badge: 'Gratis',
  tap_to_view_routine: 'Tocar para ver rutina de hoy',
  view_todays_routine: 'Ver rutina de hoy',

  // Feed
  feed: 'Feed',
  toggle_anonymous_mode: 'Alternar modo anónimo',
  training_now: 'Entrenando ahora',
  user: 'Usuario',
  no_more_posts: 'No hay más publicaciones',
  anonymous_notice_message:
    'Estás interactuando como Anónimo. Tu nombre no será visible para otros usuarios.',
  anonymous_notice_support_visible:
    'Aun así, el soporte de Gymmetry puede ver tu identidad. Debes cumplir las reglas de comunidad.',
  view_behavior_rules: 'Ver reglas de comportamiento',
  community_rules_title: 'Reglas de la comunidad',
  rule_respect:
    'Respeta a los demás. No uses lenguaje ofensivo ni discriminatorio.',
  rule_no_harassment: 'Prohibido el acoso, amenazas o intimidación.',
  rule_no_spam: 'Evita spam, publicidad no solicitada o contenido repetitivo.',
  rule_no_illegal:
    'No publiques contenido ilegal o que infrinja derechos de terceros.',
  rule_privacy: 'No compartas información privada sin consentimiento.',
  rule_false_info: 'No difundas información falsa o engañosa.',
  rule_report_abuse:
    'Reporta abusos; el equipo puede tomar medidas incluyendo suspensión.',

  // Progress Dashboard
  progress_dashboard_login_required:
    'Debes iniciar sesión para ver tu progreso',
  progress_dashboard_no_data: 'No hay datos de progreso disponibles.',
  progress_dashboard_error_rendering:
    'Error al mostrar el dashboard de progreso',
  progress_dashboard_retry: 'Reintentar',
  progress_dashboard_no_muscle_data: 'No hay datos de músculos disponibles',
  progress_dashboard_period_label: 'Período:',
  progress_dashboard_last_month: 'Último mes',
  progress_dashboard_last_3_months: 'Últimos 3 meses',
  progress_dashboard_last_6_months: 'Últimos 6 meses',
  progress_dashboard_last_year: 'Último año',
  progress_dashboard_last_2_years: 'Últimos 2 años',
  progress_dashboard_custom: 'Personalizado',
  progress_dashboard_select_period: 'Seleccionar Período',
  progress_dashboard_custom_period: 'Período Personalizado',
  progress_dashboard_start_date: 'Fecha de inicio:',
  progress_dashboard_end_date: 'Fecha de fin:',
  progress_dashboard_cancel: 'Cancelar',
  progress_dashboard_apply: 'Aplicar',

  // Detailed progress modal
  'progress_modal.total_progress': 'Progreso total',
  'progress_modal.completed_days_suffix': 'días completados',
  'progress_modal.attended_days': 'Días asistidos',
  'progress_modal.attended_days_helper': 'Sesiones registradas',
  'progress_modal.longest_streak': 'Mejor racha',
  'progress_modal.longest_streak_helper': 'Días consecutivos completados',
  'progress_modal.average_progress': 'Promedio de avance',
  'progress_modal.average_progress_helper': 'Porcentaje promedio por día',
  'progress_modal.consistency_rate': 'Tasa de consistencia',
  'progress_modal.consistency_rate_helper': 'días completados de días activos',
  'progress_modal.best_day': 'Mejor día',
  'progress_modal.best_day_helper': 'Día con mayor avance',
  'progress_modal.rest_days': 'Días de descanso',
  'progress_modal.rest_days_helper': 'Días sin actividad',
  'progress_modal.share_dialog_title': 'Compartir progreso',
  'progress_modal.month_label': 'Mensual',
  'progress_modal.plan_label': 'Plan',
  'progress_modal.no_data_title': 'Sin datos de disciplina todavía',
  'progress_modal.no_data_helper':
    'Completa rutinas para ver tu progreso aquí.',
  'progress_modal.share_button': 'Compartir progreso',
  'progress_modal.loading_error_title': 'Error al cargar datos',
  'progress_modal.capture_unavailable_title': 'Captura no disponible',
  'progress_modal.capture_unavailable_body':
    'Asegúrate de que el contenido esté visible antes de compartir.',
  'progress_modal.sharing_not_supported_title': 'Compartir no disponible',
  'progress_modal.sharing_not_supported_body':
    'Este dispositivo no permite compartir imágenes desde la aplicación.',
  'progress_modal.share_error_title': 'Error al compartir',
  'progress_modal.share_error_body':
    'No se pudo compartir el progreso. Inténtalo nuevamente.',
  'progress_modal.preparing_capture': 'Preparando captura...',
  'progress_modal.watermark': 'Gymmetry',

  // Physical Measures
  progress_dashboard_recent_measures: 'Medidas físicas recientes',
  progress_dashboard_height: 'Altura',
  progress_dashboard_weight: 'Peso',
  progress_dashboard_body_fat: '% Grasa',
  progress_dashboard_waist: 'Cintura',
  progress_dashboard_hip: 'Cadera',
  progress_dashboard_chest: 'Pecho',
  progress_dashboard_arm: 'Brazo',
  progress_dashboard_leg: 'Pierna',
  progress_dashboard_see_more: 'Ver más',
  progress_dashboard_see_less: 'Ver menos',
  progress_dashboard_see_history: 'Ver histórico',

  // Summary Section
  progress_dashboard_period_summary: '📊 Resumen del Período',
  progress_dashboard_adherence: 'Adherencia',
  progress_dashboard_current_streak: 'Racha Actual',
  progress_dashboard_sessions: 'Sesiones',
  progress_dashboard_exercises: 'Ejercicios',
  progress_dashboard_weekly_progress: 'Progreso semanal',
  progress_dashboard_days: 'días',

  // Muscle Distribution
  progress_dashboard_muscle_distribution: '💪 Distribución Muscular',
  progress_dashboard_dominant_groups: 'Grupos dominantes:',

  // Featured Exercises
  progress_dashboard_featured_exercises: '🏋️‍♂️ Ejercicios Destacados',
  progress_dashboard_most_practiced: 'Más practicados:',
  progress_dashboard_total_series: 'Series totales',
  progress_dashboard_repetitions: 'Repeticiones',
  progress_dashboard_total_minutes: 'Minutos totales',

  // Objectives
  progress_dashboard_objectives: '🎯 Objetivos',

  // Suggestions
  progress_dashboard_suggestions: '💡 Sugerencias',
  progress_dashboard_suggestion: 'Sugerencia',

  // Personal Records
  progress_dashboard_personal_records: '🏆 Records Personales',
  progress_dashboard_no_personal_records:
    'No hay records personales registrados en este período.',

  // Discipline
  progress_dashboard_discipline: '⏰ Disciplina',
  progress_dashboard_consistency: 'Consistencia',
  progress_dashboard_common_hour: 'Hora común',
  progress_dashboard_regularity: 'Regularidad',

  // Progress Tabs
  progress_tabs_login_required: 'Debes iniciar sesión para ver tu progreso',
  progress_tabs_loading: 'Cargando progreso...',
  progress_tabs_error: 'Error:',
  progress_tabs_no_data:
    'No hay datos de progreso disponibles para este período',
  progress_tabs_summary: 'Resumen',
  progress_tabs_exercises: 'Ejercicios',
  progress_tabs_objectives: 'Objetivos',
  progress_tabs_muscles: 'Músculos',
  progress_tabs_discipline: 'Disciplina',
  progress_tabs_suggestions: 'Sugerencias',

  // Report System
  reportModal_title: 'Reportar Contenido',
  reportModal_submit: 'Enviar',
  reportModal_contentPreview: 'Vista Previa del Contenido',
  reportModal_reasonTitle: 'Motivo del Reporte',
  reportModal_reasonDescription:
    'Selecciona la razón que mejor describe el problema',
  reportModal_descriptionTitle: 'Descripción Detallada',
  reportModal_descriptionDescription:
    'Proporciona más detalles sobre el problema',
  reportModal_descriptionPlaceholder:
    'Describe específicamente qué está mal con este contenido...',
  reportModal_priorityTitle: 'Prioridad',
  reportModal_priorityDescription:
    'Indica qué tan urgente consideras este reporte',
  reportModal_priority_low: 'Baja',
  reportModal_priority_medium: 'Media',
  reportModal_priority_high: 'Alta',
  reportModal_guidelinesTitle: 'Directrices de la Comunidad',
  reportModal_guidelinesText:
    'Los reportes se revisan manualmente. Reporta solo contenido que viole genuinamente nuestras reglas comunitarias.',
  reportModal_validation_title: 'Validación Requerida',
  reportModal_validation_reasonRequired:
    'Debes seleccionar un motivo para el reporte',
  reportModal_validation_descriptionTooShort:
    'La descripción debe tener al menos 10 caracteres',
  reportModal_validation_descriptionTooLong:
    'La descripción no puede exceder 500 caracteres',
  reportModal_success_title: 'Reporte Enviado',
  reportModal_success_message:
    'Tu reporte ha sido enviado y será revisado por nuestro equipo de moderación',
  reportModal_error_title: 'Error al Enviar',
  reportModal_error_defaultMessage: 'Ocurrió un error al enviar el reporte',
  reportModal_error_networkError:
    'Error de conexión. Revisa tu internet e intenta de nuevo',
  reportModal_rateLimit_title: 'Límite de Reportes',
  reportModal_rateLimit_message:
    'Has alcanzado el límite diario de reportes. Intenta mañana.',
  reportModal_rateLimit_warning: 'Reportes restantes hoy:',
  reportModal_rateLimit_reached: 'Límite diario de reportes alcanzado',

  reportButton_report: 'Reportar',
  reportButton_accessibilityLabel: 'Reportar contenido',
  reportButton_accessibilityHint:
    'Abre un formulario para reportar este contenido',

  // Block System
  blockButton_block: 'Bloquear',
  blockButton_unblock: 'Desbloquear',
  blockButton_success_blocked_title: 'Usuario Bloqueado',
  blockButton_success_blocked_message:
    'Has bloqueado a este usuario exitosamente',
  blockButton_success_unblocked_title: 'Usuario Desbloqueado',
  blockButton_success_unblocked_message:
    'Has desbloqueado a este usuario exitosamente',
  blockButton_error_title: 'Error de Bloqueo',
  blockButton_error_defaultMessage: 'Ocurrió un error al procesar la acción',
  blockButton_error_networkError:
    'Error de conexión. Revisa tu internet e intenta de nuevo',
  blockButton_confirm_block_title: 'Confirmar Bloqueo',
  blockButton_confirm_block_message:
    '¿Estás seguro que quieres bloquear a este usuario?',
  blockButton_confirm_unblock_title: 'Confirmar Desbloqueo',
  blockButton_confirm_unblock_message:
    '¿Estás seguro que quieres desbloquear a este usuario?',
  blockButton_accessibility_block: 'Bloquear usuario',
  blockButton_accessibility_unblock: 'Desbloquear usuario',
  blockButton_accessibility_blockHint:
    'Bloquea a este usuario para no ver su contenido',
  blockButton_accessibility_unblockHint:
    'Desbloquea a este usuario para volver a ver su contenido',
  blockButton_remaining: 'Restantes',

  // Blocked Users List
  blockedUsersList_loading: 'Cargando usuarios bloqueados...',
  blockedUsersList_stats: 'usuarios bloqueados',
  blockedUsersList_unblock: 'Desbloquear',
  blockedUsersList_blockedFor: 'Bloqueado hace',
  blockedUsersList_success_unblocked_title: 'Usuario Desbloqueado',
  blockedUsersList_success_unblocked_message: 'Has desbloqueado a',
  blockedUsersList_error_title: 'Error',
  blockedUsersList_error_loadFailed:
    'No se pudieron cargar los usuarios bloqueados',
  blockedUsersList_error_unblockFailed: 'No se pudo desbloquear al usuario',
  blockedUsersList_error_networkError: 'Error de conexión. Revisa tu internet',
  blockedUsersList_confirm_unblock_title: 'Confirmar Desbloqueo',
  blockedUsersList_confirm_unblock_message: '¿Desbloquear a',
  blockedUsersList_accessibility_unblock: 'Desbloquear a',
  blockedUsersList_empty_title: 'No hay usuarios bloqueados',
  blockedUsersList_empty_message: 'Cuando bloquees a alguien, aparecerá aquí',
  blockedUsersList_retry: 'Reintentar',

  // Blocked Users Screen
  blockedUsers_title: 'Usuarios Bloqueados',
};

export default es;
