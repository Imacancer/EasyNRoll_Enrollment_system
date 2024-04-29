import DataList from "../components/list";
import Navbar from "../components/navbar";
import SearchBar from "../components/search";
import bgImage from '../images/mamb.png'
import ovImage from '../images/mamb-overlay-1.png'
import { useState } from "react";

const StudentLog = () => {

    const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleGradeLevelFilter = (gradeLevel) => {
        setSelectedGradeLevel(gradeLevel);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
    <div>
        <Navbar/>
        <div className="relative mt-20 " style={{backgroundImage: `url(${bgImage})`}}>
            <div className="absolute top-0 left-0 w-full h-28 bg-gray-200 opacity-100 z-10" style={{backgroundImage: `url(${ovImage})`, backgroundSize: 'cover'}}>
                <SearchBar setGradeLevelFilter={handleGradeLevelFilter} setSearchQuery={handleSearch}/>
            </div>
            <div className="mt-20">
                <DataList selectedGradeLevel={selectedGradeLevel} searchQuery={searchQuery}/>
            </div>
        </div>
        
    </div>
    );
}
 
export default StudentLog;