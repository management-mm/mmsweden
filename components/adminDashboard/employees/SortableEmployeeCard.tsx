'use client';

import type { PropsWithChildren } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

interface SortableEmployeeCardProps extends PropsWithChildren {
  id: string;
  orderLabel?: string;
}

export default function SortableEmployeeCard({
  id,
  orderLabel,
  children,
}: SortableEmployeeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'ring-dashed rounded-2xl ring-1 ring-blue-300',
        isDragging && 'z-10'
      )}
    >
      {orderLabel && (
        <div className="mb-2 block text-xs font-medium text-blue-500">
          {orderLabel}
        </div>
      )}

      {children}
    </div>
  );
}
