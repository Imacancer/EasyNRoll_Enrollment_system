const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMzkyNzkxMywiaWF0IjoxNzEzOTI3OTEzfQ.2yiobs6Mm-HjlSg6A_BUT7XrnUDOjLZYAYGtNOIGkVQ';

const app = express();
const PORT = 4001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            // Store image files in the './uploads' directory
            cb(null, '../client/src/assets');
        } else {
            // Exclude form137 and clearance files from storing in './uploads'
            cb(null, './trash'); // Empty destination to prevent storing on disk
        }
    },
    filename: (req, file, cb) => {
        const studentId = req.params.studentId; // Assuming student_id is passed as a parameter in the request URL
        const extension = path.extname(file.originalname);
        const filename = `${studentId}${extension}`; // Set the filename based on student_id
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let counter = 0;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/submit-form/:studentId', upload.fields([
    { name: 'clearance', maxCount: 1 },
    { name: 'form_137', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {

    // console.log('Request Body:', req.body);
    // console.log('Request Files:', req.files);

    const {
        student_id,
        first_name,
        last_name,
        address,
        contact_number,
        mother_name,
        father_name,
        age,
        grade_level,
        enrolled,
        general_average,
        
        // Add other form fields as needed
    } = req.body;

        const hasClearance = req.files && req.files.clearance;
        const hasForm137 = req.files && req.files.form_137;
        const hasImage = req.files && req.files.image;

        // Determine values to be stored in the database based on submission
        const clearanceNumber = hasClearance ? 1 : 0;
        const form137Number = hasForm137 ? 1 : 0;

        const imagePath = hasImage ? req.files.image[0].path : null;

        const enrolledValue = enrolled ? 1 : 0;

    try {
        
        // Get a connection to the database


        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        // Begin a transaction


        // Find all sections related to the selected grade level
        const sectionResult = await connection.execute(
            'SELECT SECTION_ID FROM section WHERE GRADELEVEL_ID = :gradeLevel',
            [grade_level]
        );

        // Extract section IDs from the query result
        const sections = sectionResult.rows.map(row => row[0]);

        // Randomize sections
        const randomizedSections = shuffleArray(sections);

        // Select a random section for the student
        const selectedSection = randomizedSections[0]; // You can modify this to select any specific section

        // Find the corresponding room_id for the selected section
        const roomResult = await connection.execute(
            'SELECT ROOM_ID FROM room WHERE SECTION_ID = :sectionId',
            [selectedSection]
        );

        // Extract room ID from the query result
        const roomIds = roomResult.rows.map(row => row[0]);

        // Get the room ID corresponding to the selected section
        const selectedRoomId = roomIds[0];

        // Insert student data into the database
        await connection.execute(
            `INSERT INTO students 
            (STUDENT_ID, FIRST_NAME, LAST_NAME, ADDRESS, CONTACT_NUMBER, MOTHER_NAME, FATHER_NAME, AGE, ROOM_ID, GRADELEVEL_ID, ENROLLED, GENERAL_AVERAGE, CLEARANCE, FORM137, SECTION_ID, STUDENTIMAGE) 
            VALUES 
            (:student_id, :first_name, :last_name, :address, :contact_number, :mother_name, :father_name, :age, :room_id, :grade_level, :enrolled, :general_average, :clearance, :form137, :section_id, :image)`,
            {
                student_id,
                first_name,
                last_name,
                address,
                contact_number,
                mother_name,
                father_name,
                age,
                room_id: selectedRoomId,
                grade_level,
                enrolled: enrolledValue,
                general_average,
                clearance: clearanceNumber, // Pass numeric value instead of boolean
                form137: form137Number,
                section_id: selectedSection,
                image: imagePath,
            }
        );

        // Commit the transaction
        await connection.commit();

        // Close the database connection
        await connection.close();

        // Send success response
        res.status(201).send({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Error submitting form');
    }
});
// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

app.get('/grade-levels', async (req,res) => {
    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        const result = await connection.execute('SELECT * FROM gradelevel');

        await connection.close();

        // Extract grade levels from the query result
        const gradeLevels = result.rows.map(row => row[0]); // Assuming grade level is in the first column

        // Send the grade levels as response
        res.send(gradeLevels);
        
    } catch (error) {
        console.error('Error fetching grade levels:', error);
        res.status(500).send('Error fetching grade levels');
    }
});


const base64Encode = (buffer) => {
    return Buffer.from(buffer, 'binary').toString('base64');
};
app.get('/students', async (req, res) => {
    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        const result = await connection.execute(
            `SELECT 
                STUDENT_ID, FIRST_NAME, LAST_NAME, ADDRESS, CONTACT_NUMBER, 
                MOTHER_NAME, FATHER_NAME, AGE, ROOM_ID, GRADELEVEL_ID, 
                ENROLLED, GENERAL_AVERAGE, CLEARANCE, FORM137, SECTION_ID,
                STUDENTIMAGE
            FROM students`
        );

        const students = result.rows.map(row => {
            const student = {};
            for (let i = 0; i < result.metaData.length; i++) {
                const columnName = result.metaData[i].name.toLowerCase();
                student[columnName] = row[i];
            }
            // Convert BLOB data to Base64
            if (student.image) {
                student.image = base64Encode(student.image);
            }
            return student;
        });

        // console.log('Fetched rows:', students);

        await connection.close();
        
        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

app.get('/students/:student_id', async (req, res) => {
    const { student_id } = req.params;

    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        const result = await connection.execute(
            `SELECT 
                s.STUDENT_ID, s.FIRST_NAME, s.LAST_NAME, s.ADDRESS, s.CONTACT_NUMBER, 
                s.MOTHER_NAME, s.FATHER_NAME, s.AGE, s.ROOM_ID, s.GRADELEVEL_ID, 
                s.ENROLLED, s.GENERAL_AVERAGE, s.CLEARANCE, s.FORM137, 
                sec.SECTION_ID, sec.TEACHER_ID, 
                t.FIRST_NAME as TEACHER_FIRST_NAME, t.LAST_NAME as TEACHER_LAST_NAME,
                g.GRADELEVEL_NAME
            FROM students s
            JOIN Section sec ON s.SECTION_ID = sec.SECTION_ID
            LEFT JOIN Teacher t ON sec.TEACHER_ID = t.TEACHER_ID
            LEFT JOIN 
            GRADELEVEL g ON s.GRADELEVEL_ID = g.GRADELEVEL_ID
            WHERE s.STUDENT_ID = :student_id`,
            [student_id]
        );


        const student = {};
        if (result.rows.length > 0) {
            const row = result.rows[0];
            for (let i = 0; i < result.metaData.length; i++) {
                const columnName = result.metaData[i].name.toLowerCase();
                student[columnName] = row[i];
            }
        } else {
            return res.status(404).json({ error: "Student not found" });
        }

        await connection.close();

        res.status(200).json({ student });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Error fetching student');
    }
});

app.get('/fetch-image/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    // Assuming StudentImage column stores the relative file path
    const imagePath = `./uploads/${studentId}.jpg`; // Modify the extension as per your file format

    // Check if the file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).json({ error: 'Image not found' });
        }

        // Serve the image file
        res.sendFile(path.resolve(imagePath));
    });
});


