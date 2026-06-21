import React, { useRef } from 'react'
import useSearch from '../context/searchContext';

function Search() {
    const searchRef = useRef(null);
    const { searchQuery, updateSearchQuery } = useSearch();


    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateSearchQuery(searchRef.current.value);
    };

    return (
        <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center space-x-2 bg-white rounded-full px-4 py-1 shadow-md w-1/3"
        >
            <input
                type="text"
                placeholder="Search auctions..."
                ref={searchRef}
                className="w-full px-2 py-1 focus:outline-none text-gray-700 rounded-full"
            />
            {searchQuery && (
                <button
                    type="button"
                    onClick={() => {
                        updateSearchQuery("");
                        searchRef.current.value = "";
                    }}
                    className="ml-2 text-red-500"
                >
                    Clear
                </button>
            )}
            <button type="submit" className="focus:outline-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1117.5 9.5a7.5 7.5 0 01-7.5 7.5"
                    />
                </svg>
            </button>
        </form>
    )
}

export default Search
