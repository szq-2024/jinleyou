// controllers/adminReviewController.js
import { pool } from '../config/db.js'

export const getReviewList = async (req, res) => {
    //console.debug('[getReviewList] 开始处理获取评论列表请求，请求参数:', req.query)
    let params = []; // 在try外部声明params，确保catch中可以访问
    try {
        const { page = 1, limit = 10, keyword, startDate, endDate } = req.query
        const offset = (page - 1) * limit
        //console.log(`[getReviewList] 分页参数 - 页码: ${page}, 每页数量: ${limit}, 偏移量: ${offset}`)

        let whereClause = 'WHERE 1=1'
        params = []; // 重置参数数组

        if (keyword) {
            //console.log(`[getReviewList] 搜索关键字: "${keyword}"`)
            whereClause += ' AND (user_id LIKE ? OR content LIKE ?)'
            params.push(`%${keyword}%`, `%${keyword}%`)
        }

        if (startDate && endDate) {
            //console.log(`[getReviewList] 时间范围过滤 - 开始: ${startDate}, 结束: ${endDate}`)
            whereClause += ' AND created_at BETWEEN ? AND ?'
            params.push(startDate, endDate)
        }

        //console.log('[getReviewList] 生成的查询条件:', whereClause)
        //console.log('[getReviewList] 查询参数:', params)

        // 获取总记录数
        const countQuery = `SELECT COUNT(*) AS total FROM scenic_reviews ${whereClause}`
        //console.debug('[getReviewList] 执行总数查询:\n', countQuery.replace(/\s+/g, ' ').trim())
        //console.log('[getReviewList] 总数查询参数:', params)
        const [totalResult] = await pool.query(countQuery, params)
        const total = totalResult[0].total

        // 获取分页数据
        const query = `
            SELECT
                id,
                user_id,
                scenic_id,
                content,
                COALESCE(NULLIF(images, ''), '[]') AS images,
                created_at
            FROM scenic_reviews
                     ${whereClause}
            ORDER BY created_at DESC
                LIMIT ? OFFSET ?`
        const queryParams = [...params, Number(limit), offset]
        //console.debug('[getReviewList] 执行分页查询:\n', query.replace(/\s+/g, ' ').trim())
        //console.log('[getReviewList] 查询参数:', queryParams)

        const [reviews] = await pool.query(query, queryParams)

        // 新增baseUrl处理
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const processedReviews = reviews.map(review => {
            let images = review.images || []
            if (typeof images === 'string') {
                try {
                    images = JSON.parse(images)
                } catch {
                    images = []
                }
            }
            const fullUrls = images.map(img =>
                img.startsWith('http') ? img : `${baseUrl}${img}`
            )
            return {
                ...review,
                images: fullUrls
            }
        })

        res.json({
            code: 200,
            data: {
                list: processedReviews,
                total: total // 使用正确的总记录数
            }
        })
    } catch (error) {
        console.error('[getReviewList] 发生未处理异常:', error.message)
        console.error('错误堆栈:', error.stack)
        console.error('最后执行的SQL参数:', params) // params现在可访问
        res.status(500).json({
            code: 500,
            message: '获取评论列表失败',
            debug: {
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        })
    }
}

export const deleteReview = async (req, res) => {
    //console.debug('[deleteReview] 开始处理删除评论请求，参数:', req.params)
    try {
        const { id } = req.params
        //console.log(`[deleteReview] 尝试删除评论 ID: ${id}`)

        const [result] = await pool.query('DELETE FROM scenic_reviews WHERE id = ?', [id])
        //console.log(`[deleteReview] 删除操作影响行数: ${result.affectedRows}`)

        if (result.affectedRows === 0) {
            //console.warn(`[deleteReview] 未找到评论 ID: ${id}`)
            return res.status(404).json({ code: 404, message: '评论不存在' })
        }

        //console.log(`[deleteReview] 评论 ID ${id} 删除成功`)
        res.json({ code: 200, message: '删除成功' })
    } catch (error) {
        //console.error('[deleteReview] 删除操作异常:', error.message)
        //console.error('错误堆栈:', error.stack)
        //console.error('失败请求参数:', req.params)
        res.status(500).json({
            code: 500,
            message: '删除评论失败',
            debug: {
                attempted_id: req.params.id,
                error: error.message
            }
        })
    }
}