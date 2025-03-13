import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors({ origin: 'https://jdominator2010.github.io' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});
app.use('/add', limiter);

// POST route to add data
app.post('/add', async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
        res.json({ message: 'User added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
