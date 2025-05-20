// controllers/adminServiceController.js
import { pool } from '../config/db.js'

export const getAllServices = async (req, res) => {
    let params = [];
    try {
        const { page = 1, limit = 10, type, minPrice, maxPrice } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        params = [];

        if (type) {
            whereClause += ' AND type = ?';
            params.push(type);
        }

        if (minPrice || maxPrice) {
            whereClause += ' AND price BETWEEN ? AND ?';
            params.push(minPrice || 0, maxPrice || 999999);
        }

        // 获取总数
        const countQuery = `SELECT COUNT(*) AS total FROM guide_services ${whereClause}`;
        const [totalResult] = await pool.query(countQuery, params);
        const total = totalResult[0].total;

        // 获取分页数据
        const query = `
            SELECT
                id, user_id, destination, service_date,
                type, duration, CAST(price AS DECIMAL(8,2)) as price, description, created_at
            FROM guide_services
                     ${whereClause}
            ORDER BY created_at DESC
                LIMIT ? OFFSET ?`;

        const [services] = await pool.query(query, [...params, Number(limit), offset]);

        res.json({
            code: 200,
            data: {
                list: services,
                total
            }
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            code: 500,
            message: '获取导游服务失败',
            debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM guide_services WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '服务不存在' });
        }

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            code: 500,
            message: '删除服务失败',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};