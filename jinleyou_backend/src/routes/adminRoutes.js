// routes/adminRoutes.js
import express from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';
import userRoutes from './admin/userRoutes.js';
import scenicRoutes from './admin/scenicRoutes.js';
import reviewRoutes from './admin/reviewRoutes.js';
import planRoutes from './admin/planRoutes.js';
import serviceRoutes from './admin/serviceRoutes.js';
import chatRoutes from './admin/chatRoutes.js';
const router = express.Router();

// 管理员登录
router.post('/auth/login', adminLogin);

// 用户管理路由
router.use('/users', userRoutes);
//景点管理路由
router.use('/scenic-spots', scenicRoutes);
//评论管理路由
router.use('/reviews', reviewRoutes);
//评论管理路由
router.use('/travel-plans', planRoutes);
//评论管理路由
router.use('/guide-services', serviceRoutes);
//聊天管理路由
router.use('/chat', chatRoutes);
export default router;