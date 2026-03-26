import { IEmployee } from '@interfaces/IEmployee';

import { api } from '@store/api';

export interface ICreateEmployee {
  name: string;
  description: string;
  phone: string;
  email: string;
  additionalInfo?: string;
}

const baseUrl =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export interface IUpdateEmployeesOrderItem {
  id: string;
  order: number;
}

export const updateEmployeesOrder = async (
  payload: IUpdateEmployeesOrderItem[]
) => {
  const { data } = await api.patch('/employees/reorder', {
    employees: payload,
  });

  return data;
};

export async function getAllEmployees(): Promise<IEmployee[]> {
  const url = `${baseUrl}/employees`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch employees: ${res.status} ${res.statusText}. URL: ${url}. Body: ${text}`
    );
  }

  return res.json();
}

export const createEmployee = async (
  data: ICreateEmployee
): Promise<IEmployee> => {
  const response = await api.post<IEmployee>('/employees', data);
  return response.data;
};

export const updateEmployeeData = async (
  data: IEmployee
): Promise<IEmployee> => {
  const response = await api.put<IEmployee>(`/employees/${data._id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<IEmployee> => {
  const response = await api.delete<IEmployee>(`/employees/${id}`);
  return response.data;
};
