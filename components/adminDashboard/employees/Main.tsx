import { getAllEmployees } from '@api/employeesService';

import EmployeesSectionClient from './EmployeesSectionClient';

export default async function Main() {
  const employees = await getAllEmployees();

  return <EmployeesSectionClient initialEmployees={employees} />;
}
