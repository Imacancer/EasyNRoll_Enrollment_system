import EnrollmentForm from "../components/enrollmentform";
import Navbar from "../components/navbar";
import bgImage from '../images/mamb.png'

const Enrollment = () => {
    return (
        <div>
            <Navbar/>
            <div className="fixed top-15 left-0 w-full h-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url(${bgImage})`}}>
                <EnrollmentForm/>
            </div>
        </div>
    );
}
 
export default Enrollment;