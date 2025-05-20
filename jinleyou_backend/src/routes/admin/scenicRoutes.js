import express from 'express';
import {
    getScenicList,
    createScenic,
    updateScenic,
    updateScenicPhoto,
    deleteScenic,
    deleteScenicPhoto
} from '../../controllers/adminScenicController.js';
import { verifyAdmin } from '../../middlewares/adminAuth.js';
import { uploadScenicPhoto } from '../../utils/upload.js';

const router = express.Router();

// 景点图片上传配置
const scenicUpload = uploadScenicPhoto.fields([
    { name: 'images', maxCount: 5 }  // 允许上传最多5张图片
]);
// 统一应用管理员验证中间件
router.use(verifyAdmin);

// 路由配置
//获取景点列表
router.get('/', getScenicList);
//新建景点
router.post('/', scenicUpload, createScenic);
//更新景点
router.put('/:id', scenicUpload, updateScenic);
//上传图片
router.put(
    '/:id/photo',
    scenicUpload, // 使用正确的字段名
    updateScenicPhoto
);
//删除景点
router.delete('/:id', deleteScenic);
//删除某一景点图片
router.delete('/:id/photo', deleteScenicPhoto);
export default router;