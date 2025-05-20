// controllers/adminChatController.js
import { pool } from '../config/db.js'

export const getMessagesList = async (req, res) => {
    let params = [];
    try {
        const { page = 1, limit = 10, sender, receiver, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE 1=1';
        params = [];

        if (sender) {
            whereClause += ' AND sender_id = ?';
            params.push(sender);
        }

        if (receiver) {
            whereClause += ' AND receiver_id = ?';
            params.push(receiver);
        }

        if (startDate && endDate) {
            whereClause += ' AND created_at BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        // 获取总数
        const countQuery = `SELECT COUNT(*) AS total FROM chat_messages ${whereClause}`;
        const [totalResult] = await pool.query(countQuery, params);
        const total = totalResult[0].total;

        // 获取分页数据
        const query = `
      SELECT 
        id, sender_id, receiver_id, 
        content, created_at, read_at
      FROM chat_messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`;

        const [messages] = await pool.query(query, [...params, Number(limit), offset]);

        res.json({
            code: 200,
            data: {
                list: messages.map(msg => ({
                    ...msg,
                    read: !!msg.read_at
                })),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            code: 500,
            message: '获取聊天记录失败',
            debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM chat_messages WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '消息不存在' });
        }

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            code: 500,
            message: '删除消息失败',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};