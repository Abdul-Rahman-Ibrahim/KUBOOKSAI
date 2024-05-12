"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import axios from "axios";
import Books from "./Books";
import { BookType } from "@/contexts/Types";

const SearchBox = () => {
  const [sticky, setSticky] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<BookType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage] = useState<number>(16);

  useEffect(() => {
    // Load search results from localStorage when component mounts
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    }

    const storedSearch = localStorage.getItem("search");
    if (storedSearch) {
      setSearch(storedSearch);
    }

    const storedCurrentPage = localStorage.getItem("currentPage");
    if (storedCurrentPage) {
      setCurrentPage(parseInt(storedCurrentPage));
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);

    if (!value.trim()) {
      // Clear localStorage when search input is empty
      localStorage.removeItem("searchResults");
      setSearchResults([]); // Clear search results state
    } else {
      // Update localStorage with the new search value
      localStorage.setItem("search", value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=0&maxResults=40&key=AIzaSyBJKJAgod8XmG_m5Z72q8-vcDwBrgnqi9E`
      );
      const results = response.data.items || [];
      setSearchResults(results);
      // Store search results in localStorage
      localStorage.setItem("searchResults", JSON.stringify(results));
      localStorage.setItem("search", search);
      localStorage.setItem("currentPage", currentPage.toString());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      return window.scrollY > 200 ? setSticky(true) : setSticky(false);
    });
  }, []);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const setCurrentPageAndUpdateLocalStorage = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page.toString());
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPageAndUpdateLocalStorage(i)}
          className={`px-3 py-2 border ${
            currentPage === i
              ? "bg-yellow-200 font-semibold"
              : "bg-white text-yellow-400 hover:bg-yellow-400 hover:text-white"
          } focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div
        className={`${
          sticky
            ? "fixed top-16 lg:top-3 shadow-yellow-400/20 bg-white shadow-lg lg:shadow-none left-0 right-0 lg:bg-transparent p-3 lg:p-0 lg:left-[20vw] lg:right-[20vw] z-50  sm:mx-0 sm:flex justify-center"
            : "absolute left-0 right-0 w-full px-3 sm:px-6 -bottom-7"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`${
            sticky ? "shadow-none" : "shadow-xl"
          } flex sm:mx-auto bg-white sm:w-[79vw] border-2 border-yellow-400 lg:w-[50vw]`}
        >
          <input
            type="search"
            placeholder="What are you looking for?"
            value={search}
            onChange={handleInputChange}
            className="w-full px-4 sm:px-6 text-lg col-span-2 py-3 text-black rounded-none outline-none"
          />
          <button
            type="submit"
            className="px-3 py-3 bg-yellow-400  lg:px-8 font-semibold col-span-1 text-xl"
          >
            <FaSearch className="sm:hidden text-white" />
            <span className="hidden sm:block text-white font-semibold">
              {" "}
              Search
            </span>
          </button>
        </form>
      </div>
      <div className="max-w-7xl  mx-auto my-28 sm:px-5">
        <div>
          {currentResults.length > 0 ? (
            <div>
              <h1 className=" font-medium text-left text-lg sm:text-xl">
                Search Results for{" "}
                <span className="text-xl font-bold">&quot;{search}&quot;</span>
              </h1>
              <div className="grid grid-cols-2 sm:grid-auto-fit-xs gap-2 pt-6 mb-20">
                {currentResults.map((book) => (
                  <Books key={book.id} searchResult={book} />
                ))}
              </div>
              <div className="flex justify-center space-x-3 sm:space-x-4 pb-20">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "bg-yellow-400 text-white hover:bg-yellow-300"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md`}
                >
                  <FaChevronLeft />
                </button>
                {renderPageNumbers()}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "bg-yellow-400 text-white hover:bg-yellow-600"
                  } focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md`}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xl text-left font-semibold">Search For a book</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
