import Flag from './Flag';

const CountryOption = ({ flag, name }) => {
  return (
    <div className="flex">
      <Flag name={name} flag={flag} />

      <span>{name}</span>
    </div>
  );
};

export default CountryOption;
