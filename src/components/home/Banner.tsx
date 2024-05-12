/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import SearchBox from "./searchResults/SearchBox";

const Banner = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-64  md:h-72 relative">
        {/* <Image
          src="/images/banner2.jpg"
          alt="logo"
          fill
          quality={100}
          priority
          loading="eager"
          className="w-full object-cover"
        /> */}
        <img src="/images/banner2.jpg"
          alt="logo"   className="w-full object-cover h-full" />
        <div className="top-0 left-0 right-0 bg-black absolute w-full h-64  md:h-72 bg-opacity-50  text-center py-6 px-4">
          <div className="grid place-content-center place-items-center w-full h-full">
            <h1 className="  mx-auto text-white text-3xl font-bold sm:text-5xl  uppercase left-10">
              Search for a book on <br className="hidden sm:block" /> <span className="text-yellow-300">KU Books AI</span> 
            </h1>
          </div>
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default Banner;
