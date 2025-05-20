// routes/admin/chatRoutes.js
import express from 'express';
import {
    getMessagesList,
    deleteMessage
} from '../../controllers/adminChatController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';

const router = express.Router();

// 统一应用管理员验证中间件
router.use(verifyAdmin);

// 获取聊天记录（支持时间范围查询）
router.get('/', getMessagesList);

// 删除聊天消息
router.delete('/:id', deleteMessage);

export default router;