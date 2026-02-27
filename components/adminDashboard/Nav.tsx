import Block from './Block';
import NavGeneral from './NavGeneral';
import NavProducts from './NavProducts';

const Nav = () => {
  return (
    <>
      <Block intent="nav" title="Products">
        <NavProducts />
      </Block>
      <Block intent="nav" title="General">
        <NavGeneral />
      </Block>
    </>
  );
};

export default Nav;
