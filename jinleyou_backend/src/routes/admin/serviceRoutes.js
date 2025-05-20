// routes/admin/serviceRoutes.js
import express from 'express';
import {
    getAllServices,
    deleteService
} from '../../controllers/adminServiceController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';

const router = express.Router();

// 统一应用管理员验证中间件
router.use(verifyAdmin);

// 获取所有导游服务（支持价格区间过滤）
router.get('/', getAllServices);

// 删除导游服务
router.delete('/:id', deleteService);

export default router;