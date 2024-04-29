import { useState,useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        pass: ''
    });

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        setShowForm(true);
    }, []);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/login', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            toast.success('Logged in successfully');
            // Redirect or perform further actions upon successful login
            navigate('/homepage');
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Failed to log in');
        }
    };

    return (
        <div className={`bg-white shadow-lg rounded-lg p-8 max-w-sm w-full items-center justify-center transition-transform transition-opacity ${showForm ? 'opacity-100 transform translate-y-0 duration-700' : 'opacity-0 transform -translate-y-full'}`} style={{ marginTop: showForm ? '0' : '-50vh' }}>
            <Toaster position="bottom-center"/>
            <div className="flex items-center font-montserrat font-bold text-2xl text center justify-center mb-10">
                <span style={{ color: '#D04E4E' }}>Dep</span>
                <span style={{ color: '#0f22D1' }}>Ed</span>
                <span style={{ color: '#D04E4E' }}>Easy</span>
                <span style={{ color: '#080808' }}>NRoll</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 text-black">Your username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Coordinator Username" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input type="password" id="password" name="pass" value={formData.pass} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="password" required />
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AdminForm;
