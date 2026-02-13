export interface StudentDTO {
  id?: number;
  username: string;
  password?: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department: string;
  yearOfStudy?: number;
  semester?: number;
  idCardNumber?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffDTO {
  id?: number;
  username: string;
  password?: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  designation: string;
  staffType: 'TEACHER' | 'WARDEN' | 'ADMINISTRATIVE';
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncidentDTO {
  id?: number;
  studentId: number;
  studentName?: string;
  studentRollNumber?: string;
  loggedById: number;
  loggedByName?: string;
  incidentType: 'LATE_ARRIVAL' | 'MISCONDUCT' | 'ABSENCE' | 'VIOLATION' | 'WARNING' | 'OTHER';
  description?: string;
  location?: string;
  incidentDate: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionTaken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementDTO {
  id?: number;
  studentId: number;
  studentName?: string;
  studentRollNumber?: string;
  title: string;
  description?: string;
  achievementType: 'ACADEMIC' | 'SPORTS' | 'CULTURAL' | 'LEADERSHIP' | 'SERVICE' | 'OTHER';
  dateAchieved: string;
  awardedBy?: string;
  certificateUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuickIncidentRequest {
  studentIdentifier: string;
  incidentType: 'LATE_ARRIVAL' | 'MISCONDUCT' | 'ABSENCE' | 'VIOLATION' | 'WARNING' | 'OTHER';
  description?: string;
  location?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AuthRequest {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageStudentDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: StudentDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export interface PageStaffDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: StaffDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export interface PageIncidentDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: IncidentDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export interface PageAchievementDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: AchievementDTO[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  pageSize: number;
  paged: boolean;
  pageNumber: number;
  unpaged: boolean;
}

export interface SortObject {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface User {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
}
