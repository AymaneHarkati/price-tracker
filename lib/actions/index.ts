"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import {
  getAveragePrice,
  getHighestPrice,
  getLowestPrice,
} from "../scraper/utils";
import { scrapedAmazonProduct } from "../scraper";
import { ProductTypes, User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB();

    const scrapedProduct = await scrapedAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
export async function getProductById(id: string) {
  await connectToDB();
  const product = await Product.findById(id);
  return product;
}
export async function getAllProducts() {
  try {
    await connectToDB();
    const product: Array<ProductTypes> = await Product.find();
    return product;
  } catch (error) {
    console.log("Error : ", error);
  }
}
export async function getProductByCategory(productID: string) {
  try {
    await connectToDB();
    const product: ProductTypes = (await Product.findById(
      productID
    )) as ProductTypes;
    if (!product) return null;
    const sameCategoryProducts = await Product.find({
      _id: { $ne: productID },
      category: product.category,
    }).limit(3);
    return sameCategoryProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productID: string,
  userEmail: string
) {
  try {
    // Send our first email
    const product = await Product.findById(productID);
    if (!product) return null;
    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );
    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();
      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
