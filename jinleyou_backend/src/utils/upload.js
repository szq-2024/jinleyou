// utils/upload.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// 通用配置
const createStorage = (folder) => {
    const dir = path.join(process.cwd(), 'public', folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, dir),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        }
    });
};

// 通用文件过滤器
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error('只允许上传图片文件（JPG/PNG/GIF）'), false);
};

// 默认上传（public/uploads）
export const upload = multer({
    storage: createStorage('uploads'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 景点图片专用上传（public/photo）
export const uploadScenicPhoto = multer({
    storage: createStorage('photo'),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 调大限制到10MB
        files: 5 // 允许最多上传5张图片
    }
});