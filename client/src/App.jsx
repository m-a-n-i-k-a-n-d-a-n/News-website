import React, { useState, useReducer, createContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import News from './components/News';
import TopHeadlines from './components/TopHeadlines';
import CountryNews from './components/CountryNews';
import BreakingNews from './components/BreakingNews';
import SearchBar from './components/SearchBar';  // Import SearchBar

// Create a Context for global state
export let MyContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [load, setLoad] = useState(true);
  
  // Reducer for managing the search and pagination
  function reducer(state, action) {
    switch (action.type) {
      case 'GET_DATA':
        return { ...state, apidata: action.data };
      case 'SEARCH':
        return { ...state, search: action.q, page: 1 }; // Reset page to 1 on new search
      case 'PAGINATION':
        return { ...state, page: action.page };
      default:
        return state;
    }
  }

  // State management using useReducer
  let [state, dispatch] = useReducer(reducer, { apidata: {}, search: '', page: 1 });
  
  // Effect hook to fetch data when search query or page changes
  useEffect(() => {
    setLoad(true);
    const timeoutId = setTimeout(() => {
      fetch(`https://hn.algolia.com/api/v1/search?query=${state.search}&page=${state.page}`)
        .then(res => res.json())
        .then((data) => {
          dispatch({ type: 'GET_DATA', data });
          setLoad(false);
        })
        .catch((err) => alert(err));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state.search, state.page]);

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Handle search input
  const handleSearch = (searchQuery) => {
    dispatch({ type: 'SEARCH', q: searchQuery }); // Update the query and fetch results
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <>
          <Header onLogout={handleLogout} />
          {/* Pass handleSearch as a prop to SearchBar */}
          <SearchBar onSearch={handleSearch} />
          <MyContext.Provider value={{ ...state, dispatch, load }}>
            <Routes>
              <Route path="/" element={<News query={state.search} />} />
              <Route path="/top-headlines/:category" element={<TopHeadlines />} />
              <Route path="/country/:iso" element={<CountryNews />} />
              <Route path="/breaking-news" element={<BreakingNews />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MyContext.Provider>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
