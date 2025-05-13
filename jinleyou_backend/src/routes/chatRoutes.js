import express from 'express';
import { pool } from '../config/db.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// 获取未读消息总数
// 修改后的/unread-count路由
router.get('/unread-count', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        // 添加调试日志
        console.log('Fetching unread count for user:', userId);

        const [rows] = await pool.query(
            `SELECT COUNT(*) AS unreadcount 
             FROM chat_messages 
             WHERE receiver_id = ? AND read_at IS NULL`,
            [userId]
        );

        // 调试输出查询结果
        console.log('Database query result:', rows);

        // 处理字段名大小写问题（MySQL可能返回小写）
        const unreadcount = rows[0]?.['unreadcount'] || 0;

        // 确保返回数字
        res.json({ code: 200, data: unreadcount });
    } catch (error) {
        console.error('获取未读消息失败:', error);
        res.status(500).json({ code: 500, msg: '获取失败' });
    }
});
// 获取消息联系人列表
router.get('/contacts', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [contacts] = await pool.query(`
            WITH RankedMessages AS (
                SELECT 
                    partner.userId,
                    partner.nickname,
                    partner.avatar,
                    cm.content,
                    cm.created_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY partner.userId 
                        ORDER BY cm.created_at DESC
                    ) AS message_rank,
                    IF(cm.receiver_id = ? AND cm.read_at IS NULL, 1, 0) AS is_unread
                FROM chat_messages cm
                JOIN users currentUser ON currentUser.userId = ?
                JOIN users partner ON partner.userId = 
                    CASE 
                        WHEN cm.sender_id = currentUser.userId THEN cm.receiver_id 
                        ELSE cm.sender_id 
                    END
                WHERE ? IN (cm.sender_id, cm.receiver_id)
            )
            SELECT 
                UserId AS userId,
                nickname,
                avatar,
                MAX(content) AS lastContent,  -- 获取最新消息内容
                MAX(created_at) AS lastTime,   -- 获取最新时间
                SUM(is_unread) AS unreadCount
            FROM RankedMessages
            WHERE message_rank = 1
            GROUP BY userId, nickname, avatar
            ORDER BY lastTime DESC
        `, [userId, userId, userId]);

        // 处理头像路径
        const processedContacts = contacts.map(contact => ({
            ...contact,
            avatar: contact.avatar
                ? (
                    contact.avatar.startsWith('http://') || contact.avatar.startsWith('https://')
                        ? contact.avatar  // 已经是完整URL则不拼接
                        : `${process.env.BASE_URL}${contact.avatar.startsWith('/') ? '' : '/'}${contact.avatar}`
                )
                : '/static/default-avatar.png'
        }));

        res.json({ code: 200, data: processedContacts });
    } catch (error) {
        console.error('获取联系人失败:', error); // 确保错误被记录
        res.status(500).json({ code: 500, msg: '获取联系人失败' });
    }
});
// 获取聊天记录
router.get('/:userId', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const targetUserId = req.params.userId;

        const [messages] = await pool.query(`
            SELECT
                cm.id,
                cm.sender_id as senderId,  -- 别名使用驼峰式，但可能被转为小写
                cm.receiver_id as receiverId,
                cm.content,
                cm.created_at as createdAt,
                u.nickname as senderNickname,
                u.avatar as senderAvatar
            FROM chat_messages cm
                     JOIN users u ON cm.sender_id = u.userId
            WHERE (cm.sender_id = ? AND cm.receiver_id = ?)
               OR (cm.sender_id = ? AND cm.receiver_id = ?)
            ORDER BY cm.created_at ASC
        `, [userId, targetUserId, targetUserId, userId]);

        // 处理字段名大小写问题（例如：MySQL返回小写）
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderid || msg.senderId, // 兼容小写和驼峰式
            receiverId: msg.receiverid || msg.receiverId,
            content: msg.content,
            createdAt: msg.createdat || msg.createdAt, // 同样处理时间字段
            senderNickname: msg.sendernickname || msg.senderNickname,
            senderAvatar: msg.senderAvatar
                ? (
                    msg.senderAvatar.startsWith('http://') ||
                    msg.senderAvatar.startsWith('https://')
                        ? msg.senderAvatar
                        : `${process.env.BASE_URL}${msg.senderAvatar}`
                )
                : '/static/default-avatar.png'
        }));

        res.json({ code: 200, data: formattedMessages });
    } catch (error) {
        console.error('获取聊天记录失败:', error);
        res.status(500).json({ code: 500, msg: '获取聊天记录失败' });
    }
});
// 发送消息
router.post('/', auth, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.userId;

        if (!receiverId || !content) {
            return res.status(400).json({ code: 400, msg: '参数不完整' });
        }

        const [result] = await pool.query(
            'INSERT INTO chat_messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [senderId, receiverId, content]
        );

        res.json({
            code: 200,
            data: {
                id: result.insertId,
                senderId,
                receiverId,
                content,
                createdAt: new Date()
            }
        });
    } catch (error) {
        console.error('发送消息失败:', error);
        res.status(500).json({ code: 500, msg: '发送消息失败' });
    }
});


// 标记与特定用户的聊天为已读
router.put('/:userId/mark-as-read', auth, async (req, res) => {
    try {
        const receiverId = req.user.userId;
        const senderId = req.params.userId;

        await pool.query(
            `UPDATE chat_messages 
            SET read_at = CURRENT_TIMESTAMP 
            WHERE sender_id = ? AND receiver_id = ? 
            AND read_at IS NULL`,
            [senderId, receiverId]
        );

        res.json({ code: 200, msg: '标记成功' });
    } catch (error) {
        res.status(500).json({ code: 500, msg: '标记失败' });
    }
});

export default router;