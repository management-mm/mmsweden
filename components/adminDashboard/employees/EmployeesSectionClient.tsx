'use client';

import { useMemo, useState } from 'react';

import {
  type ICreateEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployeeData,
  updateEmployeesOrder,
} from '@api/employeesService';
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { IEmployee } from '@interfaces/IEmployee';
import clsx from 'clsx';

import AddEmployeeBtn from './AddEmployeeBtn';
import EmployeeItem from './EmployeeItem';
import SortableEmployeeCard from './SortableEmployeeCard';

interface IEmployeesSectionClientProps {
  initialEmployees: IEmployee[];
}

export default function EmployeesSectionClient({
  initialEmployees,
}: IEmployeesSectionClientProps) {
  const [employees, setEmployees] = useState<IEmployee[]>(initialEmployees);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 6,
      },
    })
  );

  const employeeIds = useMemo(
    () => employees.map(employee => employee._id),
    [employees]
  );

  const handleSaveOrder = async () => {
    try {
      setIsSavingOrder(true);

      const payload = employees.map((employee, index) => ({
        id: employee._id,
        order: index,
      }));

      await updateEmployeesOrder(payload);

      setIsOrdering(false);
    } catch (error) {
      console.error('Failed to save employees order:', error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleAddEmployee = async (createdEmployee: ICreateEmployee) => {
    try {
      const savedEmployee = await createEmployee(createdEmployee);
      setEmployees(prev => [savedEmployee, ...prev]);
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  const handleSaveEmployee = async (updatedEmployee: IEmployee) => {
    try {
      const savedEmployee = await updateEmployeeData(updatedEmployee);

      setEmployees(prev =>
        prev.map(employee =>
          employee._id === savedEmployee._id ? savedEmployee : employee
        )
      );
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setEmployees(prev => {
      const oldIndex = prev.findIndex(employee => employee._id === active.id);
      const newIndex = prev.findIndex(employee => employee._id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <section className="p-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Employees Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add, edit, and remove employee contact cards displayed on the
                website.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 lg:flex-row">
              {isOrdering ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsOrdering(false)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveOrder}
                    disabled={isSavingOrder}
                    className={clsx(
                      'rounded-xl px-4 py-2 text-sm font-medium text-white transition',
                      isSavingOrder
                        ? 'cursor-not-allowed bg-blue-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    )}
                  >
                    {isSavingOrder ? 'Saving...' : 'Save order'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsOrdering(true)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Establish a new order
                  </button>

                  <AddEmployeeBtn onAdd={handleAddEmployee} />
                </>
              )}
            </div>
          </div>

          {isOrdering && (
            <p className="mt-4 text-sm text-blue-600">
              Drag employee cards to change their order.
            </p>
          )}

          <div className="my-6 h-px bg-gray-200" />

          {employees.length > 0 ? (
            isOrdering ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={employeeIds}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {employees.map((employee, index) => (
                      <SortableEmployeeCard
                        key={employee._id}
                        id={employee._id}
                        orderLabel={`${index + 1} spot`}
                      >
                        <EmployeeItem
                          employee={employee}
                          isOrdering={true}
                          onSave={handleSaveEmployee}
                          onDelete={() => handleDeleteEmployee(employee._id)}
                        />
                      </SortableEmployeeCard>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {employees.map(employee => (
                  <EmployeeItem
                    key={employee._id}
                    employee={employee}
                    isOrdering={false}
                    onSave={handleSaveEmployee}
                    onDelete={() => handleDeleteEmployee(employee._id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="text-base font-medium text-gray-700">
                No employees yet
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Create the first employee card to display contact information on
                the site.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
