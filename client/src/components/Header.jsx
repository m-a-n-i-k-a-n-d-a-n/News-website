// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from '@fortawesome/free-solid-svg-icons';
import newsLogo from './../assets/logo.png';
import SearchBar from './SearchBar'; // Import the SearchBar component

function Header({ onLogout, onSearch }) { // Add onSearch prop to handle search
  const [active, setActive] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();
  
  const category = ["business", "entertainment", "general", "health", "science", "sports", "technology", "politics"];
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navRef.current && !navRef.current.contains(e.target) &&
        hamburgerRef.current && !hamburgerRef.current.contains(e.target) &&
        !categoryDropdownRef.current?.contains(e.target)
      ) {
        setActive(false);
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header>
      <nav ref={navRef} className="fixed top-0 left-0 w-full h-auto bg-gray-800 z-10 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <img src={newsLogo} alt="News Logo" className="w-10 h-10" />
          <h3 className="relative heading font-bold text-2xl text-white mb-5 mt-5">Xplore</h3>
        </div>

        {/* Add the SearchBar component here */}
        <div>
        
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <ul className="nav-ul flex gap-6 justify-start">
            <li>
              <Link className="no-underline font-semibold text-white" to="/" onClick={() => setActive(false)}>
                All News
              </Link>
            </li>
            <li>
              <Link className="no-underline font-semibold text-white" to="/breaking-news" onClick={() => setActive(false)}>
                Breaking News
              </Link>
            </li>
            <li className="dropdown-li" ref={categoryDropdownRef}>
              <Link 
                className="no-underline font-semibold text-white flex items-center gap-2" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCategoryDropdown(!showCategoryDropdown);
                }}
              >
                Top-Headlines 
                <FontAwesomeIcon icon={faCircleArrowDown} className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} />
              </Link>
              <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
                {category.map((element, index) => (
                  <li key={index} onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                    <Link to={"/top-headlines/" + element} className="flex gap-3 capitalize">{element}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link className="no-underline font-semibold text-white" to="/country/us" onClick={() => setActive(false)}>
                Country News
              </Link>
            </li>
          </ul>
        </div>

        <div ref={hamburgerRef} className={active ? "ham-burger z-index-100 ham-open" : "ham-burger z-index-100"} onClick={() => setActive(!active)}>
          <span className="lines line-1"></span>
          <span className="lines line-2"></span>
          <span className="lines line-3"></span>
        </div>
      </nav>

      {/* Hamburger Menu Content */}
      <div className={active ? "hamburger-menu open" : "hamburger-menu"}>
        <ul className="hamburger-links">
          <li><Link to="/" className="hamburger-link">Home</Link></li>
          <li>
            <button
              onClick={() => {
                onLogout(); // Call the logout function
                navigate('/login'); // Navigate to the login page
              }}
              className="hamburger-link"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
