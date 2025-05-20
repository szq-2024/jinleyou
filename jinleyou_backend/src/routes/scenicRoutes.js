import express from 'express';
import { pool } from '../config/db.js';
import auth from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'public', 'review'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只允许图片文件'), false);
        }
    }
});

const router = express.Router();

// 获取景点列表
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        const [rows] = await pool.query(`
                    SELECT id, name, description,
                           JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) as imageUrl
                    FROM scenic_spots
                             LIMIT ? OFFSET ?`,
            [pageSize, offset]
        );

        const [total] = await pool.query('SELECT COUNT(*) AS total FROM scenic_spots');
        res.json({
            code: 200,
            data: {
                data: rows,
                total: total[0].total
            }
        });
    } catch (err) {
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});

// 获取景点详情
router.get('/:id', async (req, res) => {
    try {
        const [spot] = await pool.query(`
                    SELECT
                        s.id, s.name, s.description,
                        s.images,
                        s.address,
                        s.open_time AS openTime,
                        s.ticket_price AS ticketPrice
                    FROM scenic_spots s
                    WHERE s.id = ?`,
            [req.params.id]
        );

        if (!spot[0]) return res.status(404).json({ code: 404, msg: '景点不存在' });
        // 处理景点数据中的images字段
        // 处理景点数据中的images字段
        let images = [];
        const rawImages = spot[0].images;

        // 先进行类型判断
        if (typeof rawImages === 'string') {
            try {
                images = JSON.parse(rawImages);
                // 处理历史遗留的纯字符串格式
                if (typeof images === 'string') {
                    images = [images.replace(/[$$$$"]/g, '')];
                }
            } catch (e) {
                console.warn('JSON解析失败，启用深度修复:', rawImages);
                const extractedPath = rawImages.match(/(\/[^\s\]\[]+)/)?.[0] || '';
                images = extractedPath ? [extractedPath] : [];
            }
        } else if (Array.isArray(rawImages)) { // 已经是数组的情况
            images = rawImages.map(img =>
                typeof img === 'string' ? img.replace(/[$$$$"]/g, '') : img
            );
        } else {
            images = [];
        }
        const spotData = {
            ...spot[0],
            images: images
        }

        // 处理评论部分
        const [reviews] = await pool.query(`
                    SELECT
                        r.content,
                        r.images AS reviewImages,
                        COALESCE(NULLIF(u.nickname, ''), u.username) AS username, u.avatar,
                        r.created_at AS time
                    FROM scenic_reviews r
                        JOIN users u ON r.user_id = u.userId
                    WHERE r.scenic_id = ?`,
            [req.params.id]
        );

        const processedReviews = reviews.map(review => ({
            ...review,
            images: review.reviewImages || [], // 直接使用数组
            time: review.time.toISOString().split('T')[0]
        }));

        res.json({
            code: 200,
            data: {
                ...spotData,
                reviews: processedReviews
            }
        });
    } catch (err) {
        console.error('数据库错误:', err);
        res.status(500).json({ code: 500, msg: '服务器内部错误' });
    }
});

router.post('/:id/reviews', auth, async (req, res) => {
    console.log('收到评论请求 body:', req.body); // 调试接收到的参数
    const { content, images = [] } = req.body;

    try {
        console.log('用户ID:', req.user.userId, '景点ID:', req.params.id); // 调试用户信息
        console.log('提交的图片数组:', images); // 调试图片参数

        // 验证图片数组格式
        const isValidImages = Array.isArray(images) &&
            images.every(img => typeof img === 'string');

        if (!isValidImages) {
            console.error('无效的图片格式:', images);
            return res.status(400).json({
                code: 400,
                msg: '图片格式不正确'
            });
        }
        const processedImages = images.map(img => {
            if (typeof img !== 'string') return img;

            // 处理绝对路径
            if (img.startsWith('http://') || img.startsWith('https://')) {
                try {
                    const urlObj = new URL(img);
                    return urlObj.pathname; // 提取路径部分
                } catch (e) {
                    return img; // URL解析失败保留原值
                }
            }
            // 已为相对路径则直接返回
            return img;
        });
        const [result] = await pool.query(
            `INSERT INTO scenic_reviews
                 (user_id, scenic_id, content, images)
             VALUES (?, ?, ?, ?)`,
            [
                req.user.userId,
                req.params.id,
                content,
                JSON.stringify(processedImages)
            ]
        );

        console.log('数据库插入结果:', result); // 调试数据库返回
        res.json({ code: 200, msg: '评论提交成功' });
    } catch (err) {
        console.error('提交评论错误详情:', err.stack); // 输出完整错误堆栈
        res.status(500).json({ code: 500, msg: '服务器错误' });
    }
});

// 文件上传接口
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        console.log('收到文件上传请求，文件信息:', req.file); // 调试文件信息
        console.log('请求头Authorization:', req.headers.authorization); // 调试鉴权信息

        if (!req.file) {
            console.warn('未接收到文件');
            return res.status(400).json({ code: 400, msg: '请选择文件' });
        }

        const fileUrl = `/public/review/${req.file.filename}`;
        console.log('生成文件访问地址:', fileUrl); // 调试生成地址

        res.json({
            code: 200,
            data: {
                url: fileUrl
            }
        });
    } catch (err) {
        console.error('文件上传错误详情:', err.stack);
        res.status(500).json({ code: 500, msg: '文件上传失败' });
    }
});


export default router;