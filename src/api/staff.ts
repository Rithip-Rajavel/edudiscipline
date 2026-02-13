import { apiClient } from './index';
import { StaffDTO, PageStaffDTO, Pageable } from '../types';

export const staffApi = {
  getAll: (): Promise<StaffDTO[]> => {
    return apiClient.get<StaffDTO[]>('/api/staff');
  },

  getPaged: (pageable: Pageable): Promise<PageStaffDTO> => {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(sort => params.append('sort', sort));
    }
    return apiClient.get<PageStaffDTO>(`/api/staff/paged?${params}`);
  },

  getById: (id: number): Promise<StaffDTO> => {
    return apiClient.get<StaffDTO>(`/api/staff/${id}`);
  },

  getByIdentifier: (identifier: string): Promise<StaffDTO> => {
    return apiClient.get<StaffDTO>(`/api/staff/identifier/${identifier}`);
  },

  searchByName: (name: string): Promise<StaffDTO[]> => {
    return apiClient.get<StaffDTO[]>(`/api/staff/search/${name}`);
  },

  getByDepartment: (department: string): Promise<StaffDTO[]> => {
    return apiClient.get<StaffDTO[]>(`/api/staff/department/${department}`);
  },

  getByType: (staffType: string): Promise<StaffDTO[]> => {
    return apiClient.get<StaffDTO[]>(`/api/staff/type/${staffType}`);
  },

  create: (staff: StaffDTO): Promise<StaffDTO> => {
    return apiClient.post<StaffDTO>('/api/staff', staff);
  },

  update: (id: number, staff: StaffDTO): Promise<StaffDTO> => {
    return apiClient.put<StaffDTO>(`/api/staff/${id}`, staff);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/staff/${id}`);
  },

  activate: (id: number): Promise<StaffDTO> => {
    return apiClient.put<StaffDTO>(`/api/staff/${id}/activate`);
  },

  deactivate: (id: number): Promise<StaffDTO> => {
    return apiClient.put<StaffDTO>(`/api/staff/${id}/deactivate`);
  },
};
