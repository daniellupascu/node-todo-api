var env = process.env.NODE_ENV || 'development';
var config = require('./config.json');

// if(env === 'development' || env === 'test') {
//     var envConfig = config[env];
//     Object.keys(envConfig).forEach(key => {
//         process.env[key] = envConfig[key]
//     });
// }

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
} else if (env === 'production') {
    process.env.MONGODB_URI = 'mongodb://daniel:123123qwe@ds113454.mlab.com:13454/node-api';
}