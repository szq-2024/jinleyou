// mock/index.js
import Mock from 'mockjs'

// 只在开发环境启用Mock
if (process.env.NODE_ENV === 'development') {
  // 用户相关
  Mock.mock(/\/api\/user\/getBanner/, 'get', {
    code: 200,
    data: {
      banners: [
        { id: 1, image: '/static/banner1.jpg', link: '' },
        { id: 2, image: '/static/banner2.jpg', link: '' }
      ]
    }
  })

  Mock.mock(/\/api\/user\/info/, 'get', {
    code: 200,
    data: {
      id: 1001,
      nickname: '测试用户',
      avatar: '/static/avatar.jpg',
      gender: 1,
      age: 28
    }
  })

  // 行程相关
  Mock.mock(/\/api\/trip\/list/, 'get', (options) => {
    const params = JSON.parse(options.body)
    return {
      code: 200,
      data: {
        list: [
          {
            id: 1,
            user: { nickname: '测试用户', avatar: '/static/avatar.jpg' },
            destination: '云南大理',
            startDate: '2023-10-01',
            endDate: '2023-10-07',
            description: '寻找一起游大理的小伙伴',
            tags: ['摄影', '骑行', '美食'],
            likeCount: 12,
            isLiked: false
          }
        ],
        total: 1,
        page: params.page || 1
      }
    }
  })
}