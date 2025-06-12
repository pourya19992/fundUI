import { createBaseService } from '../baseService';
import { ref } from 'vue';

export interface Calendar {
id: number;
calendarDate: string;
isOff: boolean;
isVacation: boolean;
}

export type CalendarDto = Omit<Calendar, 'id'>;

const API_URL = '/api/v1/administration/calendar';

export const createCalendarService = (baseURL: string) => {
const { apiClient, handleError } = createBaseService(baseURL);

const form = ref<CalendarDto>({
    calendarDate: '',
    isOff: false,
    isVacation: false,
});

return {
    async getCalendarList(): Promise<Calendar[]> {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar list:', error);
        throw handleError(error);
    }
    },

    async getCalendar(id: number): Promise<Calendar> {
    try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching calendar:', error);
        throw handleError(error);
    }
    },

    async addCalendar(calendar: CalendarDto): Promise<Calendar> {
    try {
        const response = await apiClient.post(API_URL, calendar);
        return response.data;
    } catch (error) {
        console.error('Error adding calendar:', error);
        throw handleError(error);
    }
    },

    async updateCalendar(calendar: Calendar): Promise<Calendar> {
    try {
        const response = await apiClient.put(`${API_URL}/${calendar.id}`, calendar);
        return response.data;
    } catch (error) {
        console.error('Error updating calendar:', error);
        throw handleError(error);
    }
    },

    async deleteCalendar(id: number): Promise<void> {
    try {
        await apiClient.delete(`${API_URL}/remove/${id}`);
    } catch (error) {
        console.error('Error deleting calendar:', error);
        throw handleError(error);
    }
    },
};
};
