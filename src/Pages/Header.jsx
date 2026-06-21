import React, { useContext, useRef, useState, useEffect } from "react";
import { NavLink, Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import Search from "../Components/Search";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResDropdownOpen, setIsResDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { cetagory } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dropdownRefRes = useRef(null);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (
        dropdownRefRes.current &&
        !dropdownRefRes.current.contains(event.target)
      ) {
        setIsResDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleResDropdown = () => {
    setIsResDropdownOpen(!isResDropdownOpen);
  };



  return (
    <>
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center gap-2">
            {pathname !== '/' && pathname !== '/login' && pathname !== '/register' && (
              <button
                onClick={() => navigate(-1)}
                className="mr-1 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-teal-400 border border-slate-800 transition-all duration-200 flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
                aria-label="Go Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
            <NavLink to="/" className="flex items-center tracking-tight">
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-extrabold">Auctio</span>
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-extrabold">Nex</span>
            </NavLink>
            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                Admin
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <Search />
          </div>

          {/* Hamburger menu for mobile */}
          <div className="block lg:hidden">
            <button
              className="text-slate-200 hover:text-white p-2 focus:outline-none transition-colors"
              aria-label="Toggle menu"
              onClick={toggleSidebar}
              ref={hamburgerRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          <nav className="hidden lg:flex space-x-2 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Home
            </NavLink>
            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <NavLink
                to="/listitem"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`
                }
              >
                List Item
              </NavLink>
            )}

            {/* Dropdown for Browse Auctions */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition-all duration-200 focus:outline-none ${
                  pathname.includes("cetagories")
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
                onClick={toggleDropdown}
              >
                {pathname.includes(cetagory) ? (
                  <span>
                    {cetagory.charAt(0).toUpperCase() +
                      cetagory.slice(1).toLowerCase()}
                  </span>
                ) : (
                  <span>Browse</span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-800/80 shadow-3d-elevated rounded-xl z-50 backdrop-blur-md p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <ul className="text-slate-200 text-sm space-y-1">
                    <Link to={`cetagories/${"electronics"}`}>
                      <li className="hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium hover:text-teal-400">
                        Electronics
                      </li>
                    </Link>
                    <Link to={`cetagories/${"clothing"}`}>
                      <li className="hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium hover:text-teal-400">
                        Clothing
                      </li>
                    </Link>
                    <Link to={`cetagories/${"furniture"}`}>
                      <li className="hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium hover:text-teal-400">
                        Furniture
                      </li>
                    </Link>
                    <Link to={`cetagories/${"books"}`}>
                      <li className="hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium hover:text-teal-400">
                        Books
                      </li>
                    </Link>
                    <Link to={`cetagories/${"other"}`}>
                      <li className="hover:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer transition-colors font-medium hover:text-teal-400">
                        Other
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </div>

            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <NavLink
                to="/myitems"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`
                }
              >
                My Listings
              </NavLink>
            )}

            <NavLink
              to="/results"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Results
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Profile
            </NavLink>

            <NavLink
              to="/feedback"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Feedback
            </NavLink>

            <button
              className="ml-4 py-2 px-4 text-white font-bold rounded-lg btn-3d-danger text-sm"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed top-0 right-0 w-64 h-full bg-slate-900 border-l border-slate-800 shadow-3d-elevated z-50 p-6 flex flex-col backdrop-blur-md animate-in slide-in-from-right duration-300"
          ref={sidebarRef}
        >
          <div className="text-2xl font-bold flex items-center gap-2 mb-8">
            <NavLink to="/" onClick={toggleSidebar} className="flex items-center tracking-tight">
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-extrabold">Auctio</span>
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-extrabold">Nex</span>
            </NavLink>
            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                Admin
              </span>
            )}
          </div>
          <nav className="flex flex-col gap-3">
            <NavLink
              to="/"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Home
            </NavLink>
            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <NavLink
                to="/listitem"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`
                }
              >
                List Item
              </NavLink>
            )}

            {/* Sidebar dropdown for Browse Auctions */}
            <div className="relative" ref={dropdownRefRes}>
              <button
                className="w-full text-left text-slate-300 hover:text-white font-semibold py-2.5 px-3 rounded-xl hover:bg-slate-800/40 flex items-center justify-between"
                onClick={toggleResDropdown}
              >
                <span>Browse Auctions</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isResDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isResDropdownOpen && (
                <div className="mt-1 ml-4 border-l border-slate-800 pl-3 py-1 space-y-1">
                  <Link to={`cetagories/${"electronics"}`} onClick={toggleSidebar}>
                    <div className="text-slate-400 hover:text-teal-400 py-1.5 transition-colors font-medium">
                      Electronics
                    </div>
                  </Link>
                  <Link to={`cetagories/${"clothing"}`} onClick={toggleSidebar}>
                    <div className="text-slate-400 hover:text-teal-400 py-1.5 transition-colors font-medium">
                      Clothing
                    </div>
                  </Link>
                  <Link to={`cetagories/${"furniture"}`} onClick={toggleSidebar}>
                    <div className="text-slate-400 hover:text-teal-400 py-1.5 transition-colors font-medium">
                      Furniture
                    </div>
                  </Link>
                  <Link to={`cetagories/${"books"}`} onClick={toggleSidebar}>
                    <div className="text-slate-400 hover:text-teal-400 py-1.5 transition-colors font-medium">
                      Books
                    </div>
                  </Link>
                  <Link to={`cetagories/${"other"}`} onClick={toggleSidebar}>
                    <div className="text-slate-400 hover:text-teal-400 py-1.5 transition-colors font-medium">
                      Other
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {currentUser && currentUser.email === 'admin@auctionex.com' && (
              <NavLink
                to="/myitems"
                onClick={toggleSidebar}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`
                }
              >
                My Listings
              </NavLink>
            )}
            
            <NavLink
              to="/results"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Results
            </NavLink>

            <NavLink
              to="/profile"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Profile
            </NavLink>

            <NavLink
              to="/feedback"
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-slate-800 border border-slate-700/50 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`
              }
            >
              Feedback
            </NavLink>
            
            <button
              className="mt-6 py-2.5 px-4 text-white font-bold rounded-xl btn-3d-danger w-full text-center"
              onClick={() => {
                toggleSidebar();
                logout();
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
