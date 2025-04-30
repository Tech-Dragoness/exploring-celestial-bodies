import express, { json } from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors()); // Restrict to frontend URL in production
app.use(json());
app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1n6WlAd-kYA1u_UzIFq2eT0a6A7ZrRYL_iRSyk9q6f9s';
const sheetName = 'Users';

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetTitles = response.data.sheets.map(sheet => sheet.properties.title);
        res.json({
            status: 'ok',
            message: 'Google Sheets API is accessible',
            tabs: sheetTitles,
        });
    } catch (error) {
        console.error('Health check failed:', {
            message: error.message,
            code: error.code,
            details: error.errors,
        });
        res.status(500).json({
            status: 'error',
            message: 'Failed to access Google Sheets API',
            error: error.message,
        });
    }
});

// Endpoint to check if the email already exists
app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required', check: false });
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:F`,
        });

        const rows = response.data.values || [];
        if (rows.length === 0) {
            return res.json({ exists: false });
        }

        const headers = rows[0];
        const emailIndex = headers.indexOf('Email');
        if (emailIndex === -1) {
            throw new Error('Email column not found in sheet');
        }

        const emailExists = rows.slice(1).some(row => row[emailIndex] === email);
        res.json({ exists: emailExists });
    } catch (error) {
        console.error('Error checking email:', {
            message: error.message,
            code: error.code,
            details: error.errors,
        });
        res.status(500).json({
            message: `Failed to check email: ${error.message}`,
            check: false,
        });
    }
});

// Endpoint to check if the phone number already exists
app.post('/check-phone', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required', check: false });
    }

    try {
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
        console.error('Error checking phone:', {
            message: error.message,
            code: error.code,
            details: error.errors,
        });
        res.status(500).json({
            message: `Failed to check phone: ${error.message}`,
            check: false,
        });
    }
});

// Endpoint to handle registration
app.post('/register', async (req, res) => {
    const { name, email, dob, phone, password } = req.body;
    if (!name || !email || !dob || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required', check: false });
    }

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
            check: true,
        });
    } catch (error) {
        console.error('Error during registration:', {
            message: error.message,
            code: error.code,
            details: error.errors,
        });
        res.status(500).json({
            message: `Failed to register: ${error.message}`,
            check: false,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
