
import { useState, useEffect } from 'react';
import axios from 'axios';
import imageSample from '../assets/VKang242604.jpg'

const Test = () => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4001/students')
      .then(response => {
        if (response.status === 200 && response.data.students.length > 0) {
          const firstStudent = response.data.students[5]; // Assuming you want the first student's image
          setStudentId(firstStudent.student_id);
          console.log('Student ID:', firstStudent.student_id);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
      });
  }, []);

  console.log('Student ID:', studentId); // Log student ID for debugging

  if (error) {
    return <div>Error fetching data: {error.message}</div>; // Render error message if there's an error
  }

  if (!studentId) {
    return <div>No student data available</div>; // Render message if no student data is available
  }

  const imagePath = `/src/assets/${studentId}.jpg`;
  console.log('Image path:', imagePath);

  return (
    <div className='flex items-center justify-center h-screen'>
        <img src={imagePath} alt="Student" className="h-10 w-10" />
        <img src={imageSample} alt="Sample" className="h-10 w-10" />
    </div>
  );
}

export default Test;
