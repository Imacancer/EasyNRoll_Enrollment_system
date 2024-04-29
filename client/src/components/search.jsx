import { useState, useEffect } from 'react';
import '../components/seachbar.css';
import PropTypes from 'prop-types';

const SearchBar = ({ setGradeLevelFilter,setSearchQuery }) => {
  const [gradeLevels, setGradeLevels] = useState([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Fetch grade levels from the server when component mounts
    fetchGradeLevels();
  }, []);

  const fetchGradeLevels = async () => {
    try {
      const response = await fetch('http://localhost:4001/grade-levels');
      if (!response.ok) {
        throw new Error('Failed to fetch grade levels');
      }
      const data = await response.json();
      setGradeLevels(data);
    } catch (error) {
      console.error('Error fetching grade levels:', error);
    }
  };

  const handleGradeLevelChange = (gradeLevel) => {
    const updatedSelectedGradeLevels = selectedGradeLevels.includes(gradeLevel)
      ? selectedGradeLevels.filter((level) => level !== gradeLevel)
      : [...selectedGradeLevels, gradeLevel];
    setSelectedGradeLevels(updatedSelectedGradeLevels);
    setGradeLevelFilter(updatedSelectedGradeLevels.join(',')); // Pass selected grade levels to parent component
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); // Update search input value
    setSearchQuery(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchValue); // Pass search query to parent component
  };

  SearchBar.propTypes = {
    setLoading: PropTypes.func.isRequired,
    setGradeLevelFilter: PropTypes.func.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  };

  return (
    <div className="search-bar mt-8">
      <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto h-full flex items-center justify-center">
        <div className="flex">
          <button
            id="dropdown-button"
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-transparent dark:hover:bg-gray-400 dark:hover:text-black dark:focus:ring-gray-400 dark:text-white dark:border-gray-400"
            onClick={toggleDropdown}
            type="button"
          >
            Grade Levels
            <svg className={`w-2.5 h-2.5 ms-2.5 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <div className={`dropdown ${isOpen ? 'open' : 'close'}`}>
            <ul className="text-sm text-gray-700 dark:text-black" aria-labelledby="dropdown-button">
              {gradeLevels.map((level, index) => (
                <li key={index}>
                  <label className="block cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b border-gray-200 pt-1 pb-1 pl-5">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500 rounded"
                      checked={selectedGradeLevels.includes(level)}
                      onChange={() => handleGradeLevelChange(level)}
                    />
                    <span className="ml-2">{level}</span>
                  </label>
                  {index < gradeLevels.length - 1 && (
                    <div className="border-b border-gray-300 dark:border-gray-700"></div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-full">
            <input type="search" id="search-dropdown" value={searchValue} onChange={handleSearchInputChange} className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-transparent rounded-e-lg border-s-white border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-transparent dark:border-s-white  dark:border-white dark:placeholder-white dark:text-white dark:focus:border-white" placeholder="Search Students.." required />
            <button type="button" onClick={() => setSearchQuery(searchValue)} className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-black bg-gray-200 rounded-e-lg border border-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-200 dark:bg-opacity-50 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:hover:text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
