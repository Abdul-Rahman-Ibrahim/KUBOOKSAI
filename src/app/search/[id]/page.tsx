"use client";

import Image from "next/image";
import { TbChevronLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Modal, Rate, Typography } from "antd";
import { useEffect, useState } from "react";

import { BookType } from "@/contexts/Types";
import ChatBot from "@/components/ChatBot";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import Books from "@/components/home/searchResults/Books";

const getSingleBook = async (id: string): Promise<BookType | null> => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${id}&key=AIzaSyBJKJAgod8XmG_m5Z72q8-vcDwBrgnqi9E`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to get book:", error);
    return null;
  }
};

const BookInfo = ({ params }: any) => {
  const id = decodeURIComponent(params.id);
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();
  const [similarBooks, setSimilarBooks] = useState<BookType[]>([]);

  const openDrawerRight = () => {
    if (session?.user) {
      setShowChatBot(true);
    } else {
      setOpenModal(true);
    }
  };

  const closeDrawerRight = () => {
    setShowChatBot(false);
  };

  useEffect(() => {
    const fetchBook = async () => {
      const data = await getSingleBook(id);
      console.log("🚀 ~ fetchBook ~ data:", data);
      setBook(data);
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const fetchSimilarBooks = async () => {
      if (book) {
        try {
          const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${book.volumeInfo.title}&maxResults=20&key=AIzaSyBJKJAgod8XmG_m5Z72q8-vcDwBrgnqi9E`
          );
          const similarBooksData = response.data.items || [];
          const randomIndexes = getRandomIndexes(similarBooksData.length, 5);
          const randomBooks = randomIndexes.map(
            (index) => similarBooksData[index]
          );
          setSimilarBooks(randomBooks);
        } catch (error) {
          console.error("Error fetching similar books:", error);
        }
      }
    };

    fetchSimilarBooks();
  }, [book]);

  const getRandomIndexes = (max: number, count: number): number[] => {
    const indexes: number[] = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [loading]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-32 text-xl font-semibold px-3 sm:px-6">
        Please Wait...
      </div>
    );
  }

  if (!book) {
    return <div className="p-16">Failed to get book</div>;
  }

  const {
    volumeInfo: {
      title,
      subtitle,
      authors,
      publishedDate,
      description,
      categories,
      pageCount,
      previewLink,
      imageLinks,
    },
  } = book;

  return (
    <>
      <div className="grid max-w-6xl px-3 py-10 mx-auto md:py-20 lg:py-8 sm:px-6 place-items-start gap-y-5 mb-20">
        <button
          onClick={() => router.push("/")}
          type="button"
          className=" p-1 font-semibold text-center bg-gray-200  mx-1 rounded-full"
        >
          <TbChevronLeft className="w-8 h-8" />
        </button>
        <div className="py-6">
          <div className="grid sm:grid-cols-3 gap-y-8 gap-x-4 lg:gap-x-10 lg:place-items-center">
            <div className="w-full h-72 sm:col-span-1 sm:h-[500px] relative order-2 sm:order-1">
              {imageLinks?.thumbnail && (
                // <Image
                //   src={imageLinks.thumbnail}
                //   alt={title || ""}
                //   layout="fill"
                //   quality={100}
                //   className=" object-contain"
                //   loading="lazy"
                // />
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageLinks.thumbnail}
                  alt={title || ""}
                  className=" object-contain w-full h-full"
                  loading="lazy"
                />
              )}
            </div>
            <div className="w-full sm:col-span-2 order-1 sm:order-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              <h1 className="text-xl font-medium">{subtitle}</h1>
              <div className="font-bold text-sm py-1 text-blue-500">
                <h1>Author(s): {authors?.join(", ")}</h1>
                <p className="pt-1">Published-Date: {publishedDate}</p>
              </div>

              <div className="py-1 flex items-center gap-x-8 gap-y-2 flex-wrap">
                <h4 className="text-sm font-semibold">
                  Categories:{" "}
                  <span className="text-gray-500">
                    {categories?.join(", ")}
                  </span>
                </h4>
                <h4 className="text-sm font-semibold">
                  Page Count: <span className="text-gray-500">{pageCount}</span>
                </h4>
                <Rate
                  allowHalf
                  disabled
                  defaultValue={2.5}
                  className="text-lg"
                />
                <Typography.Paragraph
                  className="text-base"
                  ellipsis={{ rows: 10 }}
                >
                  {description}
                </Typography.Paragraph>

                <p
                  onClick={openDrawerRight}
                  className="flex items-center capitalize cursor-pointer justify-center w-full pb-3 hover:underline text-lg text-blue-400 font-semibold hover:text-green-500"
                >
                  Interact with KU BOOK AI to know more about this book
                </p>
                <ChatBot show={showChatBot} onClose={closeDrawerRight} />
                <Modal
                  open={openModal}
                  closable={false}
                  width={400}
                  centered
                  footer={null}
                >
                  <div className="grid gap-4">
                    <button
                      onClick={() => signIn("google")}
                      className="flex items-center gap-5 justify-center w-full bg-gray-50 py-2 border text-lg font-bold rounded-lg"
                    >
                      <Image
                        src="/images/googlesvg.png"
                        alt="google"
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                      <h1>Continue with Google</h1>
                    </button>
                    <button
                      onClick={() => signIn("github")}
                      className="flex items-center justify-center bg-gray-50 bg-opacity-80 gap-4 py-2 border  text-lg font-bold rounded-lg"
                    >
                      <Image
                        src="/images/github.png"
                        alt="github"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                      <h1>Continue with Github</h1>
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>

          <div>
            {similarBooks.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl uppercase font-bold mb-3">
                  Similar Books:
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {similarBooks.map((book) => (
                    <Books key={book.id} searchResult={book} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookInfo;
