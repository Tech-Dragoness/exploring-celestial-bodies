import express, { json } from "express";
import cors from "cors";
import xlsx from 'xlsx';

const app = express();
const port = 3000; // Define the port variable

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(json());
app.use(express.json()); // Middleware to parse JSON

// Path to your Excel file
const excelFilePath = 'https://docs.google.com/spreadsheets/d/1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI/edit?usp=sharing&ouid=100281797499945970122&rtpof=true&sd=true'; // Update if needed

let Check=false;

// Endpoint to check if the email already exists
app.post('/check-email', (req, res) => {
    const { email } = req.body;
    
    try {
        const workbook = xlsx.readFile(excelFilePath);
        const sheet = workbook.Sheets[workbook.SheetNames[2]]; // Assuming the data is in the 3rd sheet
        const sheetData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        // Check if email exists
        const emailExists = sheetData.some(row => row.Email === email);
        res.json({ exists: emailExists });
    } catch (error) {
        console.error("Error while checking email:", error);
        res.status(500).json({ message: "An error occurred while checking email." });
    }
});

// Endpoint to check if the phone number already exists
app.post('/check-phone', (req, res) => {
    const { phone } = req.body;
    const workbook = xlsx.readFile('../Database.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[2]]; // Assuming data is in the 3rd sheet
    const sheetData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    // Check if the phone number exists
    const phoneExists = sheetData.some(row => row.PhoneNumber === phone);
    res.json({ exists: phoneExists });
});

// Endpoint to handle registration
app.post('/register', (req, res) => {
    const { name, email, dob, phone, password } = req.body;
    
    try {
        console.log('Registration data received:', req.body);
        
        // Read the existing Excel file
        const workbook = xlsx.readFile(excelFilePath);
        console.log('Excel file loaded successfully.');

        const sheetName = workbook.SheetNames[2]; // 3rd sheet (index 2)
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const sheetData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        console.log('Original sheet data:', sheetData);

        // Get the current timestamp
        const timestamp = new Date().toLocaleString();

        // Add new data
        sheetData.push({
            RegisteredDateTime: timestamp,
            Name: name,
            Email: email,
            DateOfBirth: dob,
            PhoneNumber: phone,
            Password: password
        });

        console.log('Updated sheet data:', sheetData);

        // Convert updated data back to the sheet
        const updatedSheet = xlsx.utils.json_to_sheet(sheetData);

        // Replace the old sheet with the updated sheet
        workbook.Sheets[sheetName] = updatedSheet;

        // Write the updated workbook back to the file
        xlsx.writeFile(workbook, excelFilePath);
        console.log('Excel file updated successfully.');
        Check=true;

        res.json({ message: `Welcome ${name}, let's start our incredible journey through the celestial!!!` });
    } catch (error) {
        console.error("Error during registration:", error);
        Check=false;
        res.status(500).json({ message: "An error occurred while registering. Please try again.", check: Check });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
