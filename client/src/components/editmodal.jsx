import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const EditModal = ({ stsubId, setShowEditModal, onEditSuccess }) => {
    const [gradeValue, setGradeValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // Send PUT request to update the grade
            const response = await axios.put(`http://localhost:4001/update-grade/${stsubId}`, {
                grade: gradeValue
            });

            if (response.status === 200) {
                // Grade updated successfully
                console.log('Grade updated successfully');
                closeModal();
                
                onEditSuccess();
            } else {
                console.error('Failed to update grade:', response.data.error);
            }
        } catch (error) {
            console.error('Error updating grade:', error.message);
        }
    };

    const closeModal = () => {
         setShowEditModal(false);
        
        const modal = document.getElementById('editgrade-modal');
        modal.classList.add('hidden');
    };

    return (

        <div id="editgrade-modal" className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${stsubId ? '' : 'hidden'}`}>
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 max-w-md w-full">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Grade
                    </h3>
                    <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={closeModal}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                
                <div className="p-4 md:p-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="grade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grade for {'Subject Name'}</label>
                            <input type="number" name="grade" id="grade" value={gradeValue} onChange={(e) => setGradeValue(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter grade" required />
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit</button>
                    </form>
                </div>
            </div>
        </div> 
    );
}

EditModal.propTypes = {
    stsubId: PropTypes.string.isRequired,
    setShowEditModal: PropTypes.func.isRequired,
    onEditSuccess: PropTypes.func.isRequired,
};
 
export default EditModal;
