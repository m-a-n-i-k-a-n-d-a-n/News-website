import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query); // Pass the query to parent
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' ,marginRight: '469px'}}>
      <input className='search'
        type="text"
        placeholder="Search for news..."
        value={query}
        onChange={handleInputChange}
        style={{ padding: '10px', width: '44%' }}
      />
      <button className='search' onClick={handleSearch} style={{ padding: '10px', marginLeft: '10px' }}><i>Search</i></button>
    </div>
  );
}

export default SearchBar;
