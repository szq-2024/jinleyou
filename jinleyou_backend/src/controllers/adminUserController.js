// controllers/adminUserController.js
import { pool } from '../config/db.js';

// 修改获取用户列表方法（添加搜索功能）
export const getUsersList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, search } = req.query;
        const offset = (page - 1) * pageSize;

        // 构建搜索条件
        let whereClause = '';
        const params = [];

        if (search) {
            whereClause = `WHERE 
                username LIKE ? OR 
                nickname LIKE ? OR 
                phone LIKE ?`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // 获取分页数据
        const [users] = await pool.query(
            `SELECT
                userId,
                username,
                nickname,
                avatar,
                gender,
                bio,
                phone,
                role,
                createdAt,
                last_login
             FROM users
             ${whereClause}
             ORDER BY userId DESC
             LIMIT ? OFFSET ?`,
            [...params, Number(pageSize), offset]
        );
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const processedUsers = users.map(user => ({
            ...user,
            avatar: user.avatar ? `${baseUrl}${user.avatar}` : null
        }));
        // 获取总数（带相同搜索条件）
        const [total] = await pool.query(
            `SELECT COUNT(*) AS total 
             FROM users 
             ${whereClause}`,
            params
        );

        res.json({
            code: 200,
            data: {
                list: processedUsers,
                pagination: {
                    total: total[0].total,
                    currentPage: Number(page),
                    pageSize: Number(pageSize)
                }
            }
        });
    } catch (error) {
        console.error(`[用户列表] 错误: ${error.message}`);
        res.status(500).json({ code: 500, message: '获取用户列表失败' });
    }
};

// 更新用户信息
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateFields = req.body;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // 新增调试代码
        if (updateFields.avatar) {
            // 清理URL基础路径但保留/public目录
            const cleanPattern = new RegExp(`^${baseUrl}`, 'i');
            let processedAvatar = updateFields.avatar
                .replace(cleanPattern, '')
                .replace(/^(https?:\/\/[^/]+)?\/?/i, '');

            // 规范化路径格式
            if (!processedAvatar.startsWith('public/')) {
                processedAvatar = `public/${processedAvatar}`.replace(/\/+/g, '/');
            }

            // 确保路径格式正确
            updateFields.avatar = processedAvatar.startsWith('/')
                ? processedAvatar
                : `/${processedAvatar}`;
        }

        const allowedFields = {
            username: 'string',
            phone: 'string',
            role: ['user', 'admin'],
            nickname: 'string',
            avatar: 'string',
            gender: [0, 1, 2],
            bio: 'string',
        };

        const setClauses = [];
        const params = [];

        Object.entries(updateFields).forEach(([key, value]) => {
            if (key in allowedFields) {
                // 类型验证
                const expectedType = allowedFields[key];
                if (Array.isArray(expectedType)) {
                    if (!expectedType.includes(value)) return;
                } else if (typeof value !== expectedType) {
                    return;
                }

                // 特殊处理
                if (key === 'isDeleted') {
                    value = value ? 1 : 0;
                }

                setClauses.push(`${key} = ?`);
                params.push(value);
            }
        });

        if (setClauses.length === 0) {
            return res.status(400).json({ code: 400, message: '无有效更新字段' });
        }

        params.push(userId);

        const [result] = await pool.query(
            `UPDATE users
             SET ${setClauses.join(', ')}
             WHERE userId = ?`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        res.json({ code: 200, message: '用户信息更新成功' });
    } catch (error) {
        console.error(`[更新用户] 错误: ${error.message}`);

        if (error.code === 'ER_DUP_ENTRY') {
            const message = error.message.includes('phone')
                ? '手机号已存在'
                : '用户名已存在';
            return res.status(400).json({ code: 400, message });
        }

        res.status(500).json({ code: 500, message: '更新用户信息失败' });
    }
};
//上传头像
export const updateUserAvatar = async (req, res) => {
    try {
        console.log('[后端调试] 上传请求接收:', {
            params: req.params,
            file: req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null,
            headers: req.headers
        })
        if (!req.file) {
            return res.status(400).json({ code: 400, message: '请上传图片文件' });
        }

        const { userId } = req.params;
        const filePath = `/public/uploads/${req.file.filename.replace(/\\/g, '/')}`;

        // 更新用户头像字段
        const [result] = await pool.query(
            `UPDATE users SET avatar = ? WHERE userId = ?`,
            [filePath, userId]
        );

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fullUrl = `${baseUrl}${filePath}`

        res.json({
            code: 200,
            message: '头像上传成功',
            data: {
                avatarUrl: fullUrl
            }
        });
    } catch (error) {
        console.error('[后端调试] 上传异常:', {
            message: error.message,
            stack: error.stack,
            receivedFile: req.file
        })

        // 处理文件类型错误
        if (error.message.includes('图片文件')) {
            return res.status(400).json({ code: 400, message: error.message });
        }

        res.status(500).json({ code: 500, message: '头像上传失败' });
    }
};
// 删除用户（软删除）
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // 改为直接删除数据库记录
        const [result] = await pool.query(
            `DELETE FROM users
             WHERE userId = ?`,
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '用户不存在' });
        }

        res.json({ code: 200, message: '用户已永久删除' });
    } catch (error) {
        console.error(`[删除用户] 错误: ${error.message}`);
        res.status(500).json({ code: 500, message: '删除用户失败' });
    }
};