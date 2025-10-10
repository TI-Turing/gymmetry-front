export type Dict = Record<string, string>;

const en: Dict = {
  settings_title: 'Settings',
  appearance: 'Appearance',
  theme: 'Theme',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  reduce_motion: 'Reduce animations',
  preferences: 'Preferences',
  language: 'Language',
  data_saver: 'Data saver',
  image_quality: 'Image quality',
  notifications: 'Notifications',
  enable_notifications: 'Enable notifications',
  training_notifications: 'Training reminders',
  quiet_hours: 'Quiet hours',
  wellness: 'Wellness',
  hydration_reminders: 'Hydration reminders',
  hydration_interval: 'Hydration interval',
  active_breaks: 'Active breaks',
  breaks_interval: 'Breaks interval',
  diagnostics_cache: 'Diagnostics & cache',
  analytics: 'Analytics & telemetry',
  log_level: 'Log level',
  offline_cache: 'Offline cache',
  training: 'Training',
  sound_cues: 'Sound/vibration cues',
  prep_time: 'Prep time between cycles',
  test_hydration: 'Test hydration (5s)',
  test_break: 'Test break (5s)',
  back: 'Back',
  menu_title: 'Menu',
  menu_open: 'Open menu',
  menu_close: 'Close menu',
  routines: 'Routines',
  plans: 'Plans',
  physical_assessment: 'Physical assessment',
  user_exercise_max_short: '1RM',
  settings_label: 'Settings',
  support_contact: 'Contact support',
  report_bug: 'Report a problem or bug',
  logout: 'Log out',
  login_subtitle: 'Sign in to continue',
  username_or_email: 'Username or Email',
  password_label: 'Password',
  show_password: 'Show password',
  hide_password: 'Hide password',
  sign_in: 'Sign in',
  signing_in: 'Signing in...',
  no_account: "Don't have an account?",
  go_register: 'Sign up',
  step_credentials: 'Credentials',
  step_basic: 'Basic data',
  step_personal: 'Personal info',
  step_fitness: 'Fitness data',
  step_profile: 'Profile',
  fill_all_fields: 'Please fill in all fields',
  unknown_error: 'Unknown error',
  connection_error: 'Connection error. Check your internet and try again.',
  incorrect_credentials: 'Incorrect credentials',
  server_error: 'Server error. Try later.',
  get_user_error: 'Failed to get user data',
  welcome: 'Welcome',
  login_success: 'You have signed in successfully.',

  // Navigation/Dashboard
  home: 'Home',
  gym: 'Gym',
  progress: 'Progress',

  // Gym Screen
  loading: 'Loading...',
  loading_gyms: 'Loading gyms...',

  // No Gym View
  connect_gym_title: 'Connect with your Gym! 🏋️‍♂️',
  connect_gym_subtitle: 'Link your account with a gym to start your experience',
  connect_gym_info:
    'Once linked, you will be able to see real-time gym information, schedules, occupancy and much more.',
  scan_qr: 'Scan QR code',
  search_gyms: 'Search gyms',
  register_gym: 'Register gym',
  open_scanner: 'Open Scanner',
  qr_scanner: 'QR Scanner',

  // Gym List
  gyms_title: 'Gyms',
  no_gyms_title: 'No gyms',
  no_gyms_message: 'No registered gyms found',
  gym_no_name: 'Gym without name',

  // Gym Registration Steps
  gym_step_basic_info: 'Basic Information',
  gym_step_type_description: 'Type and Description',
  gym_step_location: 'Location',
  gym_step_digital_presence: 'Digital Presence',
  gym_step_multimedia: 'Multimedia',

  // Common actions
  next: 'Next',
  previous: 'Previous',
  cancel: 'Cancel',
  complete: 'Complete',
  save: 'Save',
  edit: 'Edit',
  delete: 'Delete',
  confirm: 'Confirm',
  accept: 'Accept',
  close: 'Close',
  continue: 'Continue',
  finish: 'Finish',

  // Form labels
  name: 'Name',
  description: 'Description',
  address: 'Address',
  phone: 'Phone',
  email: 'Email',
  website: 'Website',
  type: 'Type',

  // Status/States
  connected: 'Connected',
  disconnected: 'Disconnected',
  active: 'Active',
  inactive: 'Inactive',
  available: 'Available',
  unavailable: 'Unavailable',

  // Gym Step 1
  gym_step1_title: 'Basic Information',
  gym_step1_subtitle: "Let's start with your gym's main data",
  gym_name_label: 'Gym Name *',
  corporate_email_label: 'Corporate Email *',
  main_phone_label: 'Main Phone *',
  nit_label: 'NIT or Tax ID *',
  gym_step1_info:
    'This information will be verified by our team. Make sure it is correct and up to date.',
  loading_registering_gym: 'Registering gym...',
  save_continue: 'Save and Continue',

  // Gym Step 2 - Type and Description
  gym_step2_title: 'Type and Description',
  gym_step2_subtitle:
    'Tell us what type of gym it is and its main characteristics',
  gym_type_label: 'Gym Type *',
  slogan_label: 'Slogan (Optional)',
  gym_description_label: 'Gym Description *',
  selected_type_label: 'Selected type:',
  gym_type_required: 'You must select a gym type',
  gym_description_required: 'Description is required',
  error_loading_gym_types: 'Could not load gym types',
  connection_error_gym_types: 'Connection error loading gym types',
  error_updating_info: 'Error updating information',
  loading_saving: 'Saving...',

  // Gym Step 3 - Location
  gym_step3_title: 'Company Location',
  gym_step3_subtitle:
    'Select the country, region, city where the gym is registered',
  main_office_address_label: 'Main office address*',
  error_loading_countries: 'Could not load countries',
  error_loading_regions: 'Could not load regions',
  error_loading_cities: 'Could not load cities',
  country_required: 'Select a country',
  region_required: 'Select a region',
  city_required: 'Select a city',
  address_required: 'Enter the address',
  error_saving_location: 'Could not save location information',

  // Gym Step 4 - Digital Presence
  gym_step4_title: 'Digital Presence',
  gym_step4_subtitle:
    'Add links to your social networks and website (optional)',
  website_label: 'Website',
  instagram_label: 'Instagram',
  facebook_label: 'Facebook',
  digital_presence_info: 'All fields are optional. You can add them later.',
  invalid_website_url: 'The website URL is not valid',
  invalid_instagram_url: 'The Instagram URL is not valid',
  invalid_facebook_url: 'The Facebook URL is not valid',
  error_saving_digital_presence: 'Could not save digital presence information',

  // Gym Step 5 - Multimedia
  gym_step5_title: 'Multimedia',
  gym_step5_subtitle: 'Add images and videos to showcase your gym (optional)',
  gym_logo_section: 'Gym Logo',
  cover_image_section: 'Cover Image',
  gallery_images_section: 'Image Gallery',
  videos_section: 'Videos',
  select_logo: 'Select Logo',
  select_cover_image: 'Select Cover Image',
  add_gallery_images: 'Add Images',
  add_videos: 'Add Videos',
  logo_selected: 'Logo selected',
  cover_image_selected: 'Cover image selected',
  multimedia_info:
    'All multimedia files are optional. You can add them later from your profile.',
  finish_registration: 'Finish Registration',
  functionality_in_development: 'Functionality in development',
  logo_selection_development: 'Logo selection in development',
  cover_image_selection_development: 'Cover image selection in development',
  gallery_images_development: 'Adding gallery images in development',
  videos_development: 'Adding videos in development',
  error_saving_multimedia: 'Could not save multimedia information',

  // Gym Type Dropdown
  select_option: 'Select',
  dropdown_hint: 'Press to open the gym type list',
  select_gym_type_modal_title: 'Select gym type',
  no_options_available: 'No options available',

  // Gym Options
  scan_qr_title: 'Scan QR Code',
  scan_qr_subtitle: 'Scan the QR code available at your gym',
  search_gyms_title: 'Search Gyms',
  search_gyms_subtitle: 'Find gyms near your location',
  register_gym_title: 'Are you a gym owner?',
  register_gym_subtitle: 'Register your gym here and connect with more users',
  registering: 'Registering...',

  // Validation messages
  gym_name_required: 'Gym name is required',
  email_required: 'Email is required',
  email_invalid: 'Email is not valid',
  phone_required: 'Phone is required',
  nit_required: 'NIT is required',
  complete_required_fields: 'Please complete all required fields',
  registration_error: 'Error registering gym',
  connection_error_retry: 'Connection error. Try again.',

  // Routine Templates
  routine_templates_title: 'Routine Templates',
  routine_template_detail: 'RoutineTemplate - Detail',
  detail_query_id: 'Query by Id not available',
  detail_query_error: 'Error querying',
  query_button: 'Query',
  active_routine: 'Active Routine',
  no_active_routine: 'No active routine',
  available_routines: 'Available Routines',
  assign_routine: 'Assign Routine',
  routine_assigned_success: 'Routine assigned successfully',
  routine_assignment_error: 'Error assigning routine',
  start_routine: 'Start Routine',
  continue_routine: 'Continue Routine',
  view_details: 'View Details',
  assign_comment_label: 'Comment (optional)',
  assign_comment_placeholder: 'Add a comment about this assignment...',
  assigning_routine: 'Assigning routine...',

  // Routine Filters
  filters: 'Filters',
  filter_options: 'Filter Options',
  equipment_required: 'Equipment Required',
  calisthenics: 'Calisthenics',
  objectives: 'Objectives',
  clear_filters: 'Clear Filters',
  apply_filters: 'Apply Filters',
  active_filters: 'active filters',
  filter_intensity_low: 'Low',
  filter_intensity_medium: 'Medium',
  filter_intensity_high: 'High',
  total_results: 'results',

  // Routine Objectives
  objective_weight_loss: 'Weight Loss',
  objective_muscle_mass: 'Muscle Mass',
  objective_muscle_definition: 'Muscle Definition',
  objective_strength: 'Strength',
  objective_endurance: 'Physical Endurance',
  objective_toning: 'Toning',
  objective_mobility: 'Mobility',
  objective_posture: 'Posture',
  objective_rehabilitation: 'Rehabilitation',
  objective_cardiovascular: 'Cardiovascular Health',
  objective_stress_relief: 'Stress Relief',
  objective_energy: 'Energy',
  objective_sleep: 'Sleep',
  objective_elderly: 'Elderly',
  objective_chronic_diseases: 'Chronic Diseases',
  objective_functional_training: 'Functional Training',
  objective_specific_sports: 'Specific Sports',
  objective_physical_tests: 'Physical Tests',
  objective_hiit: 'HIIT',

  // Exercise Modal
  exercise_details: 'Exercise Details',
  sets_and_reps: 'Sets and Reps',
  completed_sets: 'Completed Sets',
  set_number: 'Set',
  rest_time: 'Rest Time',
  next_set: 'Next Set',
  finish_exercise: 'Finish Exercise',
  mark_set_complete: 'Mark Set as Complete',
  undo_set: 'Undo Set',
  exercise_completed: 'Exercise Completed',
  congratulations: 'Congratulations!',
  motivational_phrase: 'Motivational Phrase',
  continue_routine_exercise: 'Continue Routine',
  exercise_instructions: 'Exercise Instructions',
  exercise_tips: 'Exercise Tips',
  weight_used: 'Weight Used',
  reps_completed: 'Reps Completed',
  notes: 'Notes',
  save_progress: 'Save Progress',
  exercise_timer: 'Exercise Timer',
  start_timer: 'Start Timer',
  pause_timer: 'Pause Timer',
  reset_timer: 'Reset Timer',
  timer_finished: 'Time Complete',
  time_remaining: 'Time Remaining',

  // Exercise States
  preparing: 'PREPARING',
  exercising: 'EXERCISING',
  resting: 'RESTING',
  get_ready: 'GET READY!',
  start_now: 'START NOW!',
  rest_now: 'REST NOW!',
  next_exercise: 'Next Exercise',
  routine_complete: 'Routine Complete',

  // Exercise Progress
  progress_saved: 'Progress saved',
  progress_error: 'Error saving progress',
  loading_exercise: 'Loading exercise...',
  exercise_not_found: 'Exercise not found',
  invalid_exercise_data: 'Invalid exercise data',

  // Additional Routine Messages
  user_not_authenticated: 'User not authenticated',
  loading_routines_error: 'Error loading routines',
  no_active_routines: 'No active routines at this time.',
  available_routines_in_plan: 'Available Routines in your active plan',
  no_routines_match_filters: 'No routines match the selected filters.',
  no_routines_available: 'No routines available.',
  premium: 'Premium',
  free: 'Free',
  set_as_routine: 'Set as my routine',
  set_routine: 'Set Routine',
  add_comment_placeholder: 'Add a comment...',
  set_as_routine_button: 'Set as routine',
  create_new_routine: 'Create new routine',
  routine_plans: 'Plans',
  routine_settings: 'Settings',
  routine_logout: 'Logout',

  // Additional System Terms
  of: 'of',
  routine: 'routine',
  assign_routine_error: 'Error assigning routine',
  open_filters: 'Open filters',
  comment_optional: 'Comment (optional)',

  // Routine Filters
  routine_filters: 'Routine Filters',
  found: 'found',
  clear: 'Clear',
  characteristics: 'Characteristics',
  objectives_and_characteristics: 'Objectives and Characteristics',
  select_focus_level: 'Select the focus level for each objective',
  all: 'All',
  yes: 'Yes',
  no: 'No',

  // Intensity Levels
  bajo: 'Low',
  medio: 'Medium',
  alto: 'High',

  // Exercise Modal
  complete_exercise: 'Complete Exercise',
  undo_set_exercise: 'Undo Set',
  prepare: 'GET READY',
  timer_active: 'ACTIVE',
  rest: 'REST',
  stopped: 'Stopped',
  restart_timer: 'Restart timer',
  start_set: 'Start {ordinal} set',
  stop: 'Stop',
  finish_set: 'Finish Set',

  // Timer phrases
  timer_on: 'ACTIVE',
  timer_off: 'REST',
  timer_prep: 'GET READY',
  timer_stopped: 'Stopped',

  // Exercise Info
  sets: 'Sets',
  reps: 'Reps',

  // Reps Prompt Modal
  repetitions_completed: 'Repetitions completed',
  set_of: 'Set {current} of {total}',
  reps_placeholder: 'e.g. 8',
  skip: 'Skip',
  save_reps: 'Save',

  // Exercise Categories
  warmup: 'Warm-up',
  main_workout: 'Main Workout',
  cooldown: 'Cool-down',
  cardio: 'Cardio',
  compound_exercise: 'Main Exercise (Compound)',
  functional: 'Functional',
  isolated_focused: 'Isolated (Focused)',
  stretching: 'Stretching',
  other: 'Other',

  // Routine Day Screen
  todays_routine: "Today's Routine",
  view_summary: 'View Summary',
  share: 'Share',
  explore_routines: 'Explore Routines',
  mark_all_and_finish: 'Mark All and Finish',
  finish_with_current_progress: 'Finish with Current Progress',
  restart_progress: 'Restart Progress',
  finish_routine: 'Finish Routine',
  restart: 'Restart',
  reps_label: 'Reps:',
  resume_routine_notification_title: 'Resume your routine?',
  resume_routine_notification_body:
    'You have a routine in progress. When you can, get back to it.',

  // Days of the week
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',

  // General terms
  today: 'Today',

  // Confirmation messages
  restart_progress_message:
    'You will lose the progress recorded in all exercises. Do you want to continue?',

  // Alerts
  day_in_progress_title: 'Day in Progress',
  day_in_progress_message:
    'You already started exercises for {fromDay}. You must cancel that progress to continue with {toDay}.',

  // Completion messages
  training_completed: 'Training Completed!',
  great_job_subtitle:
    'Great job, keep up the consistency. Make a difference every day.',
  routine_finished_partial: 'Routine finished ({progress}% progress)',
  good_effort_subtitle:
    "Good effort even though you didn't finish everything. Consistency is built day by day.",
  how_to_finish_title: 'How do you prefer to finish this routine?',
  how_to_finish_subtitle:
    'You can close with your current progress or mark everything as completed.',

  // Info modal
  no_description: 'No description.',
  minimum_progress_required: 'You need at least 30% progress for this option.',

  // Routine Assigned Card
  assigned_routine: 'Assigned Routine',
  assigned_on: 'Assigned on',
  status_label: 'Status:',
  active_status: 'Active',
  inactive_status: 'Inactive',
  premium_badge: 'Premium',
  free_badge: 'Free',
  tap_to_view_routine: "Tap to view today's routine",
  view_todays_routine: "View today's routine",

  // Feed
  feed: 'Feed',
  toggle_anonymous_mode: 'Toggle anonymous mode',
  training_now: 'Training now',
  user: 'User',
  no_more_posts: 'No more posts',
  anonymous_notice_message:
    'You are interacting as Anonymous. Your name will not be visible to other users.',
  anonymous_notice_support_visible:
    'Gymmetry support can still see your identity. You must follow our community rules.',
  view_behavior_rules: 'View behavior rules',
  community_rules_title: 'Community Rules',
  rule_respect:
    'Respect others. Do not use offensive or discriminatory language.',
  rule_no_harassment: 'No harassment, threats, or intimidation.',
  rule_no_spam: 'Avoid spam, unsolicited ads, or repetitive content.',
  rule_no_illegal:
    'Do not post illegal content or infringe third-party rights.',
  rule_privacy: 'Do not share private information without consent.',
  rule_false_info: 'Do not spread false or misleading information.',
  rule_report_abuse:
    'Report abuse; the team may take actions including suspension.',

  // Progress Dashboard
  progress_dashboard_login_required: 'You must log in to view your progress',
  progress_dashboard_no_data: 'No progress data available.',
  progress_dashboard_error_rendering: 'Error displaying progress dashboard',
  progress_dashboard_retry: 'Retry',
  progress_dashboard_no_muscle_data: 'No muscle data available',
  progress_dashboard_period_label: 'Period:',
  progress_dashboard_last_month: 'Last month',
  progress_dashboard_last_3_months: 'Last 3 months',
  progress_dashboard_last_6_months: 'Last 6 months',
  progress_dashboard_last_year: 'Last year',
  progress_dashboard_last_2_years: 'Last 2 years',
  progress_dashboard_custom: 'Custom',
  progress_dashboard_select_period: 'Select Period',
  progress_dashboard_custom_period: 'Custom Period',
  progress_dashboard_start_date: 'Start date:',
  progress_dashboard_end_date: 'End date:',
  progress_dashboard_cancel: 'Cancel',
  progress_dashboard_apply: 'Apply',

  // Detailed progress modal
  'progress_modal.total_progress': 'Total progress',
  'progress_modal.completed_days_suffix': 'days completed',
  'progress_modal.attended_days': 'Attended days',
  'progress_modal.attended_days_helper': 'Sessions marked attended',
  'progress_modal.longest_streak': 'Longest streak',
  'progress_modal.longest_streak_helper': 'Consecutive completed days',
  'progress_modal.average_progress': 'Average completion',
  'progress_modal.average_progress_helper': 'Average percentage per day',
  'progress_modal.consistency_rate': 'Consistency rate',
  'progress_modal.consistency_rate_helper': 'completed days out of active days',
  'progress_modal.best_day': 'Best day',
  'progress_modal.best_day_helper': 'Day with highest progress',
  'progress_modal.rest_days': 'Rest days',
  'progress_modal.rest_days_helper': 'Days without activity',
  'progress_modal.share_dialog_title': 'Share progress',
  'progress_modal.month_label': 'Monthly',
  'progress_modal.plan_label': 'Plan',
  'progress_modal.no_data_title': 'No discipline data yet',
  'progress_modal.no_data_helper': 'Complete routines to see your progress.',
  'progress_modal.share_button': 'Share progress',
  'progress_modal.loading_error_title': 'Error loading data',
  'progress_modal.capture_unavailable_title': 'Capture unavailable',
  'progress_modal.capture_unavailable_body':
    'Make sure the content is visible before sharing.',
  'progress_modal.sharing_not_supported_title': 'Sharing not available',
  'progress_modal.sharing_not_supported_body':
    'This device does not allow sharing images from the app.',
  'progress_modal.share_error_title': 'Share error',
  'progress_modal.share_error_body':
    'We could not share your progress. Please try again.',
  'progress_modal.preparing_capture': 'Preparing capture...',
  'progress_modal.watermark': 'Gymmetry',

  // Physical Measures
  progress_dashboard_recent_measures: 'Recent physical measurements',
  progress_dashboard_height: 'Height',
  progress_dashboard_weight: 'Weight',
  progress_dashboard_body_fat: '% Fat',
  progress_dashboard_waist: 'Waist',
  progress_dashboard_hip: 'Hip',
  progress_dashboard_chest: 'Chest',
  progress_dashboard_arm: 'Arm',
  progress_dashboard_leg: 'Leg',
  progress_dashboard_see_more: 'See more',
  progress_dashboard_see_less: 'See less',
  progress_dashboard_see_history: 'See history',

  // Summary Section
  progress_dashboard_period_summary: '📊 Period Summary',
  progress_dashboard_adherence: 'Adherence',
  progress_dashboard_current_streak: 'Current Streak',
  progress_dashboard_sessions: 'Sessions',
  progress_dashboard_exercises: 'Exercises',
  progress_dashboard_weekly_progress: 'Weekly progress',
  progress_dashboard_days: 'days',

  // Muscle Distribution
  progress_dashboard_muscle_distribution: '💪 Muscle Distribution',
  progress_dashboard_dominant_groups: 'Dominant groups:',

  // Featured Exercises
  progress_dashboard_featured_exercises: '🏋️‍♂️ Featured Exercises',
  progress_dashboard_most_practiced: 'Most practiced:',
  progress_dashboard_total_series: 'Total series',
  progress_dashboard_repetitions: 'Repetitions',
  progress_dashboard_total_minutes: 'Total minutes',

  // Objectives
  progress_dashboard_objectives: '🎯 Objectives',

  // Suggestions
  progress_dashboard_suggestions: '💡 Suggestions',
  progress_dashboard_suggestion: 'Suggestion',

  // Personal Records
  progress_dashboard_personal_records: '🏆 Personal Records',
  progress_dashboard_no_personal_records:
    'No personal records registered in this period.',

  // Discipline
  progress_dashboard_discipline: '⏰ Discipline',
  progress_dashboard_consistency: 'Consistency',
  progress_dashboard_common_hour: 'Common hour',
  progress_dashboard_regularity: 'Regularity',

  // Progress Tabs
  progress_tabs_login_required: 'You must log in to view your progress',
  progress_tabs_loading: 'Loading progress...',
  progress_tabs_error: 'Error:',
  progress_tabs_no_data: 'No progress data available for this period',
  progress_tabs_summary: 'Summary',
  progress_tabs_exercises: 'Exercises',
  progress_tabs_objectives: 'Objectives',
  progress_tabs_muscles: 'Muscles',
  progress_tabs_discipline: 'Discipline',
  progress_tabs_suggestions: 'Suggestions',

  // Block System
  blockButton_block: 'Block',
  blockButton_unblock: 'Unblock',
  blockButton_success_blocked_title: 'User Blocked',
  blockButton_success_blocked_message:
    'You have successfully blocked this user',
  blockButton_success_unblocked_title: 'User Unblocked',
  blockButton_success_unblocked_message:
    'You have successfully unblocked this user',
  blockButton_error_title: 'Block Error',
  blockButton_error_defaultMessage:
    'An error occurred while processing the action',
  blockButton_error_networkError:
    'Connection error. Check your internet and try again',
  blockButton_confirm_block_title: 'Confirm Block',
  blockButton_confirm_block_message:
    'Are you sure you want to block this user?',
  blockButton_confirm_unblock_title: 'Confirm Unblock',
  blockButton_confirm_unblock_message:
    'Are you sure you want to unblock this user?',
  blockButton_accessibility_block: 'Block user',
  blockButton_accessibility_unblock: 'Unblock user',
  blockButton_accessibility_blockHint: 'Block this user to hide their content',
  blockButton_accessibility_unblockHint:
    'Unblock this user to see their content again',
  blockButton_remaining: 'Remaining',

  // Report System
  reportModal_title: 'Report Content',
  reportModal_submit: 'Submit',
  reportModal_contentPreview: 'Content Preview',
  reportModal_reasonTitle: 'Report Reason',
  reportModal_reasonDescription: 'Select the reason for reporting this content',
  reportModal_descriptionTitle: 'Detailed Description',
  reportModal_descriptionDescription:
    'Provide additional details about why you are reporting this content',
  reportModal_descriptionPlaceholder:
    'Describe why this content violates community guidelines...',
  reportModal_priorityTitle: 'Priority',
  reportModal_priorityDescription: 'Select the urgency level for this report',
  reportModal_priority_low: 'Low',
  reportModal_priority_medium: 'Medium',
  reportModal_priority_high: 'High',
  reportModal_guidelinesTitle: 'Community Guidelines',
  reportModal_guidelinesText:
    'Please only report content that violates our community guidelines. False reports may result in restrictions on your account.',
  reportModal_validation_title: 'Validation Required',
  reportModal_validation_reasonRequired:
    'Please select a reason for the report',
  reportModal_validation_descriptionTooShort:
    'Description must be at least 10 characters',
  reportModal_validation_descriptionTooLong:
    'Description cannot exceed 500 characters',
  reportModal_success_title: 'Report Submitted',
  reportModal_success_message:
    'Your report has been submitted and will be reviewed by our moderation team',
  reportModal_error_title: 'Error Submitting',
  reportModal_error_defaultMessage:
    'An error occurred while submitting the report',
  reportModal_error_networkError:
    'Connection error. Check your internet and try again',
  reportModal_rateLimit_title: 'Report Limit',
  reportModal_rateLimit_message:
    'You have reached the daily report limit. Try again tomorrow.',
  reportModal_rateLimit_warning: 'Reports remaining today:',
  reportModal_rateLimit_reached: 'Daily report limit reached',

  // Admin Settings
  admin_settings: 'ADMIN SETTINGS',

  // Ad Configuration
  advertising: 'Advertising',
  ad_frequency: 'Ad Frequency',
  ad_frequency_description: 'How many posts between each ad in the feed',
  posts_per_ad: 'Posts per ad',
  ad_ratio: 'Ad Distribution',
  ad_ratio_description: 'Percentage of AdMob ads vs own ads',
  admob_percentage: 'AdMob Percentage',
  own_ads_percentage: 'Own',
  save_ad_config: 'Save Configuration',
  saving: 'Saving...',
  ad_config_saved: 'Configuration saved successfully',
  ad_config_error: 'Error saving configuration',
  ad_config_validation_error: 'Invalid values. PostsPerAd must be between 3 and 10, and AdMobPercentage between 0 and 100',
  ad_config_current: 'Current configuration',
  ad_config_loading: 'Loading configuration...',
};

export default en;
