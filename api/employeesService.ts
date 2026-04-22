import { IEmployee } from '@interfaces/IEmployee';

import { api } from '@store/api';

import { AppError, type AppErrorCode } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

export interface ICreateEmployee {
  name: string;
  description: string;
  phone: string;
  email: string;
  additionalInfo?: string;
}

const rawBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const baseUrl = rawBaseUrl?.replace(/\/$/, '');

export interface IUpdateEmployeesOrderItem {
  id: string;
  order: number;
}

const getBaseUrl = (): string => {
  if (!baseUrl) {
    throw new AppError(
      'API URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL.',
      'UNKNOWN',
      {
        isOperational: false,
      }
    );
  }

  return baseUrl;
};

const getErrorCodeByStatus = (status: number): AppErrorCode => {
  if (status === 400 || status === 422) return 'VALIDATION';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'SERVER';

  return 'UNKNOWN';
};

export const updateEmployeesOrder = async (
  payload: IUpdateEmployeesOrderItem[]
) => {
  try {
    const { data } = await api.patch('/employees/reorder', {
      employees: payload,
    });

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export async function getAllEmployees(): Promise<IEmployee[]> {
  const url = `${getBaseUrl()}/employees`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    const text = await res.text();

    if (!res.ok) {
      throw new AppError(
        `Failed to fetch employees: ${res.status} ${res.statusText}`,
        getErrorCodeByStatus(res.status),
        {
          status: res.status,
          details: {
            url,
            body: text,
          },
        }
      );
    }

    if (!text) {
      throw new AppError(
        'Failed to fetch employees: empty response body',
        'SERVER',
        {
          details: { url },
        }
      );
    }

    try {
      return JSON.parse(text) as IEmployee[];
    } catch {
      throw new AppError('Failed to parse employees response JSON', 'SERVER', {
        details: {
          url,
          body: text,
        },
      });
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

export const createEmployee = async (
  data: ICreateEmployee
): Promise<IEmployee> => {
  try {
    const response = await api.post<IEmployee>('/employees', data);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const updateEmployeeData = async (
  data: IEmployee
): Promise<IEmployee> => {
  try {
    const response = await api.put<IEmployee>(`/employees/${data._id}`, data);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const deleteEmployee = async (id: string): Promise<IEmployee> => {
  try {
    const response = await api.delete<IEmployee>(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};
