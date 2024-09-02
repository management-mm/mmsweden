import ListItemSecPart from './ListItemSecPart';

import factsAndFiguresList from '@constants/factsAndFiguresList';

const SecondHeroPart = () => {
  return (
    <div className="bg-secondary py-[24px]">
      <div className="container">
        <ul className="text-center md:flex md:justify-center">
          {factsAndFiguresList.map((item, index) => {
            return <ListItemSecPart key={item.title} item={item} index={index + 1} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default SecondHeroPart;
