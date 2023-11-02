import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  {
    src: "/assets/icons/search.svg",
    alt: "search",
  },
  {
    src: "/assets/icons/black-heart.svg",
    alt: "black-heart",
  },
  {
    src: "/assets/icons/user.svg",
    alt: "user",
  },
];
export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/assets/logo.png"}
            width={40}
            height={40}
            alt="logo image"
          />
          <p className="nav-logo">
            Today<span className="text-orange-600">Price</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image
              key={icon.src}
              src={icon.src}
              alt={icon.alt}
              width={37}
              height={37}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
