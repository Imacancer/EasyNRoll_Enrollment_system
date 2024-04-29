import AdminForm from "../components/adminform";
import Navbar from "../components/navbar";
import bgImage from '../images/mamb.png';

const Login = () => {
    return (
        <div>
            <Navbar/>
            <div className="fixed top-15 left-0 w-full h-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url(${bgImage})`}}>
                <AdminForm/>
            </div>
        </div>
     );
}
 
export default Login;