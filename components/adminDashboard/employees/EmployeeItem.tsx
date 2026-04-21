'use client';

import type { FC } from 'react';
import { useState } from 'react';

import { IEmployee } from '@interfaces/IEmployee';

import EditEmployeeForm, {
  type IEditEmployeeFormValues,
} from './EditEmployeeForm';

import ConfirmModal from '../common/confirmModal';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { IconId } from '@enums/iconsSpriteId';

interface IEmployeeItemProps {
  employee: IEmployee;
  onSave?: (updatedEmployee: IEmployee) => void;
  onDelete?: () => void;
  isOrdering?: boolean;
}

const EmployeeItem: FC<IEmployeeItemProps> = ({
  employee,
  onSave,
  onDelete,
  isOrdering = false,
}) => {
  const locale = useCurrentLocale();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'save' | 'delete' | null>(
    null
  );
  const [pendingValues, setPendingValues] =
    useState<IEditEmployeeFormValues | null>(null);

  const currentName = employee.name?.[locale] ?? employee.name?.en ?? '';
  const currentDescription =
    employee.description?.[locale] ?? employee.description?.en ?? '';

  const handleRequestSave = (values: IEditEmployeeFormValues) => {
    setPendingValues(values);
    setConfirmAction('save');
  };

  const handleRequestDelete = () => {
    setConfirmAction('delete');
  };

  const handleCloseModal = () => {
    setConfirmAction(null);
    setPendingValues(null);
  };

  const handleConfirm = () => {
    if (confirmAction === 'save' && pendingValues) {
      const updatedEmployee: IEmployee = {
        ...employee,
        name:
          typeof pendingValues.name === 'object'
            ? pendingValues.name
            : {
                ...employee.name,
                [locale]: pendingValues.name,
              },
        description:
          typeof pendingValues.description === 'object'
            ? pendingValues.description
            : {
                ...employee.description,
                [locale]: pendingValues.description,
              },
        phone: pendingValues.phone,
        additionalInfo: pendingValues.additionalInfo,
        email: pendingValues.email,
      };

      onSave?.(updatedEmployee);
      setIsEditing(false);
      setPendingValues(null);
      setConfirmAction(null);
    }

    if (confirmAction === 'delete') {
      onDelete?.();
      setConfirmAction(null);
    }
  };

  const modalTitle =
    confirmAction === 'save'
      ? 'Are you sure you want to save changes?'
      : 'Are you sure you want to delete this employee?';

  return (
    <article className="shadow-card relative h-auto w-full pt-[26px]">
      {!isOrdering && (
        <>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute top-[16px] right-[16px]"
          >
            <SvgIcon iconId={IconId.Edit} size={{ width: 18, height: 18 }} />
          </button>

          <button
            type="button"
            onClick={handleRequestDelete}
            className="absolute right-[16px] bottom-[26px]"
          >
            <SvgIcon iconId={IconId.Trash} size={{ width: 18, height: 18 }} />
          </button>
        </>
      )}

      <div className="flex flex-col items-center px-4 pb-6">
        {isEditing && !isOrdering ? (
          <EditEmployeeForm
            setIsEditing={setIsEditing}
            employee={employee}
            locale={locale}
            currentName={employee.name}
            currentDescription={employee.description}
            onRequestSave={handleRequestSave}
          />
        ) : (
          <>
            <h3 className="text-primary mb-[12px] text-[18px] font-medium">
              {currentName}
            </h3>

            <p className="text-secondary-accent mb-[32px] text-center text-[16px] font-medium">
              {currentDescription}
            </p>

            <address>
              <a
                className="transition-color fill-primary font-openSans text-primary transition-fill duration-primary hover:fill-secondary-accent hover:text-secondary-accent mb-[22px] flex items-center justify-center not-italic"
                href={`tel:${employee.phone?.replace(/\s+/g, '') ?? ''}`}
              >
                <SvgIcon
                  className="mr-[12px]"
                  iconId={IconId.Phone}
                  size={{ width: 16, height: 16 }}
                />
                <span className="sr-only">Phone: </span>
                <span>{employee.phone}</span>
                {employee.additionalInfo && (
                  <span className="ml-1 text-[12px]">
                    {employee.additionalInfo}
                  </span>
                )}
              </a>

              <a
                className="font-openSans flex items-center justify-center not-italic"
                href={`mailto:${employee.email}`}
              >
                <SvgIcon
                  className="fill-primary mr-[12px]"
                  iconId={IconId.Email}
                  size={{ width: 15, height: 15 }}
                />
                <span className="sr-only">Email: </span>
                {employee.email}
              </a>
            </address>
          </>
        )}

        <DecorativeLine intent="primary" />
      </div>

      <ConfirmModal
        title={modalTitle}
        isOpen={confirmAction !== null}
        onYes={handleConfirm}
        onNo={handleCloseModal}
      />
    </article>
  );
};

export default EmployeeItem;
