/** Packages */
const express = require('express');
const cookieParser = require('cookie-parser');
global.mongoose = require('mongoose');
/** MongoDB */
const connectionString = 'mongodb+srv://Yuxin1221:X9RJShRAUgEBjLgJ@cluster0.qhbbl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
/** middleware and End points */
const account = require('./src/endpoint/account');
const profile = require('./src/endpoint/profile');
const post=require('./src/endpoint/post')
const cors = require('cors')


mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
     if (false) {
          mongoose.connection.db.listCollections().toArray((err, names) => {
               if (err) return console.error(err);
               for (let i=0; i<names.length; i++) {
                    if (names[i].name === "users") {
                         mongoose.connection.db.dropCollection('users', (err, result) => {
                              console.log('Collection users droped');
                         })
                    }
                    if (names[i].name === "profiles") {
                         mongoose.connection.db.dropCollection('profiles', (err, result) => {
                              console.log('Collection profiles droped');
                         })
                    }
                    if (names[i].name === "posts") {
                         mongoose.connection.db.dropCollection('posts', (err, result) => {
                              console.log('Collection posts droped');
                         })
                    }
               }
           })
     }
     console.log("Connect!")
})
.catch( err => console.error('MongoDB connection error: ', err));

module.exports.mongoose = mongoose;

////////????????
const app = express();
const whitelist = ['https://localhost:3000','https://yk60-final.surge.sh']
app.use(cors({origin: whitelist // 'http://localhost:3000'
, credentials: true})) 
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
     console.log(req.method + ' ' + req.url);
     next();
})
app.get('/', (req, res) => {res.send('goofy-bells.surge.sh')});

account(app)
profile(app)
post(app)


 
// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`listening at http://${addr.address}:${addr.port}`)
});
