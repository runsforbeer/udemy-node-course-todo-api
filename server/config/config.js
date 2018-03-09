var env = process.env.NODE_ENV || 'development';

if(env == 'development' || env == 'test') {
    var config = require('./config.json'); // this converts to a javascript object
    var envConfig = config[env];

    // loop over all config properties, setting on env
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// to start mongodb for local dev: mongod -dbpath ~/code/mongo-data/
// if(env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// } else if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://don:don@ds255767.mlab.com:55767/todoapp';
// } else {
//     process.env.MONGODB_URI = 'mongodb://don:don@ds255767.mlab.com:55767/todoapp';    
// }

