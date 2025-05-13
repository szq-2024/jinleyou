import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

// 用户注册
const register = async (req, res) => {
    const { username, phone, password, captchaProblem, captchaAnswer } = req.body;
    // 记录请求基本信息（脱敏敏感字段）
    console.info(`[注册] 开始 | 用户名: ${username} | 手机号: ${phone.substring(0, 3)}****${phone.slice(-4)}`);
    try {
        // 调试日志 - 展示参数验证过程
        console.debug(`[注册] 参数验证 | 用户名长度: ${username.length} | 手机号格式: ${/^\d+$/.test(phone)}`);


        // 验证码格式验证
        const match = captchaProblem.match(/^(\d+)\s*([+-])\s*(\d+)\s*=\s*\?$/);
        if (!match) {
            return res.status(400).json({ code: 400, message: '验证码格式错误' });
        }
        // 计算正确答案
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[3]);
        const operator = match[2];
        const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;

        // 验证答案
        if (parseInt(captchaAnswer) !== correctAnswer) {
            return res.status(400).json({ code: 400, message: '验证码错误' });
        }

        // 检查用户存在性
        console.debug(`[注册] 数据库查询 | 查询用户: ${username} 或手机号: ${phone}`);
        // 检查用户名和手机号是否存在
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR phone = ?',
            [username, phone]
        );

        if (users.length > 0) {
            const conflictField = user.some(u => u.username === username) ? '用户名' : '手机号';
            console.warn(`[注册] 冲突警告 | 重复字段: ${conflictField} | 用户名: ${username}`);
            return res.status(400).json({ code: 400, message: '用户名或手机号已存在' });
        }
        // 密码哈希处理
        console.time('[注册] 密码哈希计算');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.timeEnd('[注册] 密码哈希计算');

        // 创建用户记录
        console.debug(`[注册] 数据库写入 | 用户名: ${username}`);
        const [result] = await pool.query(
            'INSERT INTO users (username, phone, password) VALUES (?, ?, ?)',
            [username, phone, passwordHash]
        );


        // 成功日志（记录脱敏后的关键信息）
        console.info(`[注册] 成功 | 用户ID: ${result.insertId} | 用户名: ${username}`);
        res.status(200).json({
            code: 200,
            message: '注册成功',
            data: { userId: result.insertId }
        });

    } catch (error) {
        // 错误日志包含堆栈跟踪
        console.error(`[注册] 系统错误 | 详情: ${error.message}`, {
            stack: error.stack,
            requestBody: {
                username: username,
                phone: phone.substring(0, 3) + '****' + phone.slice(-4)
            }
        });
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 用户登录
const login = async (req, res) => {

    const { account, password } = req.body;
    // 新增参数验证
    if (!account || !password) {
        console.warn('[登录] 参数错误 | 账号或密码为空');
        return res.status(400).json({ code: 400, message: '账号和密码不能为空' });
    }
    // 修改日志输出，使用条件判断
    console.info(`[登录] 开始 | 账号: ${account ? (account.includes('@') ? '***' + account.slice(-4) : account) : '未提供账号'}`);
    try {
        // 查找用户（支持用户名/手机号登录）
        console.debug(`[登录] 数据库查询 | 账号: ${account}`);
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR phone = ?',
            [account, account]
        );

        if (users.length === 0) {
            console.warn(`[登录] 验证失败 | 账号不存在: ${account}`);
            return res.status(400).json({ code: 400, message: '用户不存在' });
        }

        const user = users[0];
        console.debug(`[登录] 用户匹配 | 用户ID: ${user.userId}`);

        // 密码验证
        console.time('[登录] 密码验证耗时');
        const isMatch = await bcrypt.compare(password, user.password);
        console.timeEnd('[登录] 密码验证耗时');

        if (!isMatch) {
            console.warn(`[登录] 验证失败 | 密码错误 | 用户ID: ${user.userId}`);
            return res.status(400).json({ code: 400, message: '密码错误' });
        }

        // 生成JWT
        console.time('[登录] JWT生成耗时');
        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.timeEnd('[登录] JWT生成耗时');

        // 成功日志（不记录敏感信息）
        console.info(`[登录] 成功 | 用户ID: ${user.userId} | 令牌长度: ${token.length}`);
        res.status(200).json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                user: {
                    userId: user.userId,
                    username: user.username,
                    phone: user.phone,
                    nickname: user.nickname,  // 确保字段名正确
                    avatar: "avatar-url"
                }
            }
        });

    } catch (error) {
        console.error(`[登录] 系统错误 | 详情: ${error.message}`, {
            stack: error.stack,
            requestBody: {
                account: account ? (account.includes('@') ? '***' + account.slice(-4) : account) : 'undefined',
                password: '******'
            }
        });
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

export { register, login };