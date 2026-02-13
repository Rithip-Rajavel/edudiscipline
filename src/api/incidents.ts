import { apiClient } from './index';
import { IncidentDTO, PageIncidentDTO, QuickIncidentRequest, Pageable } from '../types';

export const incidentsApi = {
  getAll: (): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>('/api/incidents');
  },

  getById: (id: number): Promise<IncidentDTO> => {
    return apiClient.get<IncidentDTO>(`/api/incidents/${id}`);
  },

  create: (incident: IncidentDTO): Promise<IncidentDTO> => {
    return apiClient.post<IncidentDTO>('/api/incidents', incident);
  },

  createQuick: (quickIncident: QuickIncidentRequest): Promise<IncidentDTO> => {
    return apiClient.post<IncidentDTO>('/api/incidents/quick', quickIncident);
  },

  update: (id: number, incident: IncidentDTO): Promise<IncidentDTO> => {
    return apiClient.put<IncidentDTO>(`/api/incidents/${id}`, incident);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/incidents/${id}`);
  },

  getByStudent: (studentId: number): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/student/${studentId}`);
  },

  getByStudentPaged: (studentId: number, pageable: Pageable): Promise<PageIncidentDTO> => {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(sort => params.append('sort', sort));
    }
    return apiClient.get<PageIncidentDTO>(`/api/incidents/student/${studentId}/paged?${params}`);
  },

  getStudentIncidentsByDateRange: (studentId: number, startDate: string, endDate: string): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/student/${studentId}/daterange?startDate=${startDate}&endDate=${endDate}`);
  },

  getStudentStatistics: (studentId: number): Promise<any> => {
    return apiClient.get<any>(`/api/incidents/student/${studentId}/statistics`);
  },

  getByStaff: (staffId: number): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/staff/${staffId}`);
  },

  getByType: (incidentType: string): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/type/${incidentType}`);
  },

  getBySeverity: (severity: string): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/severity/${severity}`);
  },

  getByDateRange: (startDate: string, endDate: string): Promise<IncidentDTO[]> => {
    return apiClient.get<IncidentDTO[]>(`/api/incidents/daterange?startDate=${startDate}&endDate=${endDate}`);
  },
};
