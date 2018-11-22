var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
// mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds019143.mlab.com:19143/node-api', { useNewUrlParser: true });
// mongoose.connect('mongodb://daniel:123123qwe@ds113454.mlab.com:13454/node-api', { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.once('open', () => {
    console.log('connected to the database');
});

module.exports = {mongoose};