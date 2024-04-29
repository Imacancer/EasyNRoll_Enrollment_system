import { useState } from 'react';
import EditProfileCard from '../components/editprofile';
import GradeTable from '../components/gradetable';
import Navbar from '../components/navbar';
import EditModal from '../components/editmodal';
import { useParams } from 'react-router-dom';
import {toast, Toaster } from 'react-hot-toast';

const EditProfile = () => {
    const { studentId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStsubId, setSelectedStsubId] = useState(null); // Define selectedStsubId state

    const handleToggleEditModal = (stsubId) => {
        setSelectedStsubId(stsubId); // Update selectedStsubId when user clicks Edit button
        setShowEditModal(true);
    };

    const reloadPage = () => {
        toast.success('Grade Updated Successfully');
        window.location.reload();
    };
    

    return (
        <div className="flex flex-col h-screen">
            <Navbar setLoading="true"/>
            <div className="flex-1 overflow-y-auto">
                <Toaster position='top-center' />
                <div className="w-full bg-cover bg-center">
                    <EditProfileCard studentId={studentId} />
                </div>
                <div className="mt-auto w-full">
                    {/* Pass selectedStsubId and handleToggleEditModal as props to GradeTable */}
                    <GradeTable studentId={studentId} handleToggleEditModal={handleToggleEditModal} />
                </div>
            </div>
            {showEditModal && <EditModal stsubId={selectedStsubId} setShowEditModal={setShowEditModal} onEditSuccess={reloadPage} />} {/* Render EditModal conditionally */}
        </div>
    );
}

export default EditProfile;
