# 天津旅行小程序 API 文档
这是一个基于Node.js的后端项目，数据库地址是localhost：3306，用户名:root，密码：Rjn225080，数据库名：jinleyou
## 基础信息

- 基础URL: `http://localhost:5173/api`
- 所有请求和响应均使用JSON格式
- 认证方式: Bearer Token (在请求头中添加 `Authorization: Bearer <token>`)

## 通用响应格式

```json
{
  "code": 200,       // 状态码: 200成功, 400请求错误, 401未授权, 403禁止访问, 404未找到, 500服务器错误
  "message": "成功",  // 响应消息
  "data": {}         // 响应数据
}
```

## 认证相关接口

### 1. 用户注册

- **URL**: `/auth/register`
- **方法**: `POST`
- **描述**: 用户注册新账号
- **请求参数**:
  ```json
  {
    "username": "用户名",  // 4-20位字母、数字或中文
    "phone": "手机号",     // 11位手机号
    "password": "密码"     // 至少6位
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "userId": "12345",
      "username": "用户名",
      "phone": "13800138000"
    }
  }
  ```

### 2. 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录
- **请求参数**:
  ```json
  {
    "username": "用户名/手机号",
    "password": "密码"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "userId": "12345",
        "username": "用户名",
        "phone": "13800138000",
        "avatar": "头像URL",
        "nickname": "昵称"
      }
    }
  }
  ```

### 3. 发送短信验证码

- **URL**: `/auth/send-sms`
- **方法**: `POST`
- **描述**: 发送短信验证码
- **请求参数**:
  ```json
  {
    "phone": "手机号",
    "type": "register/reset-password/login"  // 验证码类型
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "验证码已发送",
    "data": null
  }
  ```

### 4. 重置密码

- **URL**: `/auth/reset-password`
- **方法**: `POST`
- **描述**: 通过短信验证码重置密码
- **请求参数**:
  ```json
  {
    "phone": "手机号",
    "code": "验证码",
    "password": "新密码"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "密码重置成功",
    "data": null
  }
  ```

### 5. 微信登录

- **URL**: `/auth/wechat-login`
- **方法**: `POST`
- **描述**: 微信登录
- **请求参数**:
  ```json
  {
    "code": "微信登录code",
    "userInfo": {
      "nickName": "昵称",
      "avatarUrl": "头像URL",
      "gender": 1
    }
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "userId": "12345",
        "username": "微信用户",
        "phone": "13800138000",
        "avatar": "头像URL",
        "nickname": "昵称"
      }
    }
  }
  ```

## 旅行计划相关接口

### 1. 获取旅行计划列表

- **URL**: `/travel-plans`
- **方法**: `GET`
- **描述**: 获取旅行计划列表
- **请求参数**:
  - `city`: 城市名称 (URL参数)
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "title": "周末五大道一日游",
          "date": "2023-06-15",
          "destination": "五大道",
          "preference": "美食",
          "description": "详细描述...",
          "city": "天津",
          "userId": "12345",
          "user": {
            "userId": "12345",
            "name": "用户名",
            "avatar": "头像URL"
          },
          "createTime": "2023-06-01T10:00:00Z"
        }
      ]
    }
  }
  ```

### 2. 发布旅行计划

- **URL**: `/travel-plans`
- **方法**: `POST`
- **描述**: 发布新的旅行计划
- **请求参数**:
  ```json
  {
    "title": "标题",
    "date": "2023-06-15",
    "destination": "目的地",
    "preference": "偏好",
    "description": "详细描述",
    "city": "天津"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "发布成功",
    "data": {
      "id": "1",
      "title": "周末五大道一日游",
      "date": "2023-06-15",
      "destination": "五大道",
      "preference": "美食",
      "description": "详细描述...",
      "city": "天津",
      "userId": "12345",
      "user": {
        "userId": "12345",
        "name": "用户名",
        "avatar": "头像URL"
      },
      "createTime": "2023-06-01T10:00:00Z"
    }
  }
  ```

### 3. 获取旅行计划详情

- **URL**: `/travel-plans/:id`
- **方法**: `GET`
- **描述**: 获取旅行计划详情
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "1",
      "title": "周末五大道一日游",
      "date": "2023-06-15",
      "destination": "五大道",
      "preference": "美食",
      "description": "详细描述...",
      "city": "天津",
      "userId": "12345",
      "user": {
        "userId": "12345",
        "name": "用户名",
        "avatar": "头像URL"
      },
      "createTime": "2023-06-01T10:00:00Z",
      "joiners": [
        {
          "userId": "67890",
          "name": "参与者",
          "avatar": "头像URL"
        }
      ]
    }
  }
  ```

