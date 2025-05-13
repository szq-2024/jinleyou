import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new Error('缺少授权头');
        }
        const token = authHeader.replace('Bearer ', '');

        // 使用正确的JWT验证方法
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [users] = await pool.query(
            'SELECT * FROM users WHERE userId = ?',
            [decoded.userId]
        );

        if (!users.length) {
            throw new Error('用户不存在');
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('认证失败:', error);
        res.status(401).json({
            code: 401,
            message: '请先进行身份验证'
        });
    }
};

export default auth;