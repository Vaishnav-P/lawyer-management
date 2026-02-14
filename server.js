
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Users
app.post('/users', async (req, res) => {
    const { email, name, password, role } = req.body;
    try {
        const user = await prisma.user.create({
            data: { email, name, password, role },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Don't send the password back
        const { password: _, ...userWithoutPassword } = user;
        res.json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cases
app.post('/cases', async (req, res) => {
    const { title, description, clientId } = req.body;
    try {
        const newCase = await prisma.case.create({
            data: { title, description, clientId, status: 'open' },
        });
        res.json(newCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/cases/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, lawyerId } = req.body;
    try {
        const updatedCase = await prisma.case.update({
            where: { id: parseInt(id) },
            data: { title, description, status, lawyerId: lawyerId ? parseInt(lawyerId) : undefined },
        });
        res.json(updatedCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/cases/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.case.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Case deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/cases', async (req, res) => {
    try {
        const cases = await prisma.case.findMany({ include: { client: true, lawyer: true } });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
