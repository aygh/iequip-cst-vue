const path = require('path')

var proEnv = require('./config/pro.env');  // 生产环境
var uatEnv = require('./config/uat.env');  // 测试环境
var devEnv = require('./config/dev.env');  // 开发环境
const env = process.env.NODE_ENV;
let target = '';
// 默认是开发环境
if (env === 'production') {  // 生产环境
    target = proEnv.hosturl;
} else if (env === 'test') { // 测试环境
    target = uatEnv.hosturl;
} else {                  // 开发环境
    target = devEnv.hosturl;
}

module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule('js')
            .exclude
            .add(path.resolve(__dirname, './src/pjf'))
            .add(path.resolve(__dirname, './src/proto'))
            .end()
    },
    devServer: {
        // host: '0.0.0.0',
        // port: 8080,
        // disableHostCheck: true,
        proxy: {
            '/iequip': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/iequip': '/iequip'
                }
            },
            'upload': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/upload': '/upload'
                }
            },
            'login': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/login': '/login'
                }
            },
            '/api': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            },
        }
    }
}