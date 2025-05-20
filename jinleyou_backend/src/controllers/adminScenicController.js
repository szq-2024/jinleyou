// controllers/adminScenicController.js
import { pool } from '../config/db.js';
import path from 'path';
import fs from 'fs/promises';

// 删除文件工具函数
const deleteFiles = async (filePaths) => {
    await Promise.all(
        filePaths.map(async (relativePath) => {
            const fullPath = path.join(
                process.cwd(),
                'public',
                relativePath.replace(/^\/+/, '')
            )
            await fs.unlink(fullPath).catch(console.error)
        })
    )
};

// 通用图片格式处理方法
const parseImagesField = (images) => {
    // 如果已经是数组直接返回
    if (Array.isArray(images)) return images;

    // 处理字符串类型
    try {
        const parsed = typeof images === 'string' ? JSON.parse(images) : images;
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        return images ? [images] : [];
    }
};

export const getScenicList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, search } = req.query;
        const offset = (page - 1) * pageSize;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // 构建搜索条件
        let whereClause = '';
        const params = [];
        if (search) {
            whereClause = `WHERE name LIKE ? OR address LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }

        // 获取分页数据
        const [scenics] = await pool.query(
            `SELECT 
                id,
                name,
                description,
                images,
                address,
                open_time,
                ticket_price
            FROM scenic_spots
                ${whereClause}
            ORDER BY id DESC
            LIMIT ? OFFSET ?`,
            [...params, Number(pageSize), offset]
        );
        //console.log('🔍 [后端调试] 原始数据库数据:', scenics)
        // 处理图片URL
        const processedScenics = scenics.map(scenic => {
            const parsedImages = parseImagesField(scenic.images)
            // 调试代码：显示路径处理过程
            /*console.log('🖼️ [后端调试] 路径处理:', {
                raw: scenic.images,
                parsed: parsedImages,
                processed: parsedImages.map(img => `${baseUrl}${img}`)
            })*/

            return {
                ...scenic,
                images: parsedImages.map(img => `${baseUrl}${img}`)
            }
        });

        // 获取总数
        const [total] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM scenic_spots
                      ${whereClause}`,
            params
        );

        res.json({
            code: 200,
            data: {
                list: processedScenics,
                pagination: {
                    total: total[0].total,
                    currentPage: Number(page),
                    pageSize: Number(pageSize)
                }
            }
        });
    } catch (error) {
        console.error(`[景点列表] 错误: ${error.message}`);
        res.status(500).json({ code: 500, message: '获取景点列表失败' });
    }
};

