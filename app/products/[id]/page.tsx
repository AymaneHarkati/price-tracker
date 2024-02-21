import React from "react";
import { getProductByCategory, getProductById } from "@/lib/actions/index";
import Image from "next/image";
import { ProductTypes } from "@/types";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatNumber } from "@/lib/scraper/utils";
import PriceInfoCard from "@/components/priceinfocard";
import Card from "@/components/card";
import Modal from "@/components/modal";
type Props = {
  params: {
    id: string;
  };
};
const ProductPage = async ({ params: { id } }: Props) => {
  const product: ProductTypes = await getProductById(id);
  if (!product) redirect("/");
  const sameProduct: Array<ProductTypes> =
    (await getProductByCategory(id)) ?? [];
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image border-none">
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                {" "}
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src={"/assets/icons/red-heart.svg"}
                  alt="heart-icon"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount ?? "n/a"}
                </p>
              </div>
              <div className="p-2 bg-white rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={15}
                    height={15}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars ?? "n/a"}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src={"/assets/icons/comment.svg"}
                    alt={"comment"}
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">n/a</p>
                </div>
              </div>
              <p className="text-sm text-black opacity-50">
                <span className=" text-primary-green font-semibold"> 93%</span>{" "}
                of buyers recommand this product
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
              />
            </div>
          </div>
          <Modal productID={id} />
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>
          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image
            src="/assets/icons/bag.svg"
            alt="buy button"
            width={40}
            height={40}
          />
          <Link href={product?.url} className="text-base text-white">
            BUY NOW
          </Link>
        </button>
      </div>
      {sameProduct?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text"> Similar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {sameProduct.map((simProduct) => (
              <Card
                id={simProduct._id!}
                image={simProduct.image}
                title={simProduct.title}
                price={simProduct.currentPrice}
                currency={simProduct.currency}
                category={simProduct.category}
                key={simProduct._id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductPage;
