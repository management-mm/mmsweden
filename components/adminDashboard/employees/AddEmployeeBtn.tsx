'use client';

import { useState } from 'react';

import { ICreateEmployee } from '@api/employeesService';

import AddNewEmpModal from './AddNewEmpForm';
import { IEditEmployeeFormValues } from './EditEmployeeForm';

interface IAddEmployeeBtnProps {
  onAdd: (employee: ICreateEmployee) => Promise<void>;
}

export default function AddEmployeeBtn({ onAdd }: IAddEmployeeBtnProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (values: IEditEmployeeFormValues) => {
    try {
      await onAdd({
        name: values.name as string,
        description: values.description as string,
        phone: values.phone,
        additionalInfo: values.additionalInfo,
        email: values.email,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Add new employee
      </button>

      <AddNewEmpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