### 4. 加入旅行计划

- **URL**: `/travel-plans/:id/join`
- **方法**: `POST`
- **描述**: 加入旅行计划
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "加入成功",
    "data": null
  }
  ```

### 5. 取消加入旅行计划

- **URL**: `/travel-plans/:id/quit`
- **方法**: `POST`
- **描述**: 取消加入旅行计划
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "已取消加入",
    "data": null
  }
  ```

## 导游服务相关接口

### 1. 获取导游服务列表

- **URL**: `/guide-services`
- **方法**: `GET`
- **描述**: 获取导游服务列表
- **请求参数**:
  - `city`: 城市名称 (URL参数)
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "list": [
        {
          "id": "1",
          "title": "五大道历史讲解",
          "type": "历史讲解",
          "duration": 2,
          "price": 200,
          "description": "详细描述...",
          "city": "天津",
          "userId": "12345",
          "user": {
            "userId": "12345",
            "name": "用户名",
            "avatar": "头像URL"
          },
          "createTime": "2023-06-01T10:00:00Z"
        }
      ]
    }
  }
  ```

### 2. 发布导游服务

- **URL**: `/guide-services`
- **方法**: `POST`
- **描述**: 发布新的导游服务
- **请求参数**:
  ```json
  {
    "title": "标题",
    "type": "服务类型",
    "duration": 2,
    "price": 200,
    "description": "详细描述",
    "city": "天津"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "发布成功",
    "data": {
      "id": "1",
      "title": "五大道历史讲解",
      "type": "历史讲解",
      "duration": 2,
      "price": 200,
      "description": "详细描述...",
      "city": "天津",
      "userId": "12345",
      "user": {
        "userId": "12345",
        "name": "用户名",
        "avatar": "头像URL"
      },
      "createTime": "2023-06-01T10:00:00Z"
    }
  }
  ```

### 3. 获取导游服务详情

- **URL**: `/guide-services/:id`
- **方法**: `GET`
- **描述**: 获取导游服务详情
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "1",
      "title": "五大道历史讲解",
      "type": "历史讲解",
      "duration": 2,
      "price": 200,
      "description": "详细描述...",
      "city": "天津",
      "userId": "12345",
      "user": {
        "userId": "12345",
        "name": "用户名",
        "avatar": "头像URL"
      },
      "createTime": "2023-06-01T10:00:00Z",
      "bookings": [
        {
          "id": "1",
          "userId": "67890",
          "user": {
            "userId": "67890",
            "name": "预约者",
            "avatar": "头像URL"
          },
          "date": "2023-06-15",
          "status": "pending" // pending, confirmed, completed, cancelled
        }
      ]
    }
  }
  ```

### 4. 预约导游服务

- **URL**: `/guide-services/:id/book`
- **方法**: `POST`
- **描述**: 预约导游服务
- **请求参数**:
  ```json
  {
    "date": "2023-06-15"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "预约成功",
    "data": {
      "id": "1",
      "guideServiceId": "1",
      "userId": "67890",
      "date": "2023-06-15",
      "status": "pending",
      "createTime": "2023-06-01T10:00:00Z"
    }
  }
  ```

### 5. 取消预约

- **URL**: `/guide-services/bookings/:id/cancel`
- **方法**: `POST`
- **描述**: 取消预约
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "已取消预约",
    "data": null
  }
  ```

## 用户相关接口

### 1. 获取用户信息

- **URL**: `/users/profile`
- **方法**: `GET`
- **描述**: 获取当前用户信息
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "userId": "12345",
      "username": "用户名",
      "phone": "13800138000",
      "avatar": "头像URL",
      "nickname": "昵称",
      "gender": 1,
      "createTime": "2023-06-01T10:00:00Z"
    }
  }
  ```

### 2. 更新用户信息

- **URL**: `/users/profile`
- **方法**: `PUT`
- **描述**: 更新用户信息
- **请求参数**:
  ```json
  {
    "nickname": "新昵称",
    "avatar": "新头像URL",
    "gender": 1
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "userId": "12345",
      "username": "用户名",
      "phone": "13800138000",
      "avatar": "新头像URL",
      "nickname": "新昵称",
      "gender": 1,
      "createTime": "2023-06-01T10:00:00Z"
    }
  }
  ```

### 3. 获取我的旅行计划

