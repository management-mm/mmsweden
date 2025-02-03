import clsx from "clsx";
import type { FC } from "react";

interface IDeleteOrSoldProps {
  setIsDelete: (value: boolean) => void
  isDelete: boolean
}

const DeleteOrSold:FC<IDeleteOrSoldProps> = ({setIsDelete, isDelete}) => {
  return (
    <div>
      <button
        type="button"
        onClick={() => setIsDelete(!isDelete)}
        className={clsx("mb-[20px] w-full rounded-[32px]  py-[10px] text-center",
          isDelete ? 'bg-red-900 border border-red-900 text-secondary' : 'bg-transparent border border-primary text-primary'
        )}
      >
        Delete
      </button>
      <div>
        <button>Sold</button>
      </div>
    </div>
  );
};

export default DeleteOrSold;
