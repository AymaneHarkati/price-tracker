import Link from "next/link";
import React from "react";
import Image from "next/image";
type Props = {
  id: string;
  image: string;
  title: string;
  price: number;
  category: string;
  currency: string;
};
export const Card = ({
  id,
  image,
  title,
  price,
  category,
  currency,
}: Props) => {
  return (
    <Link href={`/products/${id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">{category}</p>
          <p className="text-black text-lg font-semibold">
            <span>{currency}</span>
            <span>{price}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};
export default Card;
