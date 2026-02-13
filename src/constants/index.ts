export const API_BASE_URL = 'http://localhost:8080';

export const SCREEN_NAMES = {
  LOGIN: 'Login',
  MAIN: 'Main',
  DASHBOARD: 'Dashboard',
  INCIDENTS: 'Incidents',
  INCIDENT_DETAILS: 'IncidentDetails',
  CREATE_INCIDENT: 'CreateIncident',
  QUICK_INCIDENT: 'QuickIncident',
  STUDENTS: 'Students',
  STUDENT_DETAILS: 'StudentDetails',
  ACHIEVEMENTS: 'Achievements',
  ACHIEVEMENT_DETAILS: 'AchievementDetails',
  CREATE_ACHIEVEMENT: 'CreateAchievement',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  ANALYTICS: 'Analytics',
};

export const INCIDENT_TYPES = [
  { label: 'Late Arrival', value: 'LATE_ARRIVAL' },
  { label: 'Misconduct', value: 'MISCONDUCT' },
  { label: 'Absence', value: 'ABSENCE' },
  { label: 'Violation', value: 'VIOLATION' },
  { label: 'Warning', value: 'WARNING' },
  { label: 'Other', value: 'OTHER' },
];

export const SEVERITY_LEVELS = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
];

export const ACHIEVEMENT_TYPES = [
  { label: 'Academic', value: 'ACADEMIC' },
  { label: 'Sports', value: 'SPORTS' },
  { label: 'Cultural', value: 'CULTURAL' },
  { label: 'Leadership', value: 'LEADERSHIP' },
  { label: 'Service', value: 'SERVICE' },
  { label: 'Other', value: 'OTHER' },
];

export const STAFF_TYPES = [
  { label: 'Teacher', value: 'TEACHER' },
  { label: 'Warden', value: 'WARDEN' },
  { label: 'Administrative', value: 'ADMINISTRATIVE' },
];

export const COLORS = {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#FF4081',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

export const THEME = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    disabled: COLORS.textSecondary,
    placeholder: COLORS.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: COLORS.error,
    error: COLORS.error,
    warning: COLORS.warning,
    success: COLORS.success,
    border: COLORS.border,
  },
  roundness: 8,
};
