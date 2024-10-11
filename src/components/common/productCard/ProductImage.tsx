import Skeleton from 'react-loading-skeleton';

const ProductImage = ({ isLoading, photos, name, language }) => {
  return (
    <>
      {!isLoading ? (
        photos.length !== 0 ? (
          <img
            className="h-[218px] w-full rounded-t-[4px] object-cover"
            src={photos ? photos[0] : ''}
            alt={name ? name[language] : ''}
          />
        ) : (
          <div className="h-[200px] w-full rounded-t-[4px] bg-slate-500" />
        )
      ) : (
        <Skeleton
          height={200}
          duration={1.2}
          containerClassName="block leading-[1]"
        />
      )}
    </>
  );
};

export default ProductImage;
