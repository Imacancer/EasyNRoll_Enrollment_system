
import Navbar from "../components/navbar";
import ProfileCard from "../components/profilecard";
import { useParams } from "react-router-dom";
import ViewGrade from "../components/viewgrade";



const Profile = () => {
    const { studentId } = useParams();
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-1 overflow-y-auto">
                <div className="w-full bg-cover bg-center">
                    <ProfileCard studentId={studentId}/>
                </div>
                <div className="mt-auto w-full">
                    <ViewGrade studentId={studentId} />
                </div>
            </div>
        </div>
    );
}
 
export default Profile;