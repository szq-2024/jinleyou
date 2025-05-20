// controllers/adminPlanController.js
import { pool } from '../config/db.js'

export const getAllPlans = async (req, res) => {
    let params = [];
    try {
        const { page = 1, limit = 10, destination, preference } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        params = [];

        if (destination) {
            whereClause += ' AND destination LIKE ?';
            params.push(`%${destination}%`);
        }

        if (preference) {
            whereClause += ' AND preference = ?';
            params.push(preference);
        }

        // 获取总数
        const countQuery = `SELECT COUNT(*) AS total FROM travel_plans ${whereClause}`;
        const [totalResult] = await pool.query(countQuery, params);
        const total = totalResult[0].total;

        // 获取分页数据
        const query = `
            SELECT 
                id, user_id, title, date, destination, 
                preference, description, created_at
            FROM travel_plans 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`;

        const [plans] = await pool.query(query, [...params, Number(limit), offset]);

        res.json({
            code: 200,
            data: {
                list: plans,
                total
            }
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            code: 500,
            message: '获取旅行计划失败',
            debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM travel_plans WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '计划不存在' });
        }

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({
            code: 500,
            message: '删除计划失败',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};