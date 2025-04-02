import express, { json } from "express";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;
const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_API_KEY });
const spreadsheetId = process.env.SPREADSHEET_ID; // Store in .env

// Enable CORS and JSON parsing
app.use(cors());
app.use(json());

// Helper function to fetch Google Sheets data
async function getSheetData(sheetName) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: sheetName,
    });
    const rows = response.data.values;
    const headers = rows[0];
    return rows.slice(1).map(row => Object.fromEntries(headers.map((key, i) => [key, row[i]])));
}

// Check if email exists
app.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const data = await getSheetData("Users"); // Adjust sheet name
        const emailExists = data.some(row => row.Email === email);
        res.json({ exists: emailExists });
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Check if phone exists
app.post('/check-phone', async (req, res) => {
    try {
        const { phone } = req.body;
        const data = await getSheetData("Users");
        const phoneExists = data.some(row => row.PhoneNumber === phone);
        res.json({ exists: phoneExists });
    } catch (error) {
        console.error("Error checking phone:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Handle user registration
app.post('/register', async (req, res) => {
    try {
        const { name, email, dob, phone, password } = req.body;
        const data = await getSheetData("Users");

        if (data.some(row => row.Email === email || row.PhoneNumber === phone)) {
            return res.status(400).json({ message: "Email or phone already exists." });
        }

        const timestamp = new Date().toLocaleString();

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Users",
            valueInputOption: "RAW",
            requestBody: { values: [[timestamp, name, email, dob, phone, password]] },
        });

        res.json({ message: `Welcome ${name}, let's start our incredible journey through the celestial!` });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Registration failed." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
