import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import EditModal from './editmodal';

const GradeTable = ({ studentId, handleToggleEditModal }) => {
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);
    const [selectedStsubId, setSelectedStsubId] = useState(null);
    const dropdownRef = useRef(null);

    const toggleEditModal = (stsubId) => {
        setSelectedStsubId(stsubId);
        handleToggleEditModal(stsubId); // Toggle modal visibility
        console.log('stsubId:', stsubId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                event.target.tagName !== 'A'
            ) {
                handleToggleEditModal(null); // Close the edit modal
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleToggleEditModal]);

    useEffect(() => {
        axios.get(`http://localhost:4001/grades/${studentId}`)
            .then(response => {
                if (response.status === 200) {
                    setGrades(response.data.grades);
                }
            })
            .catch(error => {
                console.error('Error fetching grades:', error);
                setError(error);
            });
    }, [studentId]);

    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    return (
        <section className="w-full overflow-hidden dark:bg-gray-900">
            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Subject ID</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Grade</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Teacher ID</th>
                                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium">Edit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                    {grades.map((grade, index) => (
                                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{grade.subject_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{grade.grade}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{grade.teacher_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                <button
                                                    onClick={() => toggleEditModal(grade.stsub_id)}
                                                    type="button"
                                                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none dark:text-black focus:ring-gray-50 dark:bg-gray-100 dark:hover:bg-gray-300 dark:focus:ring-gray-50"
                                                    aria-haspopup="true"
                                                    aria-expanded="true"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {selectedStsubId && (
                <>
                    <EditModal stsubId={selectedStsubId} />
                </>
            )}
        </section>
    );
};

GradeTable.propTypes = {
    studentId: PropTypes.string.isRequired,
    handleToggleEditModal: PropTypes.func.isRequired,
};

export default GradeTable;
