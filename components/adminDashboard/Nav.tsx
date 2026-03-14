import Block from './Block';
import NavGeneral from './NavGeneral';
import NavProducts from './NavProducts';

const Nav = () => {
  return (
    <div className="mb-[32px]">
      <Block intent="nav" title="Products">
        <NavProducts />
      </Block>
      <Block intent="nav" title="General">
        <NavGeneral />
      </Block>
    </div>
  );
};

export default Nav;
