"use client";
import scrapeAndStoreProduct from "@/lib/actions";
import React, { FormEvent, useState } from "react";
const isVaildAmazonLink = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};
export default function SearchBar() {
  const [searchUrl, setUrl] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const handleSumbit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isVaildAmazonLink(searchUrl);
    if (!isValidLink) {
      return alert("Please provide a valid Amazon link");
    }
    setIsLoading(true);
    // Scrape data
    const product = await scrapeAndStoreProduct(searchUrl)
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSumbit}>
      <input
        type="text"
        placeholder="Product link"
        className="searchbar-input"
        value={searchUrl}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchUrl === ""}
      >
        {isloading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
