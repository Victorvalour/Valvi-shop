import { products } from "@/utils/products";
import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import { truncateText } from "@/utils/truncateText";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductParams } from "@/actions/getProducts";
import NullData from "./components/NullData";
import { GetServerSideProps } from "next";

interface HomeProps {
  products: any[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchParams: IProductParams = context.query as IProductParams;
  const products = await getProducts(searchParams);

  return {
    props: {
      products,
    },
  };
};

export default async function Home({ products }: HomeProps) {
  if (products.length === 0) {
    return (
      <NullData title="Oops! No products found. Click all to clear filters" />
    );
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i - 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);
  return (
    <div className="p-8 ">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </div>
      </Container>
    </div>
  );
}
