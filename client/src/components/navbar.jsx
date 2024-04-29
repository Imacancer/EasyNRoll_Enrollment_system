import axios from 'axios'; // Import Axios library
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import Link, useNavigate, and useLocation from react-router-dom
import PropTypes from 'prop-types';


const Navbar = ({ setLoading }) => {

    const [scrollOpacity, setScrollOpacity] = useState(1); // Initially set to 1 for full opacity

    useEffect(() => {
        const handleScroll = () => {
        const scrollPosition = window.scrollY; // Get the current scroll position
        const maxScroll = 500; // Set the scroll position where opacity should be at its minimum

        // Calculate the opacity based on the scroll position
        const opacity = Math.min(1, 1 - scrollPosition / maxScroll);

        // Update the state to trigger re-render with the new opacity
        setScrollOpacity(opacity);
        };

        // Attach event listener for the scroll event
        window.addEventListener('scroll', handleScroll);

        // Clean up by removing the event listener when the component unmounts
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    Navbar.propTypes = {
        setLoading: PropTypes.func.isRequired, // Validate setLoading prop as a function and required
      };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate(); // Initialize useHistory hook
    const location = useLocation(); // Initialize useLocation hook

    const handleLogout = async () => {
        try {
            // Make a request to the server to invalidate the JWT session
            await axios.post('http://localhost:4001/logout', null, {
                headers: {
                    'Authorization': localStorage.getItem('token') // Send JWT token in the headers
                }
            });
            // Clear the JWT token from localStorage
            localStorage.removeItem('token');
            // Redirect the user to the login page or perform any other desired action after logout
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <nav className="bg-teal-500 dark:bg-teal-500 opacity-100 fixed w-full z-20 top-0 start-0 border-gray-200 dark:border-gray-600"
         style={{ opacity: scrollOpacity }}
        >
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to='/homepage' className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center font-montserrat font-bold text-3xl">
                        <span style={{ color: '#D04E4E' }}>Dep</span>
                        <span style={{ color: '#0f22D1' }}>Ed</span>
                        <span style={{ color: '#D04E4E' }}>Easy</span>
                        <span style={{ color: '#080808' }}>NRoll</span>
                    </div>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <Link to='/enrollment' className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800" onClick={() => setLoading(true)}>
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Enroll Now!
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-expanded={isMenuOpen}
                        aria-controls="navbar-sticky"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? '' : 'hidden'}`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-teal-500 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-teal-500 dark:bg-gray-800 md:dark:bg-teal-500 dark:border-gray-700">
                        <li>
                            <Link to="/homepage" className={`block py-2 px-3 ${location.pathname === '/homepage' ? 'text-white dark:text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`} aria-current={location.pathname === '/homepage' ? 'page' : undefined} onClick={() => setLoading(true)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={`block py-2 px-3 ${location.pathname === '/about' ? 'text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`} aria-current={location.pathname === '/about' ? 'page' : undefined} onClick={() => setLoading(true)}>
                                About
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <li>
                                <Link to="/student-logs" className={`block py-2 px-3 ${location.pathname === '/student-logs' ? 'text-white dark:text-white' : 'text-gray-900'} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`} aria-current={location.pathname === '/student-logs' ? 'page' : undefined} onClick={() => setLoading(true)}>
                                    Student Logs
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li>
                                <button onClick={handleLogout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-black dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                    Log Out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
