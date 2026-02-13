import { apiClient } from './index';
import { StudentDTO, PageStudentDTO, Pageable } from '../types';

export const studentsApi = {
  getAll: (): Promise<StudentDTO[]> => {
    return apiClient.get<StudentDTO[]>('/api/students');
  },

  getPaged: (pageable: Pageable): Promise<PageStudentDTO> => {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(sort => params.append('sort', sort));
    }
    return apiClient.get<PageStudentDTO>(`/api/students/paged?${params}`);
  },

  getById: (id: number): Promise<StudentDTO> => {
    return apiClient.get<StudentDTO>(`/api/students/${id}`);
  },

  getByIdentifier: (identifier: string): Promise<StudentDTO> => {
    return apiClient.get<StudentDTO>(`/api/students/identifier/${identifier}`);
  },

  searchByName: (name: string): Promise<StudentDTO[]> => {
    return apiClient.get<StudentDTO[]>(`/api/students/search/${name}`);
  },

  getByDepartment: (department: string): Promise<StudentDTO[]> => {
    return apiClient.get<StudentDTO[]>(`/api/students/department/${department}`);
  },

  create: (student: StudentDTO): Promise<StudentDTO> => {
    return apiClient.post<StudentDTO>('/api/students', student);
  },

  update: (id: number, student: StudentDTO): Promise<StudentDTO> => {
    return apiClient.put<StudentDTO>(`/api/students/${id}`, student);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/students/${id}`);
  },

  activate: (id: number): Promise<StudentDTO> => {
    return apiClient.put<StudentDTO>(`/api/students/${id}/activate`);
  },

  deactivate: (id: number): Promise<StudentDTO> => {
    return apiClient.put<StudentDTO>(`/api/students/${id}/deactivate`);
  },
};
