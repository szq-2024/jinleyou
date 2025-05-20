// routes/admin/userRoutes.js
import express from 'express';
import {
    getUsersList,
    updateUser,
    updateUserAvatar,
    deleteUser
} from '../../controllers/adminUserController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';
import { upload } from '../../utils/upload.js';

const router = express.Router();

// 统一应用管理员验证中间件
router.use(verifyAdmin);

// 用户列表（带分页）
router.get('/', getUsersList);
// 更新用户信息
router.put('/:userId', updateUser);
//上传头像
router.put('/:userId/avatar',
    upload.single('avatar'),
    updateUserAvatar
);
// 删除用户
router.delete('/:userId', deleteUser);

export default router;