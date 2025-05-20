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

// 忘记密码
const resetPassword = async (req, res) => {
    const { account, captchaProblem, captchaAnswer, newPassword } = req.body;
    // 账号脱敏处理
    const maskedAccount = account.replace(/(\d{3})\d+(\d{4})/, (match, p1, p2) => p1 + '****' + p2);
    console.info(`[密码重置] 开始 | 账号: ${maskedAccount}`);

    try {
        // 验证码格式验证
        const match = captchaProblem.match(/^(\d+)\s*([+-])\s*(\d+)\s*=\s*\?$/);
        if (!match) {
            console.warn('[密码重置] 验证码格式错误');
            return res.status(400).json({ code: 400, message: '验证码格式错误' });
        }

        // 计算正确答案
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[3]);
        const operator = match[2];
        const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;

        // 答案验证
        if (parseInt(captchaAnswer) !== correctAnswer) {
            console.warn(`[密码重置] 验证码错误 | 预期:${correctAnswer} 实际:${captchaAnswer}`);
            return res.status(400).json({ code: 400, message: '验证码错误' });
        }

        // 用户存在性验证
        console.debug(`[密码重置] 数据库查询 | 账号: ${account}`);
        const [users] = await pool.query(
            'SELECT userId, password FROM users WHERE username = ? OR phone = ?',
            [account, account]
        );

        if (users.length === 0) {
            console.warn(`[密码重置] 用户不存在 | 账号: ${maskedAccount}`);
            return res.status(400).json({ code: 400, message: '用户不存在' });
        }

        // 密码哈希处理
        console.time('[密码重置] 密码哈希计算');
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        console.timeEnd('[密码重置] 密码哈希计算');

        // 更新数据库
        console.debug(`[密码重置] 更新密码 | 用户ID: ${users[0].userId}`);
        await pool.query(
            'UPDATE users SET password = ? WHERE userId = ?',
            [newPasswordHash, users[0].userId]
        );

        // 记录成功日志
        console.info(`[密码重置] 成功 | 用户ID: ${users[0].userId}`);
        res.status(200).json({
            code: 200,
            message: '密码重置成功',
            data: { userId: users[0].userId }
        });

    } catch (error) {
        // 错误处理
        console.error(`[密码重置] 系统错误 | ${error.message}`, {
            stack: error.stack,
            requestBody: {
                account: maskedAccount,
                captchaProblem: captchaProblem,
                captchaAnswer: '****',
                newPassword: '******'
            }
        });
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 忘记密码
// 在authController.js中添加以下代码
const changePassword = async (req, res) => {
    const { identifier, oldPassword, newPassword } = req.body;

    // 脱敏处理日志
    const maskIdentifier = (id) => {
        if (!id) return 'null';
        return id.replace(/(\d{3})\d+(\d{4})/, '$1****$2')
            .replace(/(.{2}).+(.{2})/, '$1***$2');
    };

    console.info(`[修改密码] 开始 | 标识: ${maskIdentifier(identifier)}`);

    try {
        // 参数校验
        if (!identifier || !oldPassword || !newPassword) {
            console.warn('[修改密码] 参数错误: 缺少必要字段');
            return res.status(400).json({ code: 400, message: '请填写完整信息' });
        }

        // 新密码格式验证
        if (!/^\d{6,}$/.test(newPassword)) {
            console.warn(`[修改密码] 密码格式错误: ${newPassword.length}位`);
            return res.status(400).json({ code: 400, message: '密码需6位以上数字' });
        }

        // 查询用户
        console.debug(`[修改密码] 用户查询: ${maskIdentifier(identifier)}`);
        const [users] = await pool.query(
            `SELECT userId, password FROM users 
            WHERE username = ? OR phone = ?`,
            [identifier, identifier]
        );

        if (users.length === 0) {
            console.warn(`[修改密码] 用户不存在: ${maskIdentifier(identifier)}`);
            return res.status(400).json({ code: 400, message: '用户不存在' });
        }

        // 密码验证
        const user = users[0];
        console.time('[修改密码] 密码比对');
        const isValid = await bcrypt.compare(oldPassword, user.password);
        console.timeEnd('[修改密码] 密码比对');

        if (!isValid) {
            console.warn(`[修改密码] 密码错误 | 用户ID: ${user.userId}`);
            return res.status(400).json({ code: 400, message: '原密码错误' });
        }

        // 生成新密码哈希
        console.time('[修改密码] 哈希生成');
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        console.timeEnd('[修改密码] 哈希生成');

        // 更新数据库
        console.debug(`[修改密码] 更新开始 | 用户ID: ${user.userId}`);
        await pool.query(
            `UPDATE users SET password = ? 
            WHERE userId = ?`,
            [newHash, user.userId]
        );

        // 记录安全日志
        console.info(`[修改密码] 成功 | 用户ID: ${user.userId}`);
        res.status(200).json({
            code: 200,
            message: '密码修改成功',
            data: { userId: user.userId }
        });

    } catch (error) {
        console.error(`[修改密码] 系统错误: ${error.message}`, {
            stack: error.stack,
            params: {
                identifier: maskIdentifier(identifier),
                oldPassword: '******',
                newPassword: '******'
            }
        });
        res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
};

export { register, login, resetPassword, changePassword };