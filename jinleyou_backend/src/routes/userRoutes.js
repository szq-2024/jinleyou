// routes/userRoutes.js
import express from 'express';
import { expressjwt } from 'express-jwt';
import { pool } from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import auth from "../middlewares/auth.js";
import dayjs from 'dayjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 保持原目录不变
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        // 关键修改：保留原始文件扩展名
        const ext = path.extname(file.originalname); // 获取扩展名（如 .jpg）
        const uniqueName = Date.now() + '-' + Math.random().toString(36).slice(2) + ext; // 生成带扩展名的唯一文件名
        cb(null, uniqueName); // 例如："1623456789000-abc123.jpg"
    }
});

// 2. 替换原 upload 配置
const upload = multer({ storage }); // ✅ 使用自定义存储配置
const router = express.Router();

// 新增JWT验证中间件
const authenticate = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: req => req.headers.authorization?.split(' ')[1]
});

router.post('/update', authenticate, async (req, res) => {
    try {
        let {
            nickname = '',
            avatar: avatarUrl = null, // 重命名解构字段
            gender = 0,
            bio = ''
        } = req.body;

        let avatar = avatarUrl;

        // 处理avatar字段转换
        if (avatar) {
            try {
                const base = process.env.BASE_URL || 'http://localhost:3000';
                const baseUrl = new URL(base);
                const avatarUrlObj = new URL(avatar);

                // 仅处理同源地址
                if (avatarUrlObj.origin === baseUrl.origin) {
                    avatar = avatarUrlObj.pathname;
                }
            } catch (err) {
                // 非URL格式或无效URL时保持原值
            }
        }

        console.log('Processed avatar:', avatar); // 调试日志

        const userId = req.auth.userId;
        const genderNumber = Number(gender) || 0;

        await pool.execute(
            `UPDATE users SET
            nickname = ?,
            avatar = ?, 
            gender = ?, 
            bio = ?
            WHERE userId = ?`,
            [nickname, avatar, genderNumber, bio, userId]
        );

        res.json({ code: 200, msg: '更新成功' });
    } catch (err) {
        console.error('更新失败:', err);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});
// 修改 /info 路由
router.get('/info', authenticate, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const [rows] = await pool.execute(
            'SELECT nickname, avatar, gender, bio FROM users WHERE userId = ?',
            [userId]
        );

        const userInfo = rows[0];
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        userInfo.avatar = userInfo.avatar ? `${baseUrl}${userInfo.avatar}` : null;
        // 直接返回数据库存储的路径（例如：/public/uploads/filename.jpg）
        res.json({
            code: 200,
            data: userInfo // 直接返回原始avatar路径
        });
    } catch (err) {
        console.error('获取用户信息失败:', err);
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ code: 400, msg: '请选择文件' });
        }
        // 返回相对路径
        const fileUrl = `/public/uploads/${req.file.filename}`;
        res.json({ code: 200, url: fileUrl });
    } catch (err) {
        console.error('文件上传失败:', err);
        res.status(500).json({ code: 500, msg: '上传失败' });
    }
});

router.get('/reviews', auth, async (req, res) => {
    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const [reviews] = await pool.query(`
            SELECT
                r.id AS reviewId,
                r.content,
                r.images AS reviewImages,
                r.created_at AS createdAt,
                s.name AS scenicName,
                u.avatar,
                u.nickname
            FROM scenic_reviews r
                JOIN users u ON r.user_id = u.userId
                JOIN scenic_spots s ON r.scenic_id = s.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC`,
            [req.user.userId]
        );
        // 加强parseReviewImages函数
        function parseReviewImages(images) {
            if (!images) return [];
            if (Array.isArray(images)) {
                return images;
            }
            try {
                const sanitized = images.replace(/\\"/g, '"');
                const parsed = JSON.parse(sanitized);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                if (typeof images === 'string') {
                    if (images.startsWith('[')) {
                        try {
                            return JSON.parse(images);
                        } catch (err) {
                            return images.split(',').map(s => s.trim());
                        }
                    }
                    return images.split(',').map(s => s.trim());
                }
                return [];
            }
        }
        const processed = reviews.map(item => {
            console.log('🔍 原始数据库记录:', item); // 调试点4

            const rawImages = item.reviewImages;
            console.log('📦 原始图片字段:', {
                type: typeof rawImages,
                value: rawImages
            }); // 调试点5

            const parsedImages = parseReviewImages(rawImages);
            console.log('🔄 解析后的图片数组:', parsedImages); // 调试点6

            return {
                ...item,
                avatar: item.avatar ? `${baseUrl}${item.avatar}` : null, // 拼接头像URL
                images: parsedImages.map(img => {
                    const processedImg = String(img).replace(/["]+/g, '');
                    const fullUrl = processedImg.startsWith('http')
                        ? processedImg
                        : `${baseUrl}${processedImg}`;
                    return fullUrl;
                })
            };
        });

        console.log('🚀 最终返回数据:', processed); // 调试点8
        res.json({ code: 200, data: processed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, msg: '获取评论失败' });
    }
});

// 删除评论接口
router.delete('/reviews/:id', auth, async (req, res) => {
    try {
        // 先查询是否属于该用户
        const [review] = await pool.query(
            'SELECT user_id FROM scenic_reviews WHERE id = ?',
            [req.params.id]
        );

        if (!review.length) {
            return res.status(404).json({ code: 404, msg: '评论不存在' });
        }

        if (review[0].user_id !== req.user.userId) {
            return res.status(403).json({ code: 403, msg: '无权操作' });
        }

        await pool.query(
            'DELETE FROM scenic_reviews WHERE id = ?',
            [req.params.id]
        );

        res.json({ code: 200, msg: '删除成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, msg: '删除失败' });
    }
});
export default router;