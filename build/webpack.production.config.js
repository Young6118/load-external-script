const path = require('path');
const pkgJson = require('../package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

// 生成组件的全局变量名
const getLibName = () => pkgJson.name.replace(/-(\w)/g, (a, b) => b.toUpperCase())
    .replace('mihoyo', 'miHoYo');



// // 构建入口文件
// const makeEntry = () => {
//   const entry = {};
//   const files = fs.readdirSync(resolve('./src/components'));

//   files.forEach((fullpath) => {
//     if (/\.js$/gi.test(fullpath)) {
//       const fileName = fullpath.split('/')
//         .pop()
//         .replace('.js', '');
//       const filePath = resolve(`./src/components/${fullpath.split('/')
//         .pop()}`);

//       entry[fileName] = filePath;
//     }
//   });
//   console.log(entry);

//   return entry;
// };

module.exports = {
  // 入口
  entry: {
    main: resolve('src/components/main.js')
  },

  output: {
    path: resolve('dist'), // 打包后的文件存放的地方
    library: getLibName(), // script访问的组件变量名，默认是组件名转camelCase
    libraryTarget: 'umd', // 打成通用的UMD模块模式
    libraryExport: 'default',
    filename: '[name].js', // 打包后输出文件的文件名
    globalObject: 'typeof self !== \'undefined\' ? self : this' // ssr兼容
  },

  externals: [
    (context, request, callback) => {
      // 过滤掉所有node_modules里安装的包，这些依赖在应用使用这个组件的时候，再install，不打到包里，这里只做引用即可
      // npm 包引用有下面三种形式
      // 1、axios ，不带/
      // 2、@nuxt/nuxt
      // 3、art-template/lib/template-web
      if (!request.includes('/') || request.startsWith('@') || /^[a-z]+/i.test(request)) {
        const moduleType = {
          commonjs: request,
          commonjs2: request,
          amd: request
        };
        
        // 常用库，全局访问的处理，目的使组件能应用到原生的环境里
        switch(request.toLowerCase()) {
          case 'jquery':
          case 'zepto':
            moduleType.root = '$';
            break;
          case 'lodash':
            moduleType.root = '_';
            break;
          case 'axios':
            moduleType.root = 'axios';
            break;
          case 'art-template/lib/template-web':
            moduleType.root = 'template';
              break;
          default:
        }
        return callback(null, moduleType);
      }
      return callback(); // 非npm包，正常返回
    }
  ],

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass')
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },

  plugins: [],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules\//,
          name: 'vendors',
          priority: -20,
          chunks: 'all'
        }
      }
    }
  }
};
