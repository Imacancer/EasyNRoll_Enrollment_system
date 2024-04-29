import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';



const DataList = ({ setLoading, selectedGradeLevel, searchQuery }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);
  

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      event.target.tagName !== 'A'
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4001/students')
      .then(response => {
        if(response.status === 200){
            setData(response.data.students);
            // console.log('Data received:', response.data.students);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
      });
  }, []);

  const handleAddSection = (studentId) => {
    console.log('Student ID:', studentId);
    axios.post(`http://localhost:4001/add-subjects/${studentId}`)
      .then(response => {
        if(response.status === 200){
          console.log('Subjects added successfully');
          toast.success('Added Successfully');
        }
      })
      .catch(error => {
        console.error('Failed to add subjects:', error);
        toast.error('Failed to add subjects');
        // Optionally, handle the error appropriately
      });
  };

  // console.log('Data:', data);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

    // Filter and sort data based on selectedGradeLevel
    let filteredData = data;
      if (selectedGradeLevel) {
        filteredData = data.filter(student => student.gradelevel_id === selectedGradeLevel);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(student =>
          student.first_name.toLowerCase().includes(query) ||
          student.last_name.toLowerCase().includes(query)
        );
      }
      // Sort data based on student ID
      filteredData.sort((a, b) => a.student_id.localeCompare(b.student_id));
  return (
    <div className="relative overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg mt-4">
      <Toaster position="top-center"/>
      <table className="mt-28 w-full h-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-200 table-auto min-w-full border-collapse border border-gray-200">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">Image</th>
            <th scope="col" className="px-6 py-3">Student ID</th>
            <th scope="col" className="px-6 py-3">First Name</th>
            <th scope="col" className="px-6 py-3">Last Name</th>
            <th scope="col" className="px-6 py-3">Address</th>
            <th scope="col" className="px-6 py-3">Contact Number</th>
            <th scope="col" className="px-6 py-3">Mothers Name</th>
            <th scope="col" className="px-6 py-3">Fathers Name</th>
            <th scope="col" className="px-6 py-3">Age</th>
            <th scope="col" className="px-6 py-3">Room ID</th>
            <th scope="col" className="px-6 py-3">Grade Level</th>
            <th scope="col" className="px-6 py-3">Enrolled</th>
            <th scope="col" className="px-6 py-3">General Average</th>
            <th scope="col" className="px-6 py-3">Clearance</th>
            <th scope="col" className="px-6 py-3">Form 137</th>
            <th scope="col" className="px-6 py-3">Section</th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((student, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 border h-40 w-40">
                <div className="relative flex items-center justify-center w-full h-full">
                  {student.studentimage ? (
                    <div className='relative'>
                      <img
                        src={`/src/assets/${student.student_id}.jpg`}
                        alt="Student"
                        className="max-w-full max-h-40 rounded-full"
                        style={{ maxHeight: '100px', maxWidth:'100px' }}
                      />
                      <div className="absolute inset-0 border-2 border-transparent rounded-full ring-2 ring-gradient-to-br from-green-800 to-blue-800 hover:ring-0 hover:border-transparent transition duration-1000"></div>
                    </div>
                  ) : (
                    <span className='text-black font-montserrat font-bold'>No Image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.student_id}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.first_name}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.last_name}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.address}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.contact_number}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.mother_name}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.father_name}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.age}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.room_id}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.gradelevel_id}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.enrolled}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.general_average}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.clearance}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.form137}</td>
              <td className="px-6 py-6 border text-black font-montserrat font-bold">{student.section_id}</td>
              <td className="px-6 py-6 border h-40 w-40">
                <div className="relative inline-block text-left" ref={dropdownRef}>
                  <button
                    id="dropdownMenuIconHorizontalButton"
                    onClick={toggleOptions}
                    type="button"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none dark:text-black focus:ring-gray-50 dark:bg-gray-100 dark:hover:bg-gray-300 dark:focus:ring-gray-50"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 3"
                    >
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                  </button>

                  {showOptions && (
                    <div className="origin-top-left absolute top-full right-10 z-10 mt-0 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:bg-gray-200 dark:divide-gray-300 transition-all duration-1000 transform opacity-100 ">
                      <ul
                        className=""
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <li>
                        <Link
                          id='AddSubject'
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white"
                          onClick={() => handleAddSection(student.student_id)}
                        >
                          Add a Subject
                        </Link>
                        </li>
                        <li>
                          <Link
                            to={`http://localhost:5173/edit-profile/${student.student_id}`}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white"
                            role="menuitem"
                            onClick={() => setLoading(true)}
                          >
                            Edit
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`http://localhost:5173/profile/${student.student_id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-400 dark:hover:text-white"
                            role="menuitem"
                            onClick={() => setLoading(true)}
                          >
                            View
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DataList.propTypes = {
  setLoading: PropTypes.func.isRequired,
  selectedGradeLevel: PropTypes.string,
  searchQuery: PropTypes.string,
};

export default DataList;
