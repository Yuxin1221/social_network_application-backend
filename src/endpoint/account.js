global.redis = require('redis').createClient('redis://:pe5add0ad33cb588333097071a23c67696b5259cff6a48278a17dd6f5ab5065cd@ec2-35-174-227-122.compute-1.amazonaws.com:10669')
redis.flushall((err, reply) => {
    if (err) {
        console.log(" error: " + err)}
    console.log("Empty Redis: " + reply);
})
const User = require('../data/UserSchema')
const Profile = require('../data/ProfileSchema')
const Auth = require('../middleware/auth')
const md5 = require('md5')
const sidCookie = 'sid'
const Expiretime = 2400
var count =0

//post login in returns a username and message
const post_login = async (req, res) =>{
    /// account is exist?
    console.log('post_login')
    let accountname = req.body.account
    let password = req.body.password
     //find accountnname from database
     let userDB = await User.findOne({'accountname':accountname})
     console.log(userDB)
    let current_hash = md5(userDB.salt+password)
    if (!accountname || !password) {
        return res.sendStatus(400);
    }
   

    if(!userDB){
        return res.sendStatus(401)
    }
    console.log(current_hash);
    console.log(userDB.hash);
    if(current_hash === userDB.hash){
        let sid = count++
        redis.setex(sid, Expiretime, accountname);
        res.cookie(sidCookie, sid, { maxAge: Expiretime * 1000, httpOnly: false,secure:true,sameSite:"none"});
        res.send({account: accountname, result: 'success'});
    }
    else{
        res.sendStatus(401)
    }  
}
//Backend: POST /register updates the list of registered users
const post_register = async(req, res)=>{
    if(!req.body.account||!req.body.password||!req.body.email || !req.body.birthdate || !req.body.zipcode || !req.body.phone){
        return res.status(400).send('please input all the required field')
    }
    const used = await User.findOne({'accountname':req.body.account})
    if(used){
        return res.status(400).send('Username have existed')
    }
    //add current information to the moogoDB
    let newProfile = await Profile.create({
        account: req.body.account,
        email: req.body.email,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
        zipcode: req.body.zipcode,
        headline: req.body.headline,
        avatar: req.body.avatar,
    })
    let salt = req.body.account + new Date().getTime();
    let hash = md5(salt + req.body.password);
    let newUser = await User.create({
        accountname: req.body.account,
        password: req.body.password,
        salt: salt,
        hash: hash,
    })
   
    //
    return res.json({
        account: newProfile.account,
        email: newProfile.email,
        phone: newProfile.phone,
        birthdate: newProfile.birthdate,
        zipcode: newProfile.zipcode,
        password: newUser.password,
        headline: newProfile.headline,
        avatar: newProfile.avatar,
        result:'success'
    })

}
    
// PUT /logout logs out user and removes session id
const put_logout = (req, res) => {
    console.log('put_logout');
    let sid = req.cookies[sidCookie];
    if (!req.cookies) {
        //invalid unauthorized
        return res.sendStatus(401);
    }
    if (!sid) {
        return res.sendStatus(401);
    }
    redis.del(sid);
    res.cookie(sidCookie, sid, { maxAge: 2 * 1000, httpOnly: false,sameSite:'none',secure:true });
    res.send({result:'success'});
}

// Backend: Stub: PUT /password
const put_password =async(req, res)=>{
    if (!req.body.account || !req.body.password) {
        return res.status(400).send('Please input password and accountname');
    }
    const exist = await User.findOne({'accountname': req.body.account});
    if (!exist) {
        return res.status(401).send('User cannot be found');
    }
    let salt = req.body.account + new Date().getTime();
    let hash = md5(salt + req.body.password);
    exist.password = req.body.password;
    exist.salt = salt;
    exist.hash = hash;
    return res.json({status: 'success', accountname: exist.accountname});
}


module.exports = (app) => {
    app.post('/login', post_login);
    app.post('/register', post_register);
    Auth(app)
    app.put('/logout', put_logout);
    app.put('/password', put_password);
}