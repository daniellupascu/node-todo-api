var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds019143.mlab.com:19143/node-api', { useNewUrlParser: true });

module.exports = {mongoose};