export const createScenic = async (req, res) => {
    try {
        const { body, files } = req;
        const requiredFields = ['name', 'description', 'address', 'open_time', 'ticket_price'];

        // 验证必填字段
        if (requiredFields.some(field => !body[field])) {
            return res.status(400).json({ code: 400, message: '缺少必填字段' });
        }

        // 处理图片路径（统一使用/photo目录）
        const images = files?.images?.map(file =>
            `/public/photo/${file.filename.replace(/\\/g, '/')}`
        ) || [];

        // 创建景点记录
        const [result] = await pool.query(
            `INSERT INTO scenic_spots 
      (name, description, images, address, open_time, ticket_price)
      VALUES (?, ?, ?, ?, ?, ?)`,
            [
                body.name,
                body.description,
                JSON.stringify(images), // 确保存储为JSON数组
                body.address,
                body.open_time,
                body.ticket_price
            ]
        );

        // 获取新创建的景点数据
        const [newScenic] = await pool.query(
            `SELECT * FROM scenic_spots WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            code: 201,
            data: {
                ...newScenic[0],
                images: parseImagesField(newScenic[0].images)
            }
        });
    } catch (error) {
        console.error(`[创建景点] 错误: ${error.message}`);

        // 删除已上传的文件
        if (req.files?.images) {
            await deleteFiles(
                req.files.images.map(file => `/public/photo/${file.filename}`)
            );
        }

        res.status(500).json({
            code: 500,
            message: error.message.includes('ER_DUP_ENTRY')
                ? '景点名称已存在'
                : '创建景点失败'
        });
    }
};

export const updateScenic = async (req, res) => {
    try {
        const { id } = req.params;
        const { body, files } = req;

        // 获取现有景点数据
        const [existing] = await pool.query(
            `SELECT * FROM scenic_spots WHERE id = ?`,
            [id]
        );
        if (!existing.length) {
            return res.status(404).json({ code: 404, message: '景点不存在' });
        }

        // 解析旧图片（兼容处理）
        const oldImages = parseImagesField(existing[0].images);

        // 处理新图片
        let newImages = oldImages;
        if (files?.images) {
            newImages = files.images.map(file =>
                `/public/photo/${file.filename.replace(/\\/g, '/')}`
            );
            // 删除旧图片
            await deleteFiles(oldImages);
        }

        // 构建更新数据
        const updateData = {
            name: body.name || existing[0].name,
            description: body.description || existing[0].description,
            images: JSON.stringify(newImages), // 确保存储为JSON
            address: body.address || existing[0].address,
            open_time: body.open_time || existing[0].open_time,
            ticket_price: body.ticket_price || existing[0].ticket_price
        };

        // 执行更新
        const [result] = await pool.query(
            `UPDATE scenic_spots SET
                                     name = ?,
                                     description = ?,
                                     images = ?,
                                     address = ?,
                                     open_time = ?,
                                     ticket_price = ?
             WHERE id = ?`,
            [
                updateData.name,
                updateData.description,
                updateData.images,
                updateData.address,
                updateData.open_time,
                updateData.ticket_price,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '更新失败' });
        }

        res.json({
            code: 200,
            data: {
                ...updateData,
                images: newImages
            }
        });
    } catch (error) {
        console.error(`[更新景点] 错误: ${error.message}`);

        // 删除新上传的文件
        if (req.files?.images) {
            await deleteFiles(
                req.files.images.map(file => `/public/photo/${file.filename}`)
            );
        }

        res.status(500).json({
            code: 500,
            message: error.message.includes('ER_DUP_ENTRY')
                ? '景点名称已存在'
                : '更新景点失败'
        });
    }
};

export const updateScenicPhoto = async (req, res) => {
    try {
        //console.log('[后端调试] 接收到请求参数：', req.params, req.files)
        const { id } = req.params;
        //console.log('[后端调试] 处理景点ID：', id)
        const files = req.files.images;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // 参数验证
        if (!id || isNaN(id)) {
            return res.status(400).json({ code: 400, message: '无效的景点ID' });
        }
        if (!files || files.length === 0) {
            return res.status(400).json({ code: 400, message: '请上传至少一张图片' });
        }

        // 文件类型验证
        if (files.some(file => !file.mimetype.startsWith('image/'))) {
            await deleteFiles(files.map(f => `/public/photo/${f.filename}`));
            return res.status(400).json({ code: 400, message: '仅支持图片文件上传' });
        }
        //console.log('[后端调试] 文件验证通过，开始处理')
        // 获取当前景点数据
        const [existing] = await pool.query(
            `SELECT images FROM scenic_spots WHERE id = ?`,
            [id]
        );
        //console.log('[后端调试] 数据库查询结果：', existing)
        if (!existing.length) {
            await deleteFiles(files.map(f => `/public/photo/${f.filename}`));
            return res.status(404).json({ code: 404, message: '景点不存在' });
        }

        // 解析现有图片（兼容处理）
        const oldImages = parseImagesField(existing[0].images);
        //console.log('[后端调试] 解析后的旧图片：', oldImages)
        // 处理新图片路径
        const newImages = files.map(file =>
            `/public/photo/${file.filename.replace(/\\/g, '/')}`
        );
        //console.log('[后端调试] 生成的新图片路径：', newImages)
        // 合并图片数组
        const updatedImages = [...oldImages, ...newImages];
        //console.log('[后端调试] 合并后的图片数组：', updatedImages)
        // 更新数据库（使用JSON格式存储）
        await pool.query(
            `UPDATE scenic_spots SET images = ? WHERE id = ?`,
            [JSON.stringify(updatedImages), id]
        );
        console.log('[后端调试] 数据库更新完成')
        // 返回完整URL
        const processedImages = updatedImages.map(img => `${baseUrl}${img}`);
        res.json({
            code: 200,
            data: { images: processedImages }
        });
    } catch (error) {
        console.error('[后端调试] 错误堆栈：', error.stack)
        console.error('[景点图片更新] 错误:', error);

        // 清理已上传文件
        if (req.files) {
            await deleteFiles(
                req.files.map(f => `/public/photo/${f.filename}`)
            );
        }

        res.status(500).json({
            code: 500,
            message: error.message.includes('ER_DUP_ENTRY')
                ? '图片已存在'
                : '图片更新失败'
        });
    }
};

export const deleteScenic = async (req, res) => {
    try {
        const { id } = req.params;

        // 获取现有图片
        const [existing] = await pool.query(
            `SELECT images FROM scenic_spots WHERE id = ?`,
            [id]
        );
        if (!existing.length) {
            return res.status(404).json({ code: 404, message: '景点不存在' });
        }

        // 解析图片路径（使用改进后的方法）
        const images = parseImagesField(existing[0].images).flat();

        // 删除图片文件
        await deleteFiles(images);

        // 删除数据库记录
        const [result] = await pool.query(
            `DELETE FROM scenic_spots WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ code: 404, message: '景点不存在' });
        }

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error(`[删除景点] 错误: ${error.message}`);
        res.status(500).json({ code: 500, message: '删除景点失败' });
    }
};

export const deleteScenicPhoto = async (req, res) => {
    try {
        const { id } = req.params; // 正确获取路由参数
        const { imagePath } = req.query; // 从查询参数获取
        if (!id || isNaN(id)) {
            return res.status(400).json({ code: 400, message: '无效的景点ID' });
        }
        if (!imagePath) {
            return res.status(400).json({ code: 400, message: '请提供图片路径' });
        }

        // 获取并验证景点数据
        const [existing] = await pool.query(
            'SELECT images FROM scenic_spots WHERE id = ?',
            [id]
        );
        if (!existing.length) {
            return res.status(404).json({ code: 404, message: '景点不存在' });
        }

        // 处理图片路径
        const images = parseImagesField(existing[0].images);
        if (!images.includes(imagePath)) {
            return res.status(404).json({ code: 404, message: '图片不存在' });
        }

        // 更新数据库
        const updatedImages = images.filter(img => img !== imagePath);
        await pool.query(
            'UPDATE scenic_spots SET images = ? WHERE id = ?',
            [JSON.stringify(updatedImages), id]
        );

        // 删除物理文件
        await deleteFiles([imagePath]);

        res.json({ code: 200, message: '删除成功' });
    } catch (error) {
        console.error('[删除图片] 错误:', error);
        res.status(500).json({ code: 500, message: '删除图片失败' });
    }
};