app.post('/students', async (req, res) => {
    const {
        student_id,
        first_name,
        last_name,
        address,
        contact_number,
        mother_name,
        father_name,
        age,
        room_id,
        gradelevel_id,
        enrolled,
        general_average,
        clearance,
        form137,
        section_id
    } = req.body;

    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        await connection.execute(
            `INSERT INTO liscoord.students 
            (student_id, first_name, last_name, address, contact_number, mother_name, father_name, age, room_id, gradelevel_id, enrolled, general_average, clearance, form137, section_id) 
            VALUES 
            (:student_id, :first_name, :last_name, :address, :contact_number, :mother_name, :father_name, :age, :room_id, :gradelevel_id, :enrolled, :general_average, :clearance, :form137, :section_id)`,
            {
                student_id,
                first_name,
                last_name,
                address,
                contact_number,
                mother_name,
                father_name,
                age,
                room_id,
                gradelevel_id,
                enrolled,
                general_average,
                clearance,
                form137,
                section_id
            }
        );

        await connection.commit();

        res.status(201).send({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Error adding student');
    }
});

app.post('/users', async (req, res) => {
    let connection;
    try {
        const { username, pass } = req.body;

        connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        counter++; // Increment the counter for each insert

        const user_id = `Coordinator_${counter}`;

        await connection.execute(
            `INSERT INTO liscoord.users (user_id, username, pass) VALUES (:user_id, :username, :pass)`,
            { user_id, username, pass }
        );

        await connection.commit(); // Commit the transaction

        res.send({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding User:', error);
        if (connection) {
            try {
                await connection.rollback(); // Rollback the transaction if an error occurs
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
        }
        res.status(500).send('Error adding user');
    } finally {
        if (connection) {
            try {
                await connection.close(); // Close the connection
            } catch (closeError) {
                console.error('Error closing connection:', closeError);
            }
        }
    }
});

app.post('/reset-counter', (req, res) => {
    const { value } = req.body;
    counter = value; // Set the counter to the provided value
    res.send({ message: 'Counter reset successfully' });
});

app.post('/login', async (req, res) => {
    const { username, pass } = req.body;

    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        const result = await connection.execute(
            'SELECT * FROM liscoord.users WHERE username = :username AND pass = :pass',
            [username, pass]
        );

        await connection.close();

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Create JWT token
        const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const blacklistedTokens = []; // Declare blacklistedTokens as an array

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log('Received token:', token); // Log the received token

    if (!token) {
        return res.status(403).json({ error: 'Token is missing' });
    }

    if (blacklistedTokens.includes(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err); // Log the error
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

app.post('/logout', verifyToken, (req, res) => {
    const token = req.headers['authorization'];
    // No need to do anything here, the middleware verifyToken already handles the invalidation of the JWT session
    blacklistedTokens.push(token);
    res.send({ message: 'Logged out successfully' });
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Listening to Port ${PORT}`);
});

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Endpoint to add subjects to the subject table
app.post('/add-subjects/:student_id', async (req, res) => {
    const { student_id } = req.params;
    console.log(student_id);
    let connection;
    try {
        // Establish Oracle database connection
        connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        // Fetch student information to get gradelevel_id
        const studentInfoQuery = `
            SELECT GRADELEVEL_ID
            FROM students
            WHERE student_id = :student_id
        `;
        const studentInfoResult = await connection.execute(studentInfoQuery, [student_id]);
        const gradelevel_id  = studentInfoResult.rows[0][0];
        console.log('Result:', studentInfoResult);
        console.log('Gradelevel_id:', gradelevel_id);

        // Define subjects based on gradelevel_id
        let subjects = [];
        if (gradelevel_id === 'grade_7') {
            subjects = [
                "Filipino7",
                "English7",
                "Science7",
                "Math7",
                "ESP7",
                "TLE7",
                "MAPEH7"
            ];
        } else if (gradelevel_id === 'grade_8') {
            subjects = [
                "Filipino8",
                "English8",
                "Science8",
                "Math8",
                "ESP8",
                "TLE8",
                "MAPEH8"
            ];
        } else if (gradelevel_id === 'grade_9') {
            subjects = [
                "Filipino9",
                "English9",
                "Science9",
                "Math9",
                "ESP9",
                "TLE9",
                "MAPEH9"
            ];
        } else if (gradelevel_id === 'grade_10') {
            subjects = [
                "Filipino10",
                "English10",
                "Science10",
                "Math10",
                "ESP10",
                "TLE10",
                "MAPEH10"
            ];
        }

        console.log('Subjects:', subjects);

        // Mock data for teacher IDs for each subject
        const teacherIDs = {
            Filipino7: ["VJang_1", "BAlonzo_4"],
            English7: ["LHyori_2", "JDeLaCruz_7"],
            Science7: ["NTesla_8", "MFaraday_9"],
            Math7: ["CGauss_11", "JMaxwell_10"],
            ESP7: ["SFreud", "JPiaget"],
            TLE7: ["RAtkinson", "MGomez_16"],
            MAPEH7: ["CHeria_17", "CBum_18"],
            Filipino8: ["YLim_19", "MClaire"],
            English8: ["MLuther_21", "JRowling"],
            Science8: ["AEinstein", "INewton_24"],
            Math8: ["MKhwarizmi", "AWafa_26"],
            ESP8: ["IKant_27", "FNietzsche_28"],
            TLE8: ["AVolta_29", "TEdison_30"],
            MAPEH8: ["DJohnson", "MOHearn"],
            Filipino9: ["KDavid_33", "MDefensor_34"],
            English9: ["WShakespeare_35", "EAPoe_36"],
            Science9: ["CDarwin_37", "GMendel_38"],
            Math9: ["GLeibniz_39", "ACayley_40"],
            ESP9: ["ARand_41", "HSidgwick_42"],
            TLE9: ["MDelaCruz_43", "RSison_44"],
            MAPEH9: ["JCastro_45", "KAlapag_46"],
            Filipino10: ["MRicalde_47","CRobles_49"],
            English10: ["MSerene_48", "LSerene_50"],
            Science10: ["MCurie_51", "ANobel_52"],
            Math10: ["LEuler_53", "BPascal_54"],
            ESP10: ["JBentham_55", "JMill_56"],
            TLE10: ["DRitchie_57", "DChamberlin_58"],
            MAPEH10: ["AMate_59", "RMate_60"],
            
            // Add more subjects with teacher IDs here...
        };



        

        // OracleSQL query to insert subjects into the subject table
        const query = `
            INSERT INTO studentsub (STSUB_ID, STUDENT_ID, SUBJECT_ID, GRADELEVEL_ID, TEACHER_ID)
            VALUES (:subID, :studentID, :subjectID, :gradelevelID, :teacherID)
        `;

        // Execute the OracleSQL query for each subject
        
        let insertionResults = [];
        for (const subjectID of subjects) {
            console.log('Inserting subject:', subjectID);
            try {
                const teacherID = getRandomItem(teacherIDs[subjectID]);
                const sub_id = subjectID.slice(0, 3) + subjectID.slice(-1) + student_id;
                const result = await connection.execute(query, {
                    subID: sub_id,
                    studentID: student_id,
                    subjectID,
                    gradelevelID: gradelevel_id,
                    teacherID,
                    
                    
                });
                insertionResults.push(result);
                console.log(`Inserted subject ${subjectID} with teacher ${teacherID} for student ${student_id}`);
            } catch (error) {
                console.error(`Error inserting subject ${subjectID}:`, error);
            }
        }
        console.log('Insertion Result:', insertionResults)
        

        await connection.commit();
        
        res.status(200).json({ success: true, message: 'Subjects added successfully' });
    } catch (error) {
        console.error('Error adding subjects:', error);
        res.status(500).json({ success: false, message: 'Failed to add subjects' });
    }
});

app.get('/grades/:student_id', async (req, res) => {
    const { student_id } = req.params;

    try {
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        const result = await connection.execute(
            `SELECT 
                stsub_id,
                subject_id,
                grade,
                teacher_id
            FROM studentsub
            WHERE student_id = :student_id`,
            [student_id]
        );

        const grades = [];
        if (result.rows.length > 0) {
            for (const row of result.rows) {
                const [stsub_id, subject_id, grade, teacher_id] = row;
                grades.push({ stsub_id, subject_id, grade, teacher_id });
            }
        } else {
            return res.status(404).json({ error: "Grades not found for the student" });
        }

        await connection.close();

        res.status(200).json({ grades });
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).send('Error fetching grades');
    }
});

app.put('/update-grade/:stsubId', async (req, res) => {
    const stsubId = req.params.stsubId;
    const { grade } = req.body;

    try {
        // Establish connection to Oracle DB
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        // Update grade in the database
        const result = await connection.execute(
            `UPDATE studentsub SET GRADE = :grade WHERE STSUB_ID = :stsubId`,
            { grade, stsubId },
            { autoCommit: true }
        );

        // Release the Oracle DB connection
        await connection.close();

        // Check if any rows were updated
        if (result.rowsAffected && result.rowsAffected === 1) {
            res.status(200).json({ message: 'Grade updated successfully' });
        } else {
            res.status(404).json({ error: 'No record found for the provided STSUB_ID' });
        }
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/update-info/:student_id', async (req, res) => {
    const { student_id } = req.params;
    const { first_name, last_name, address } = req.body;
    console.log("Request Body:", req.body);

    try {
        // Establish connection to Oracle DB
        const connection = await oracledb.getConnection({
            user: 'liscoord',
            password: '123',
            connectString: 'localhost/orcl'
        });

        console.log('SQL Query:', `UPDATE students SET first_name = :first_name, last_name = :last_name, address = :address WHERE student_id = :student_id`);
        console.log('Query Parameters:', { first_name, last_name, address, student_id })

        // Update the student info in the database
        const result = await connection.execute(
            `UPDATE students SET first_name = :first_name, last_name = :last_name, address = :address WHERE student_id = :student_id`,
            { first_name, last_name, address, student_id },
            { autoCommit: true } // Commit the transaction
        );

        // Release the Oracle DB connection
        await connection.close();

        // Check if any rows were updated
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).send('Student information updated successfully');
        } else {
            res.status(200).send('Student still Found i just change the Log');
        }
    } catch (error) {
        console.error('Error updating student information:', error.message);
        res.status(500).send('Internal server error');
    }
});
