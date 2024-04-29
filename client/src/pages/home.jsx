import Navbar from "../components/navbar";
import bgImage from '../images/mamb.png';
import logoImage from '../images/logo.png';
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center mt-20 relative">
                <div className="absolute w-full h-3 bg-teal-500 bottom-0"></div>
                <img src={logoImage} alt="Logo" className="w-20 h-20 mr-2 mb-5 mt-5" />
                <h1 className="text-6xl font-montserrat text-teal-800 font-bold">Mambugan National High School</h1>
            </div>
            <div className="fixed top-30 left-0 w-full h-full flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="text-center mb-10">
                    <h1 className="text-white font-montserrat italic text-xl">Welcome! To DepED EasyNRoll Mambungan National High School.</h1>
                    <h1 className="text-white font-montserrat italic text-xl">EasyNRoll Makes Enrollment Fast and Easy with Fully-Online Enrollment System.</h1>
                    <h1 className="text-white font-montserrat italic text-xl">Convenient and Hassle-Free Enrollment Compared to Traditional Public High School Enrollment.</h1>
                </div>
                <Link to='/enrollment' className="relative inline-flex items-center justify-center w-503 h-75 dark:w-503 h-75 p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    style={{
                        width: '503px',
                        height: '75px',
                        borderRadius: '20px'
                    }}
                >
                    <span className="relative flex items-center justify-center px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                        style={{
                            width: '503px',
                            height: '72px',
                            borderRadius: '20px',
                            fontSize: '1.5rem'

                        }}>Enroll Now!</span>
                </Link>
            </div>
        </div>
      );
      
}
 
export default HomePage;