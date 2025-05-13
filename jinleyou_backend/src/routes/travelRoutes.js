// routes/travelPlans.js
import express from 'express';
import { pool } from '../config/db.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// 获取旅行计划
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT tp.*,
                   u.nickname,
                   u.avatar
            FROM travel_plans tp
                     JOIN users u ON tp.user_id = u.userId
            WHERE date >= CURDATE()
            ORDER BY tp.date ASC`);

        res.json({ code: 200, data: rows });
    } catch (err) {
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});

// 创建旅行计划
router.post('/', auth, async (req, res) => {
    console.log('当前用户:', req.user);
    const { title, date, destination, preference, description } = req.body;

    // 新增校验逻辑
    const validPreferences = ['美食', '历史', '自然', '摄影', '亲子'];
    if (!validPreferences.includes(preference)) {
        return res.status(400).json({ code: 400, msg: '非法的偏好类型' });
    }
    if (new Date(date) < new Date().setHours(0,0,0,0)) {
        return res.status(400).json({ code: 400, msg: '日期不能早于今天' });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO travel_plans
                 (user_id, title, date, destination, preference, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.userId, title, date, destination, preference, description]
        );

        const [newPlan] = await pool.query(
            `SELECT tp.*,
                    u.nickname,
                    u.avatar
             FROM travel_plans tp
                      JOIN users u ON tp.user_id = u.userId
             WHERE tp.id = ?`,
            [result.insertId]
        );

        res.json({ code: 200, data: newPlan[0] });
    } catch (err) {
        console.error('创建失败:', err);
        res.status(500).json({ code: 500, msg: '创建失败' });
    }
});
// 获取用户自己的行程
router.get('/my', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT tp.* 
       FROM travel_plans tp
       WHERE user_id = ?
       ORDER BY tp.date DESC`,
            [req.user.userId]
        );
        res.json({ code: 200, data: rows });
    } catch (err) {
        res.status(500).json({ code: 500, msg: '获取失败' });
    }
});

// 删除行程
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await pool.query(
            `DELETE FROM travel_plans 
       WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, msg: '行程不存在或无权操作' });
        }

        res.json({ code: 200, msg: '删除成功' });
    } catch (err) {
        res.status(500).json({ code: 500, msg: '删除失败' });
    }
});

export default router;