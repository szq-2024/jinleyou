// api/auth.js
export const checkTokenExpiration = () => {
  const token = uni.getStorageSync('token');
  if (!token) return null;

  try {
    // 1. 安全分割Token
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('非法Token格式');

    // 2. 提取并修复Base64Url
    let payloadBase64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // 3. 补充Base64填充
    while (payloadBase64.length % 4) {
      payloadBase64 += '=';
    }

    // 4. 兼容小程序环境的解码方法
    const decodedStr = decodeBase64(payloadBase64);
    console.log('🔍 解码后的Payload字符串:', decodedStr);

    // 5. 解析JSON
    const decoded = JSON.parse(decodedStr);
    
    // 6. 验证有效期
	const bufferTime = 300000; // 5分钟
    const isExpired = Date.now() >= decoded.exp * 1000;
    return isExpired ? null : token;

  } catch (error) {
    console.error('🚨 Token解析异常', {
      token,
      error: error.message,
      stack: error.stack
    });
    uni.removeStorageSync('token');
    return null;
  }
};

// 专为小程序优化的Base64解码
function decodeBase64(base64) {
  const bytes = uni.base64ToArrayBuffer(base64);
  const byteArray = new Uint8Array(bytes);
  let binary = '';
  for (let i = 0; i < byteArray.length; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return decodeURIComponent(escape(binary));
}