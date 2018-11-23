// const {SHA256} = require('crypto-js');

// var message = 'I am user no 1';
// var hashed = SHA256(message).toString();

// console.log(`Message: ${message}, Hash: ${hashed}`);

// var data = {
//     id: 4,
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// return console.log(resultHash === token.hash);
 
// const jwt = require('jsonwebtoken');

// let data = {
//     id: 10
// };

// let token = jwt.sign(data, '123abc');
// console.log(token);

// let decoded = jwt.verify(token, '123abc')
// console.log(decoded);


let bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    }); 
});

var hashedPass = '$2a$10$MkA9YeoSo4Ug8rcvTkc4IeASsbBmQY2tNJk7sftkDO9YdKfbIm25m';

bcrypt.compare(password, hashedPass, (err, res) => {
    console.log(res);
});