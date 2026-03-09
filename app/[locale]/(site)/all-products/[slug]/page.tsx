import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

export default function ProductDetails() {
  return (
    <>
      <h1 className="sr-only">Product Details</h1>
      <Product />
      <RecommendedProducts />
    </>
  );
}
