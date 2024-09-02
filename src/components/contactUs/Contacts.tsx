import ContactsPart from './ContactsPart';
import EmployeeItem from './EmployeeItem';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

import employeesList from '@constants/employeesList';

const Contacts = () => {
  return (
    <section>
      <div className="container">
        <h2 className="sr-only">Contacts</h2>
        <div className="flex gap-[14px] bg-secondary">
          <SvgIcon
            className="flex-shrink-0 fill-secondaryAccent"
            iconId={IconId.Info}
            size={{ width: 18, height: 18 }}
          />
          <em className="">
            If you have questions regarding our products or shipping, please,
            contact Hampus Wahlgren (or his assistant Artem Bortnik)
          </em>
        </div>
        <div>
          <SvgIcon
            className="fill-secondaryAccent"
            iconId={IconId.Info}
            size={{ width: 18, height: 18 }}
          />
          <em>
            If you have questions regarding payment, please, contact Eva
            Andersson
          </em>
        </div>
        <ContactsPart />
        <ul className="flex flex-col gap-[32px] md:flex-row">
          {employeesList.map(employee => (
            <EmployeeItem key={employee.title} employee={employee} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contacts;
