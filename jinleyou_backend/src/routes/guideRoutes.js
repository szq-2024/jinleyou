import express from 'express';
import { pool } from '../config/db.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// 获取导游服务列表
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT gs.*,
                   u.userId AS user_id,
                   u.nickname,
                   u.avatar,
                   u.gender,
                   DATE_FORMAT(gs.service_date, '%Y-%m-%d') as service_date  
            FROM guide_services gs
                JOIN users u ON gs.user_id = u.userId
            ORDER BY gs.created_at DESC`;

        const [results] = await pool.query(query);

        const transformed = results.map(item => ({
            id: item.id,
            destination: item.destination,  // 新增字段
            serviceDate: item.service_date,
            type: item.type,
            duration: item.duration,
            price: item.price,
            description: item.description,
            createdAt: item.created_at,
            user: {
                id: item.user_id,
                name: item.nickname,
                avatar: item.avatar,
                gender: item.gender
            }
        }));

        res.json({ code: 200, data: transformed });

    } catch (error) {
        console.error('获取导游服务失败:', error);
        res.status(500).json({
            code: 500,
            msg: process.env.NODE_ENV === 'development' ? error.message : '服务器错误'
        });
    }
});

// 修改插入语句和字段校验
router.post('/', auth, async (req, res) => {
    try {
        const { destination, type, duration, price, description, serviceDate } = req.body;

        if (!serviceDate || !/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) {
            return res.status(400).json({ code: 400, msg: '无效的服务日期格式' });
        }

        if (price < 0) {
            return res.status(400).json({ code: 400, msg: '价格需大于0元' });
        }

        const [result] = await pool.query(
            `INSERT INTO guide_services
             (user_id, destination, type, duration, price, description, service_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.userId, destination, type, duration, price, description, serviceDate]
        );

        const [newItem] = await pool.query(
            `SELECT gs.*, u.nickname, u.avatar
             FROM guide_services gs
                      JOIN users u ON gs.user_id = u.userId
             WHERE gs.id = ?`,
            [result.insertId]
        );

        const transformed = {
            ...newItem[0],
            serviceDate: newItem[0].service_date,
            user: {
                id: req.user.userId,
                name: newItem[0].nickname,
                avatar: newItem[0].avatar
            }
        };

        res.json({
            code: 200,
            data: transformed,
            msg: '服务发布成功'
        });

    } catch (error) {
        console.error('创建服务失败:', error);
        res.status(500).json({
            code: 500,
            msg: '服务创建失败'
        });
    }
});

// 获取当前用户发布的导游服务（新增接口）
router.get('/my', auth, async (req, res) => {
    try {
        const query = `
            SELECT gs.*,
                   u.userId AS user_id,
                   u.nickname,
                   u.avatar,
                   u.gender,
                   DATE_FORMAT(gs.service_date, '%Y-%m-%d') as service_date  
            FROM guide_services gs
            JOIN users u ON gs.user_id = u.userId
            WHERE gs.user_id = ?  -- 新增过滤条件
            ORDER BY gs.created_at DESC`;

        const [results] = await pool.query(query, [req.user.userId]);

        // 复用相同的转换逻辑
        const transformed = results.map(item => ({
            id: item.id,
            destination: item.destination,
            serviceDate: item.service_date,
            type: item.type,
            duration: item.duration,
            price: item.price,
            description: item.description,
            createdAt: item.created_at,
            user: {
                id: item.user_id,
                name: item.nickname,
                avatar: item.avatar,
                gender: item.gender
            }
        }));

        res.json({ code: 200, data: transformed });

    } catch (error) {
        console.error('获取用户服务失败:', error);
        res.status(500).json({
            code: 500,
            msg: process.env.NODE_ENV === 'development' ? error.message : '服务器错误'
        });
    }
});

// 原删除路由需要补充权限校验（修改部分）
router.delete('/:id', auth, async (req, res) => {
    try {
        // 先查询记录是否存在且属于当前用户
        const [checkResult] = await pool.query(
            `SELECT user_id FROM guide_services WHERE id = ?`,
            [req.params.id]
        );

        if (checkResult.length === 0) {
            return res.status(404).json({
                code: 404,
                msg: '服务不存在'
            });
        }

        if (checkResult[0].user_id !== req.user.userId) {
            return res.status(403).json({
                code: 403,
                msg: '无权操作此服务'
            });
        }

        // 执行删除操作
        const [result] = await pool.query(
            `DELETE FROM guide_services 
             WHERE id = ?`,
            [req.params.id]
        );

        res.json({
            code: 200,
            msg: '删除成功'
        });

    } catch (error) {
        console.error('删除失败:', error);
        res.status(500).json({
            code: 500,
            msg: process.env.NODE_ENV === 'development' ? error.message : '删除失败'
        });
    }
});

export default router;