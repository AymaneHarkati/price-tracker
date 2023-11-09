import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "./utils";
export async function scrapedAmazonProduct(url: string) {
  if (!url) return;

  //Brightdata proxy configuration
  const usernameBright = String(process.env.USERNAME);
  const passBright = String(process.env.PASSWORD);
  const port = 22225;
  const sessionID = Math.floor(Math.random() * 1000000) | 0;
  const options = {
    auth: {
      username: `${usernameBright}-session-${sessionID}`,
      password: passBright,
    },
    host: `brd.superproxy.io`,
    port: port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceBlock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const outOfStock =
      $("#availability span").text().trim().toLocaleLowerCase() ===
      "currently unavailabale";
    const productImage =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrl = Object.keys(JSON.parse(productImage));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".reinventPriceSavingsPercentageMargin")
      .first()
      .text()
      .replace(/[-%]/g, "");
    const stars = $("#acrPopover > span.a-declarative > a > span")
      .first()
      .text()
      .trim();
    const reviewCount = $("#acrCustomerReviewText").first().text().trim();
    const description = extractDescription($);
    // construct data objects with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrl[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      isOutOfStock: outOfStock,
      category: "category",
      stars,
      reviewCount,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice),
    };
    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product : ${error.message}`);
  }
}
