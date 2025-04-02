import express, { json } from "express";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

// Enable CORS for specific origin
const corsOptions = {
    origin: 'https://tech-dragoness.github.io',  // Allow your GitHub Pages domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  };

if (!process.env.SPREADSHEET_ID || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("❌ Missing .env variables! Make sure SPREADSHEET_ID and GOOGLE_APPLICATION_CREDENTIALS are set.");
    process.exit(1); // Stop execution
}

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to service account JSON file
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.SPREADSHEET_ID; // Store in .env

// Enable CORS with options
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(json());
app.use(express.json()); // Middleware to parse JSON

// Helper function to fetch Google Sheets data
async function getSheetData(sheetName) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });

        const rows = response.data.values;
        if (!rows || rows.length < 2) return []; // Return empty array if sheet has no data

        const headers = rows[0];
        return rows.slice(1).map(row => 
            Object.fromEntries(headers.map((key, i) => [key, row[i] || ""]))
        );
    } catch (error) {
        console.error(`Error fetching sheet data (${sheetName}):`, error);
        return []; // Return empty array on error
    }
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
