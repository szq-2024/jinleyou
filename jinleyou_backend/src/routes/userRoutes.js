// routes/userRoutes.js
import express from 'express';
import { expressjwt } from 'express-jwt';
import { pool } from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 保持原目录不变
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        // 关键修改：保留原始文件扩展名
        const ext = path.extname(file.originalname); // 获取扩展名（如 .jpg）
        const uniqueName = Date.now() + '-' + Math.random().toString(36).slice(2) + ext; // 生成带扩展名的唯一文件名
        cb(null, uniqueName); // 例如："1623456789000-abc123.jpg"
    }
});

// 2. 替换原 upload 配置
const upload = multer({ storage }); // ✅ 使用自定义存储配置
const router = express.Router();

// 新增JWT验证中间件
const authenticate = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: req => req.headers.authorization?.split(' ')[1]
});

router.post('/update', authenticate, async (req, res) => {
    try {
        // 设置默认值处理undefined
        const {
            nickname = '',
            avatar = null,
            gender = 0,
            bio = ''
        } = req.body;

        // 调试日志（可选）
        console.log('Update params:', {  nickname, avatar, gender, bio });

        const userId = req.auth.userId;

        // 确保gender为数值类型
        const genderNumber = Number(gender) || 0;

        const [result] = await pool.execute(
            `UPDATE users SET
            nickname = ?,
            avatar = ?, 
            gender = ?, 
            bio = ?
            WHERE userId = ?`,
            [nickname, avatar, genderNumber, bio, userId]
        );

        res.json({ code: 200, msg: '更新成功' });
    } catch (err) {
        console.error('更新失败:', err);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});
// 修改 /info 路由
router.get('/info', authenticate, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const [rows] = await pool.execute(
            'SELECT nickname, avatar, gender, bio FROM users WHERE userId = ?',
            [userId]
        );

        const userInfo = rows[0];
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        userInfo.avatar = userInfo.avatar ? `${baseUrl}${userInfo.avatar}` : null;
        // 直接返回数据库存储的路径（例如：/public/uploads/filename.jpg）
        res.json({
            code: 200,
            data: userInfo // 直接返回原始avatar路径
        });
    } catch (err) {
        console.error('获取用户信息失败:', err);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ code: 400, msg: '请选择文件' });
        }
        // 返回相对路径
        const fileUrl = `/public/uploads/${req.file.filename}`;
        res.json({ code: 200, url: fileUrl });
    } catch (err) {
        console.error('文件上传失败:', err);
        res.status(500).json({ code: 500, msg: '上传失败' });
    }
});
export default router;