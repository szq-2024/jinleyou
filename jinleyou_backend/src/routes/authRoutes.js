import express from 'express';
import { register, login } from '../controllers/authController.js'; // 必须带扩展名

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router; // 使用默认导出