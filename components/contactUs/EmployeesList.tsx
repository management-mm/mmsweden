import { getAllEmployees } from '@api/employeesService';

import EmployeeItem from './EmployeeItem';

export default async function EmployeesList() {
  const employeesList = await getAllEmployees();
  return (
    <ul className="flex flex-col flex-wrap gap-[32px] md:flex-row md:gap-[30px]">
      {employeesList.map(employee => (
        <EmployeeItem key={employee._id} employee={employee} />
      ))}
    </ul>
  );
}
