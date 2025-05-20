import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const adminLogin = async (req, res) => {
    const { account, password } = req.body;
    const maskedAccount = account?.replace(/(.{2}).+(.{2})/, '$1***$2');

    try {
        // 基础参数验证
        if (!account || !password) {
            return res.status(400).json({ code: 400, message: '账号和密码不能为空' });
        }

        // 查询管理员用户
        const [users] = await pool.query(
            `SELECT userId, username, password, role 
             FROM users 
             WHERE (username = ? OR phone = ?) 
             AND role = 'admin'`,
            [account, account]
        );

        if (users.length === 0) {
            console.warn(`[管理员登录] 权限拒绝 | 账号: ${maskedAccount}`);
            return res.status(403).json({
                code: 403,
                message: '管理员账号不存在或权限不足'
            });
        }

        // 密码验证
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.warn(`[管理员登录] 密码错误 | 用户ID: ${user.userId}`);
            return res.status(400).json({
                code: 400,
                message: '密码验证失败'
            });
        }

        // 生成管理令牌
        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role,
                adminAuth: true
            },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: '4h' }
        );
        console.log('当前JWT_ADMIN_SECRET:', process.env.JWT_ADMIN_SECRET || '未设置');
        // 返回响应（脱敏处理）
        console.info(`[管理员登录] 成功 | 用户ID: ${user.userId}`);
        res.status(200).json({
            code: 200,
            message: '管理员认证成功',
            data: {
                token,
                adminInfo: {
                    adminId: user.userId,
                    username: user.username,
                    authLevel: 'admin'
                }
            }
        });
    } catch (error) {
        console.error(`[管理员登录] 系统错误: ${error.message}`, {
            stack: error.stack,
            params: {
                account: maskedAccount,
                password: '******'
            }
        });
        res.status(500).json({
            code: 500,
            message: '服务器内部错误'
        });
    }
};