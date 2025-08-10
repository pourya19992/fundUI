import { createBaseService } from '../baseService';
import type { ApiResponse } from '../baseService';
import { type DetailLedger } from '@/services/accounting/detailLedgerService';
import {type Fund} from "@/services/administration/fundService";

const API_URL = '/api/v1/administration/param';

export interface Params {
    id?: number;
    name: string;
    code: string;
    value: string,
    dataQuery: string,
    isActive: boolean,
    isEditable: boolean,
    paramsType?: ParamsType,
    fund?: Fund ,
    detailLedger?: DetailLedger,
    subsidiaryLedger?: SubsidiaryLedger,
    paramsValueType?:ParamsValueType ,
    isGlobal: boolean
}

export interface ParamsValueType {
    id: number,
    name: string
}

export interface ParamsType {
  id: number,
  name: string
}

export interface SubsidiaryLedger {
  id: number,
  name: string,
  code: string,
  isActive: boolean
}

export interface ParamsDto {
  id?: number;
  name: string;
  code: string;
  value: string,
  dataQuery: string,
  isActive: boolean,
  isEditable: boolean,
  paramsTypeId: number,
  fundId: number,
  detailLedgerId: number,
  subsidiaryLedgerId: number,
  paramsValueTypeId: number,
  isGlobal: boolean
}

export const createParamService = (baseURL: string) => {

const { apiClient, handleError } = createBaseService(baseURL);

return {
    async getListParams(): Promise<Params[]> {
        try {
            const response = await apiClient.get(`${API_URL}/listParam`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    async getListParamsByFundId(fundId: number): Promise<Params[]> {
        try {
            const response = await apiClient.get(`${API_URL}/listParam/${fundId}`);
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    async addParams(param: ParamsDto): Promise<ApiResponse>{
      try {
        const response = await apiClient.post(API_URL, param);
        return {
        message: response.data.message || 'پارامتر با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async editParam(fundId: number, code: string, value: string): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/edit`, null, {
          params: {
            fundId,
            code,
            value
          }
        });
        return {
          message: response.data.message || 'پارامتر با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async getSubsidiaryLedger(code: string, fundId: number): Promise<SubsidiaryLedger> {
      try {
        const response = await apiClient.get(`${API_URL}/getSubsidiaryLedger`, {
          params: {
            code,
            fundId
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getStringValue(code: string, fundId: number, effectiveDate: string): Promise<string> {
      try {
        const response = await apiClient.get(`${API_URL}/getStringValue`, {
          params: {
            code,
            fundId,
            effectiveDate
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getParamById(id: number): Promise<Params> {
      try {
        const response = await apiClient.get(`${API_URL}/getParamById/${id}`);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getLongValue(code: string, fundId: number, effectiveDate: string): Promise<number> {
      try {
        const response = await apiClient.get(`${API_URL}/getLongValue`, {
          params: {
            code,
            fundId,
            effectiveDate
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getFloatValue(code: string, fundId: number, effectiveDate: string): Promise<number> {
      try {
        const response = await apiClient.get(`${API_URL}/getFloatValue`, {
          params: {
            code,
            fundId,
            effectiveDate
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getDoubleValue(code: string, fundId: number, effectiveDate: string): Promise<number> {
      try {
        const response = await apiClient.get(`${API_URL}/getDoubleValue`, {
          params: {
            code,
            fundId,
            effectiveDate
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getDetailLedger(code: string, fundId: number): Promise<DetailLedger> {
      try {
        const response = await apiClient.get(`${API_URL}/getDetailLedger`, {
          params: {
            code,
            fundId
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getBooleanValue(code: string, fundId: number, effectiveDate: string): Promise<boolean> {
      try {
        const response = await apiClient.get(`${API_URL}/getBooleanValue`, {
          params: {
            code,
            fundId,
            effectiveDate
          }
        });
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async removeParam(paramId: number): Promise<ApiResponse> {
      try {
        const response = await apiClient.delete(`${API_URL}/remove`, {
          params: {
            paramId
          }
        });
        return {
          message: response.data.message || 'پارامتر با موفقیت حذف شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

}

};