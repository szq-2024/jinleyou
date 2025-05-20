//middlewares/adminAuth.js
import jwt from 'jsonwebtoken';

// middlewares/adminAuth.js
export const verifyAdmin = (req, res, next) => {
    //console.log('🔐 验证管理员请求头:', req.headers); // [!++]
    try {
        const authHeader = req.headers.authorization;
        //console.log('🔑 原始Authorization头:', authHeader); // [!++]

        if (!authHeader?.startsWith('Bearer ')) {
            //console.log('❌ 缺少Bearer token或格式错误'); // [!++]
            return res.status(401).json({ code: 401, message: '需要管理员令牌' });
        }

        const token = authHeader.split(' ')[1];
        //console.log('🔍 提取的Token:', token); // [!++]

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        //console.log('🔓 解码后的Token内容:', decoded); // [!++]

        if (decoded.role !== 'admin' || !decoded.adminAuth) {
            //console.log('⛔ 权限验证失败 角色:', decoded.role, 'adminAuth:', decoded.adminAuth); // [!++]
            return res.status(403).json({
                code: 403,
                message: '管理员权限验证失败'
            });
        }

        //console.log('✅ 管理员验证通过'); // [!++]
        req.admin = decoded;
        next();
    } catch (error) {
        //console.error('❌ 令牌验证错误:', error.message); // [!++]
        res.status(401).json({
            code: 401,
            message: error.message.includes('jwt expired')
                ? '管理员令牌已过期'
                : '非法管理员令牌'
        });
    }
};