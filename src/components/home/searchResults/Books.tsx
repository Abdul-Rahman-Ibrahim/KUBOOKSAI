"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Books = ({ searchResult }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  return (
    <div className="text-left">
      <div>
        <Link href={`/search/${searchResult.id}`}>
          <div className="flex flex-col gap-y-2 hover:scale-110 p-2">
            <div className="w-full h-44 relative">
              {isLoading ? (
                <div className="image-placeholder w-full"></div>
              ) : (
                <div>
                  {searchResult.volumeInfo.imageLinks &&
                    searchResult.volumeInfo.imageLinks.thumbnail && (
                      // <Image
                      //   width={500}
                      //   height={500}
                      //   objectFit="contain"
                      //   src={
                      //     searchResult.volumeInfo.imageLinks.thumbnail
                      //   }
                      //   alt={searchResult.volumeInfo.title}
                      //   loading="lazy"
                      //   className="rounded-lg h-48"
                      // />
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={searchResult.volumeInfo.imageLinks.thumbnail}
                        alt={searchResult.volumeInfo.title}
                        loading="lazy"
                        className="rounded-lg h-48"
                      />
                    )}
                </div>
              )}
            </div>
            {isLoading ? (
              <div className="title-placeholder"></div>
            ) : (
              <h2 className="text-sm font-semibold pt-3 text-center">
                {searchResult.volumeInfo.title}
              </h2>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Books;