- **URL**: `/users/travel-plans`
- **方法**: `GET`
- **描述**: 获取当前用户发布的旅行计划
- **请求参数**:
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 10,
      "list": [
        {
          "id": "1",
          "title": "周末五大道一日游",
          "date": "2023-06-15",
          "destination": "五大道",
          "preference": "美食",
          "description": "详细描述...",
          "city": "天津",
          "userId": "12345",
          "user": {
            "userId": "12345",
            "name": "用户名",
            "avatar": "头像URL"
          },
          "createTime": "2023-06-01T10:00:00Z",
          "joiners": [
            {
              "userId": "67890",
              "name": "参与者",
              "avatar": "头像URL"
            }
          ]
        }
      ]
    }
  }
  ```

### 4. 获取我加入的旅行计划

- **URL**: `/users/joined-travel-plans`
- **方法**: `GET`
- **描述**: 获取当前用户加入的旅行计划
- **请求参数**:
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 5,
      "list": [
        {
          "id": "2",
          "title": "意式风情街半日游",
          "date": "2023-06-20",
          "destination": "意式风情街",
          "preference": "摄影",
          "description": "详细描述...",
          "city": "天津",
          "userId": "67890",
          "user": {
            "userId": "67890",
            "name": "发布者",
            "avatar": "头像URL"
          },
          "createTime": "2023-06-01T10:00:00Z"
        }
      ]
    }
  }
  ```

### 5. 获取我的导游服务

- **URL**: `/users/guide-services`
- **方法**: `GET`
- **描述**: 获取当前用户发布的导游服务
- **请求参数**:
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 3,
      "list": [
        {
          "id": "1",
          "title": "五大道历史讲解",
          "type": "历史讲解",
          "duration": 2,
          "price": 200,
          "description": "详细描述...",
          "city": "天津",
          "userId": "12345",
          "user": {
            "userId": "12345",
            "name": "用户名",
            "avatar": "头像URL"
          },
          "createTime": "2023-06-01T10:00:00Z",
          "bookings": [
            {
              "id": "1",
              "userId": "67890",
              "user": {
                "userId": "67890",
                "name": "预约者",
                "avatar": "头像URL"
              },
              "date": "2023-06-15",
              "status": "pending"
            }
          ]
        }
      ]
    }
  }
  ```

### 6. 获取我的预约

- **URL**: `/users/bookings`
- **方法**: `GET`
- **描述**: 获取当前用户的导游服务预约
- **请求参数**:
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认10)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 2,
      "list": [
        {
          "id": "2",
          "guideServiceId": "3",
          "guideService": {
            "id": "3",
            "title": "天津之眼夜景导览",
            "type": "定制行程",
            "duration": 3,
            "price": 300,
            "description": "详细描述...",
            "city": "天津",
            "userId": "67890",
            "user": {
              "userId": "67890",
              "name": "导游",
              "avatar": "头像URL"
            }
          },
          "date": "2023-06-25",
          "status": "confirmed",
          "createTime": "2023-06-01T10:00:00Z"
        }
      ]
    }
  }
  ```

## 聊天相关接口

### 1. 获取聊天列表

- **URL**: `/chats`
- **方法**: `GET`
- **描述**: 获取当前用户的聊天列表
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": "1",
        "userId": "67890",
        "user": {
          "userId": "67890",
          "name": "聊天对象",
          "avatar": "头像URL"
        },
        "lastMessage": "你好，我对你的旅行计划感兴趣",
        "unreadCount": 2,
        "updateTime": "2023-06-01T10:00:00Z"
      }
    ]
  }
  ```

### 2. 获取聊天消息

- **URL**: `/chats/:id/messages`
- **方法**: `GET`
- **描述**: 获取与指定用户的聊天消息
- **请求参数**:
  - `page`: 页码 (默认1)
  - `limit`: 每页数量 (默认20)
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 50,
      "list": [
        {
          "id": "1",
          "chatId": "1",
          "senderId": "67890",
          "content": "你好，我对你的旅行计划感兴趣",
          "type": "text",
          "createTime": "2023-06-01T10:00:00Z"
        },
        {
          "id": "2",
          "chatId": "1",
          "senderId": "12345",
          "content": "好的，我们可以一起讨论",
          "type": "text",
          "createTime": "2023-06-01T10:05:00Z"
        }
      ]
    }
  }
  ```

### 3. 发送消息

- **URL**: `/chats/:id/messages`
- **方法**: `POST`
- **描述**: 发送消息给指定用户
- **请求参数**:
  ```json
  {
    "content": "消息内容",
    "type": "text"  // text, image, location
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "发送成功",
    "data": {
      "id": "3",
      "chatId": "1",
      "senderId": "12345",
      "content": "消息内容",
      "type": "text",
      "createTime": "2023-06-01T10:10:00Z"
    }
  }
  ```

### 4. 标记消息为已读

- **URL**: `/chats/:id/read`
- **方法**: `POST`
- **描述**: 标记与指定用户的聊天消息为已读
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "标记成功",
    "data": null
  }
  ``` 