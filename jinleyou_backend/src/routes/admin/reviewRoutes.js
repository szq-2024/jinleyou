// 后端路由完整代码 (文档2调整后)
import express from 'express';
import {
    getReviewList,
    deleteReview
} from '../../controllers/adminReviewController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/', (req, res, next) => {
    //console.log('处理GET列表请求，参数:', req.query)
    next()
}, getReviewList);

router.delete('/:id', (req, res, next) => {
    //console.log(`删除请求 ID: ${req.params.id}`)
    next()
}, deleteReview);

export default router;