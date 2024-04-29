import { useState,useEffect } from 'react';
import logoImage from '../images/logo.png';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const EnrollmentForm = () => {

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [gradeLevels, setGradeLevels] = useState([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        contact_number: '',
        mother_name: '',
        father_name: '',
        age: '',
        grade_level:'',
        general_average: '',
        enrolled: true,
        clearance: null,
        form_137: null,
        image: null
    });

    useEffect(() => {
        setShowForm(true);
        fetchGradeLevels(); // Fetch grade levels when component mounts
    }, []);

    const fetchGradeLevels = async () => {
        try {
            const response = await fetch('http://localhost:4001/grade-levels'); // Update with your backend server URL
            if (!response.ok) {
                throw new Error('Failed to fetch grade levels');
            }
            const data = await response.json();
            setGradeLevels(data);
        } catch (error) {
            console.error('Error fetching grade levels:', error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'grade_level') {
            const selectedGradeLevel = gradeLevels.find(level => level.gradeLevel === e.target.value);
            setFormData({ ...formData, grade_level: selectedGradeLevel?.gradeLevelId });
        }
        else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [e.target.name]: file });
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setFormData({ ...formData, image: imageFile });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentId = generateStudentId(formData);

        const formDataToSend = new FormData();
        // Append form data fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        formDataToSend.append('student_id', studentId);

        console.log("Form Data:", formData); // Log the formData

        try {
            const response = await axios.post(`http://localhost:4001/submit-form/${studentId}`, formDataToSend, {...formData, student_id: studentId, grade_level: formData.grade_level}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Add any further handling here, such as showing a success message or redirecting the user
            toast.success('Logged in successfully');
            navigate('/student-logs');
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error, show error message, etc.
        }
    };

    const generateStudentId = (formData) => {
        const { first_name, last_name } = formData;
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().substr(-2); // Get last two digits of the year
        const day = currentDate.getDate().toString().padStart(2, '0'); // Pad day with leading zero if necessary
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month because January is 0
        const initials = first_name.charAt(0) + last_name; // First letter of first_name and last_name
        return initials + year + day + month;
    };

    return (
        <div className={`bg-white shadow-lg rounded-lg p-8 max-w-sm w-full items-center justify-center transition-transform transition-opacity ${showForm ? 'opacity-100 transform translate-y-0 duration-1000' : 'opacity-0 transform -translate-y-full'}`} style={{ marginTop: showForm ? '0' : '-50vh', transform: showForm ? 'translateY(40px)' : 'none', maxHeight: '850px' }}>
            <Toaster position="bottom-center"/>
            <div className="flex items-center font-montserrat font-bold text-2xl text center justify-center mb-10">
                <span style={{ color: '#D04E4E' }}>Dep</span>
                <span style={{ color: '#0f22D1' }}>Ed</span>
                <span style={{ color: '#D04E4E' }}>Easy</span>
                <span style={{ color: '#080808' }}>NRoll</span>
            </div>
            <img src={logoImage} alt="Logo" className="w-20 h-20 mb-2 mt-5 mx-auto" />
            <div className="text-center mb-8 font-montserrat font-semibold text-m">Mambugan National High School</div>
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="first_name" id="first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First Name</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="last_name" id="last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last Name</label>
                    </div>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="address" id="address" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                    <label htmlFor="address" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="number" name="contact_number" id="contact_number" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                    <label htmlFor="contact_number" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contact Number (123-456-7890)</label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="mother_name" id="mother_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="mother_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mothers Name</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="father_name" id="father_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="father_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fathers Name</label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="number" step="any" name="age" id="age" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="age" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Age</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="grade_level"
                            id="grade_level"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                            value={formData.grade_level} // Add value prop to capture selected grade_level
                            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })} // Update formData state with selected grade_level
                        >
                            <option value="" disabled>Select Grade Level</option>
                            {gradeLevels.map((gradeLevel, index) => (
                                <option key={index} value={gradeLevel}>{gradeLevel}</option>
                            ))}
                        </select>
                        <label htmlFor="grade_level" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Grade Level</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="number" name="general_average" id="general_average" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
                        <label htmlFor="general_average" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">General Average</label>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="file" name="clearance" id="clearance" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required onChange={handleFileChange} />
                        <label htmlFor="clearance" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Clearance</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="file" name="form_137" id="form_137" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required onChange={handleFileChange} />
                        <label htmlFor="form_137" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Form 137</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="file" name="image" id="image" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required onChange={handleImageChange} />
                        <label htmlFor="clearance" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Id Photo</label>
                    </div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    
    );
}
 
export default EnrollmentForm;