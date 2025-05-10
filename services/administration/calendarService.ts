import { createBaseService } from '../baseService';

export interface Calendar {
id: number;
calendarDate: string;
isOff: boolean;
isVacation: boolean;
}

export type CalendarDto = Omit<Calendar, 'id'>;

export const createCalendarService = (baseURL: string) => {
const { apiClient, handleError } = createBaseService(baseURL);

return {
    async getCalendarList(id?: number): Promise<Calendar[]> {
    try {
        const response = await apiClient.get(`/api/v1/administration/calendar`);
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar list:', error);
        throw handleError(error);
    }
    },

    async getCalendar(id: number): Promise<Calendar> {
    try {
        const response = await apiClient.get(`/api/v1/administration/calendar/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar:', error);
        throw handleError(error);
    }
    },

    async addCalendar(calendar: CalendarDto): Promise<Calendar> {
    try {
        const response = await apiClient.post('/api/v1/administration/calendar', calendar);
        return response.data;
    } catch (error) {
        console.error('Error adding calendar:', error);
        throw handleError(error);
    }
    },

    async updateCalendar(calendar: Calendar): Promise<Calendar> {
    try {
        const response = await apiClient.put(`/api/v1/administration/calendar/${calendar.id}`, calendar);
        return response.data;
    } catch (error) {
        console.error('Error updating calendar:', error);
        throw handleError(error);
    }
    },

    async deleteCalendar(id: number): Promise<void> {
    try {
        await apiClient.delete(`/api/v1/administration/calendar/${id}`);
    } catch (error) {
        console.error('Error deleting calendar:', error);
        throw handleError(error);
    }
    }
};
};
