module.exports = {
  title: '逆夏的博客',
  description: '凉风把枫叶吹红，冷言让强者成熟',
  base: '/',
  serviceWorker: true,
  themeConfig: {
    nav: [{
        text: '博客',
        link: '/blog/引言/引言'
      }, // 外部链接
      // 下拉列表
      {
        text: 'GitHub',
        items: [{
          text: 'GitHub地址',
          link: 'https://github.com/yuanzhengqiang'
        }]
      }
    ],
    sidebar: [
      {
        title: '引言',
        link: '/blog/引言/引言'
      },
      {
        title: '基础',
        children: [
          {
            title: 'JS',
            children: [
              ['/blog/基础/JS/包装对象', '包装对象'],
              ['/blog/基础/JS/内存机制', '内存机制'],
              ['/blog/基础/JS/词法环境', '词法环境'],
            ]
          },
          {
            title: 'HTML',
            children: [
              ['/blog/基础/HTML/link标签', 'link标签'],
              ['/blog/基础/HTML/Beacon', 'API-Beacon']
            ]
          }
        ]
      },
      {
        title: '框架',
        children: [
          {
            title: 'Vue',
            children: [
              ['/blog/框架/Vue/vue-router源码解析', 'vue-router源码解析']
            ]
          }
        ]
      },
      {
        title: '浏览器',
        children: [
          {
            title: '基础',
            children: [
              ['/blog/浏览器/基础/站点隔离', '站点隔离'],
              ['/blog/浏览器/基础/工作原理', '工作原理']
            ]
          },
          {
            title: '构成',
            children: [
              ['/blog/浏览器/构成/内部结构', '内部结构']
            ]
          },
          {
            title: '渲染',
            children: [
              ['/blog/浏览器/渲染/导航过程', '导航过程'],
              ['/blog/浏览器/渲染/渲染过程', '渲染过程'],
              ['/blog/浏览器/渲染/事件处理', '事件处理'],
              ['/blog/浏览器/渲染/css硬件加速', 'css硬件加速']
            ]
          },
          {
            title: 'V8引擎',
            children: [
              ['/blog/浏览器/V8引擎/V8-数组实现', '数组实现']
            ]
          },
        ]
      },
      {
        title: '网络',
        children: [
          {
            title: '请求',
            children: [
              {
                title: 'Axios',
                children: [
                  ['/blog/网络/请求/Axios/axios-源码分析', '源码分析'],
                ]
              },
              {
                title: 'Fetch',
                children: [
                  ['/blog/网络/请求/Fetch/Fetch', 'Fetch'],
                ]
              },
              {
                title: 'XMLHttpRequest',
                children: [
                  ['/blog/网络/请求/XMLHttpRequest/XMLHttpRequest', 'XMLHttpRequest'],
                ]
              }
            ]
          },
          {
            title: '协议',
            children: [
              {
                title: 'TCP',
                children: [
                  ['/blog/网络/协议/TCP协议', 'TCP协议'],
                ]
              }
            ]
          },
          {
            title: '安全',
            children: [
              {
                title: '安全',
                children: [
                  ['/blog/网络/安全/网络安全', '网络安全'],
                  ['/blog/网络/安全/内容安全策略', '内容安全策略'],
                  ['/blog/网络/安全/HTTP安全头', 'HTTP安全头'],
                  ['/blog/网络/安全/混合内容', '混合内容']
                ]
              }
            ]
          },
          
        ]
      },
      {
        title: '构建',
        children: [
          {
            title: 'webpack',
            children: [
              ['/blog/构建/webpack/webpack', 'webpack'],
            ]
          }
        ]
      },
      {
        title: '算法',
        children: [
          {
            title: '排序',
            children: [
              ['/blog/算法/排序/排序', '排序'],
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: './components'
      }
    ]
  ]
}