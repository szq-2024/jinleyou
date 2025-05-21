import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import authRoutes from './routes/authRoutes.js';
import { pool } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import path from 'path';
import scenicRoutes from './routes/scenicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/public', express.static('public'));
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'http://43.143.218.51'
        : ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // [!code focus]
    exposedHeaders: ['Authorization']
}));


app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// 数据库连接测试
pool.getConnection()
    .then(() => console.log('Connected to MySQL'))
    .catch(err => console.error('Database connection failed:', err));


// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/travel-plans', travelRoutes);
app.use('/api/guide-services', guideRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/scenic-spots', scenicRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, req, res, next) => {
    console.error('🔥 全局错误捕获:', err.stack); // [!code focus]
    res.status(500).json({ code: 500, msg: '服务器错误' });
});
// 添加测试接口
app.get('/api/debug', async (req, res) => {
    // 1. 手动创建独立连接（绕过连接池）
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // 2. 执行简单查询
    try {
        const [rows] = await conn.query('SELECT 1 + 1 AS result');
        console.log('✅ 手动连接查询结果:', rows);
        res.json({ code: 200, data: rows });
    } catch (err) {
        console.error('🔴 手动连接查询失败:', err.stack); // [!code focus]
        res.status(500).json({ code: 500, msg: '手动连接失败' });
    } finally {
        await conn.end();
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});