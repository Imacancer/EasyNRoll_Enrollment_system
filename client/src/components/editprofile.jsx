import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const EditProfileCard = () => {

    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Student ID from URL:", studentId);
        // You can add additional checks or validations here
    }, [studentId]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:4001/students/${studentId}`);
                setStudent(response.data.student);
                console.log("Data:", response.data.student);
            } catch (error) {
                setError('Error fetching student data');
            }
        };
        
        fetchStudent();
    }, [studentId]);

    const handleChange = (fieldName, value) => {
        console.log("Field Name:", fieldName);
        console.log("Value:", value);
        setStudent(prevStudent => ({
            ...prevStudent,
            [fieldName]: value
        }));
        console.log(student);
    };

    const handleSubmit = async () => {
        try {
            const { first_name, last_name, address } = student;
            const studentId = student.student_id;
            await axios.put(`http://localhost:4001/update-info/${studentId}`, { first_name, last_name, address });
            console.log('Student information updated successfully!');
            window.location.reload(); // Reload the page after successful update
        } catch (error) {
            console.error('Error updating student information:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <section className="w-full overflow-hidden dark:bg-gray-900">
            <div className="flex flex-col">
                {/* Cover Image */}
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080" alt="User Cover"
                    className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]" />

                {/* Profile Image */}
                <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
                    <div className="relative ">
                        {student && (
                            <img
                                src={`/src/assets/${student.student_id}.jpg`}
                                alt="Student"
                                className="rounded-full overflow-hidden max-w-full max-h-40 border-2 border-transparent dark:hover:border-gradient-to-br from-green-800 to-blue-800 transition duration-1000"
                                style={{ maxHeight: '150px', maxWidth:'200px' }}
                            />
                        )}
                        
                        <div className="absolute inset-0 border-2 border-transparent rounded-full ring-2 ring-gradient-to-br from-green-800 to-blue-800 hover:ring-0 hover:border-transparent transition duration-1000"></div>
                    </div>
                    {/* FullName */}
                    {student && (
                        <h1
                            className="w-full text-left my-14 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-4xl sm:text-3xl xs:text-xl font-serif font-bold">
                            {student.first_name} {student.last_name}</h1>
                    )}

                </div>

                <div
                    className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                    {/* Description */}
                    {/* Detail */}
                    <div className="w-full my-auto py-32 flex flex-col justify-center gap-2">
                        <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    <div className="flex flex-col pb-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">First Name</dt>
                                        <input 
                                            type="text"
                                            className="text-lg font-semibold border-gray-300 focus:outline-none bg-transparent" 
                                            value={student.first_name} 
                                            onChange={(e) => handleChange("first_name", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Address</dt>
                                        <input 
                                            type="text"
                                            className="text-lg font-semibold border-gray-300 focus:outline-none bg-transparent" 
                                            value={student.address} 
                                            onChange={(e) => handleChange("address", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Section</dt>
                                        <dd className="text-lg font-semibold">{student.section_id}</dd>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Student ID</dt>
                                        <dd className="text-lg font-semibold">{student.student_id}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="w-full">
                                <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                    <div className="flex flex-col pb-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Last Name</dt>
                                        <input 
                                            type="text"
                                            className="text-lg font-semibold border-gray-300 focus:outline-none bg-transparent" 
                                            value={student.last_name} 
                                            onChange={(e) => handleChange("last_name", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Grade Level</dt>
                                        <dd className="text-lg font-semibold">{student.gradelevel_name}</dd>
                                    </div>
                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Room Id</dt>
                                        <dd className="text-lg font-semibold">{student.room_id}</dd>
                                    </div>

                                    <div className="flex flex-col py-3">
                                        <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Adviser</dt>
                                        <dd className="text-lg font-semibold">{`${student.teacher_first_name || ""} ${student.teacher_last_name || ""}`}</dd>
                                    </div>
                                    
                                </dl>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Save Changes
                        </button>
                    
                    </div>
                </div>
            </div>
    </section>
    );
}

EditProfileCard.propTypes = {
    studentId: PropTypes.string.isRequired,
};
 
export default EditProfileCard;
