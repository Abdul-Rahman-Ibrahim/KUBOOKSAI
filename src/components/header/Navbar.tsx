/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Profile from "./Profile";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);


  useEffect(() => {
    window.addEventListener("scroll", () => {
      return window.scrollY > 40 ? setSticky(true) : setSticky(false);
    });
  });

  return (
    <div
      className={`${
        sticky ? "top-0 left-0 fixed w-full transition-all ease-linear" : ""
      }  sm:px-6 px-4 py-4 z-50 bg-white shadow shadow-blue-500/40`}
    >
      <div className=" max-w-7xl mx-auto w-full flex items-center gap-3 justify-between">
        <Link href="/">
          {" "}
          <div className="flex items-center gap-3 ">
            {/* <Image
              src="/images/artificial.png"
              alt="logo"
              width={45}
              height={45}
              priority
              quality={100}
              className=" object-contain"
              loading="eager"
              unoptimized
            /> */}
            
            <img  src="/images/artificial.png"
              alt="logo"  className=" object-contain w-12 h-12"/>
            <h1 className="text-xl md:text-2xl font-bold">
              KU <span className="text-yellow-300">BOOKS AI</span>
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6 text-lg font-bold">
           <Profile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
