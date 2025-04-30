import express, { json } from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
const port = process.env.PORT || 3000; // Use Render's PORT or default to 3000

// Enable CORS and JSON parsing
app.use(cors());
app.use(json());
app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Read from environment variable
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI'; // Replace with your Google Sheet ID
const sheetName = 'Users'; // Replace with your sheet's tab name if different (e.g., 'Users')

// Endpoint to check if the email already exists
app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    try {
        // Fetch data from Google Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:F`, // Adjust if columns differ
        });

        const rows = response.data.values || [];
        if (rows.length === 0) {
            return res.json({ exists: false });
        }

        const headers = rows[0]; // First row is headers
        const emailIndex = headers.indexOf('Email');
        if (emailIndex === -1) {
            throw new Error('Email column not found in sheet');
        }

        const emailExists = rows.slice(1).some(row => row[emailIndex] === email);
        res.json({ exists: emailExists });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'An error occurred while checking email.' });
    }
});

// Endpoint to check if the phone number already exists
app.post('/check-phone', async (req, res) => {
    const { phone } = req.body;

    try {
        // Fetch data from Google Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:F`,
        });

        const rows = response.data.values || [];
        if (rows.length === 0) {
            return res.json({ exists: false });
        }

        const headers = rows[0];
        const phoneIndex = headers.indexOf('PhoneNumber');
        if (phoneIndex === -1) {
            throw new Error('PhoneNumber column not found in sheet');
        }

        const phoneExists = rows.slice(1).some(row => row[phoneIndex] === phone);
        res.json({ exists: phoneExists });
    } catch (error) {
        console.error('Error checking phone:', error);
        res.status(500).json({ message: 'An error occurred while checking phone.' });
    }
});

// Endpoint to handle registration
// Endpoint to handle registration
app.post('/register', async (req, res) => {
    const { name, email, dob, phone, password } = req.body;

    try {
        console.log('Registration data received:', req.body);
        const timestamp = new Date().toLocaleString();
        const values = [[timestamp, name, email, dob, phone, password]];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:F`,
            valueInputOption: 'RAW',
            resource: { values },
        });

        console.log('Google Sheet updated successfully.');
        res.json({
            message: `Welcome ${name}, let's start our incredible journey through the celestial!!!`,
            check: true // Added check flag
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            message: 'An error occurred while registering. Please try again.',
            check: false // Added check flag
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
