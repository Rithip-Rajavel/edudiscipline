import { apiClient } from './index';
import { AchievementDTO, PageAchievementDTO, Pageable } from '../types';

export const achievementsApi = {
  getAll: (): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>('/api/achievements');
  },

  getById: (id: number): Promise<AchievementDTO> => {
    return apiClient.get<AchievementDTO>(`/api/achievements/${id}`);
  },

  create: (achievement: AchievementDTO): Promise<AchievementDTO> => {
    return apiClient.post<AchievementDTO>('/api/achievements', achievement);
  },

  update: (id: number, achievement: AchievementDTO): Promise<AchievementDTO> => {
    return apiClient.put<AchievementDTO>(`/api/achievements/${id}`, achievement);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/achievements/${id}`);
  },

  getByStudent: (studentId: number): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>(`/api/achievements/student/${studentId}`);
  },

  getByStudentPaged: (studentId: number, pageable: Pageable): Promise<PageAchievementDTO> => {
    const params = new URLSearchParams();
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(sort => params.append('sort', sort));
    }
    return apiClient.get<PageAchievementDTO>(`/api/achievements/student/${studentId}/paged?${params}`);
  },

  getStudentAchievementsByDateRange: (studentId: number, startDate: string, endDate: string): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>(`/api/achievements/student/${studentId}/daterange?startDate=${startDate}&endDate=${endDate}`);
  },

  getStudentStatistics: (studentId: number): Promise<any> => {
    return apiClient.get<any>(`/api/achievements/student/${studentId}/statistics`);
  },

  getByType: (achievementType: string): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>(`/api/achievements/type/${achievementType}`);
  },

  searchByTitle: (title: string): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>(`/api/achievements/search/${title}`);
  },

  getByDateRange: (startDate: string, endDate: string): Promise<AchievementDTO[]> => {
    return apiClient.get<AchievementDTO[]>(`/api/achievements/daterange?startDate=${startDate}&endDate=${endDate}`);
  },
};
