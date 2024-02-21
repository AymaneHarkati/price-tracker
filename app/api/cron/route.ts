import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapedAmazonProduct } from "@/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/scraper/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) throw new Error("No Product found!!!");
    const updatedProducts = Promise.all(
      products.map(async (currProduct) => {
        const scrapedProduct = await scrapedAmazonProduct(currProduct.url);
        if (!scrapedProduct) throw new Error("No new Products!!!");
        const updatedPriceHistory = [
          ...currProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
        const updatedProduct = await Product.findOneAndUpdate(
          { url: scrapedProduct.url },
          product
        );
        // Check each product Status & send email
        const emailNotif = getEmailNotifType(scrapedProduct, currProduct);
        if (emailNotif && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmailBody(productInfo, emailNotif);
          const userEmail = updatedProduct.users.map((user: any) => user.email);
          await sendEmail(emailContent, userEmail);
          return updatedProduct;
        }
      })
    );
    return NextResponse.json({ message: "Ok", data: updatedProducts });
  } catch (error) {
    throw new Error(`Error in GET : ${error}`);
  }
}
