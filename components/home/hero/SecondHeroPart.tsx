import ListItemSecPart from './ListItemSecPart';

import factsAndFiguresList from '@constants/factsAndFiguresList';

const SecondHeroPart = () => {
  return (
    <div className="bg-secondary pt-[24px] pb-[46px]">
      <div className="container">
        <ul className="text-center md:flex md:justify-center">
          {factsAndFiguresList.map((item, index) => {
            return (
              <ListItemSecPart key={item.title} item={item} index={index + 1} />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SecondHeroPart;
