import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

const ProductDetails = () => {
  return (
    <>
      <h1 className="sr-only">Product Details</h1>
      <Product />
      <RecommendedProducts />
    </>
  );
};

export default ProductDetails;
