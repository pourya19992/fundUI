import axios from 'axios';

export interface DetailLedger {
  id: number;
  name: string;
  code: string;
  detailLedgerType: {
    id: number;
    name: string;
    accountNature: {
      id: number;
      natureAccountName: string;
    };
  };
  isActive: boolean;
}

export interface DetailLedgerDto {
  id?: number;
  name: string;
  code: string;
  detailLedgerTypeId: number;
  isActive: boolean;
}

export const createDetailLedgerService = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-TenantId': '90001'
    }
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    async getDetailLedgerList(ledgerId?: number): Promise<DetailLedger[]> {
      try {
        const url = ledgerId 
          ? `/api/v1/accounting/detailLedger/${ledgerId}`
          : '/api/v1/accounting/detailLedger';
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async addDetailLedger(ledger: DetailLedgerDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/accounting/detailLedger/add', ledger);
      } catch (error) {
        throw error;
      }
    },

    async updateDetailLedger(ledger: DetailLedgerDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/accounting/detailLedger/edit', ledger);
      } catch (error) {
        throw error;
      }
    },

    async deleteDetailLedger(ledgerId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/accounting/detailLedger/remove/${ledgerId}`);
      } catch (error) {
        throw error;
      }
    }
  };
}; 