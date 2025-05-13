import 'dotenv/config'; // 直接加载环境变量
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// 监听连接池事件（关键！）
pool.on('connection', (conn) => {
    console.log('🟢 新数据库连接建立');
});

pool.on('error', (err) => {
    console.error('🔴 数据库连接池错误:', err.stack); // [!code focus]
});

export { pool };