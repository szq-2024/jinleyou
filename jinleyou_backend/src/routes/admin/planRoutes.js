// routes/admin/planRoutes.js
import express from 'express';
import {
    getAllPlans,
    deletePlan
} from '../../controllers/adminPlanController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';

const router = express.Router();

// 统一应用管理员验证中间件
router.use(verifyAdmin);

// 获取所有旅行计划（支持分页和过滤）
router.get('/', getAllPlans);

// 删除旅行计划
router.delete('/:id', deletePlan);

export default router;