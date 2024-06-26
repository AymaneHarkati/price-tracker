import Card from "@/components/card";
import HeroCarousel from "@/components/heroCarousel";
import SearchBar from "@/components/searchBar";
import { getAllProducts } from "@/lib/actions";
import { ProductTypes } from "@/types";
import Image from "next/image";

export default async function Home() {
  const allProducts: ProductTypes[] = (await getAllProducts()) ?? [];
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src={"/assets/icons/arrow-right.svg"}
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash The Power of{" "}
              <span className="text-orange-500">Today's Price</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product, index) => (
            <Card
              id={product._id!}
              image={product.image}
              title={product.title}
              price={product.currentPrice}
              currency={product.currency}
              category={product.category}
              key={product._id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
