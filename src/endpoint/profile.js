const Profile = require('../data/ProfileSchema')
const User = require('../data/UserSchema')
const sidCookie='sid'

const get_profile=(req,res)=>{
    Profile.findOne({'account': req.account})
    .exec((err, result) => {
        if (err) {
            res.sendStatus(401);
        }
        if (result) {
            return res.send({
                account: result.account,
                username: result.username,
                email: result.email,
                phone: result.phone,
                dob: result.dob,
                zipcode: result.zipcode,
                headline: result.headline,
                avatar: result.avatar,
                following:result.following,
                result: 'success'
            })
        }
        return res.sendStatus(400);
    })

}

//GET /headline/:user? returns the headline messages for requested users
const get_headline = (req, res) => {
    let stream = req.account
    if (req.params.user) {
        stream = req.params.user
    };
    Profile.findOne({'account': stream})
    .exec((err, result) => {
        if (err) {
            res.sendStatus(401);
            return errHandler(err);
        }
        console.log(result)
        if (result) {
            return res.send({
                account: stream,
                headline: result.headline,
                result: 'success'
            })
        }
        return res.sendStatus(400);
    })
}


//PUT /headline updates the headline message
const put_headline=(req,res)=>{
    if(!req.body.headline){
        return res.sendStatus(400)
    }
    (async () => {
        let renew = await Profile.findOne({'account': req.account});
        renew.headline = req.body.headline;
        await renew.save();
        return res.send({
            account: req.account,
            headline: renew.headline,
            correspond: 'success'
        })
    })()
}

///phone


const get_phone =(req,res)=>{
    let stream=req.account
    //stream is other user's name
    if(req.params.user){
        stream=req.params.user
    }
   Profile.findOne({'account':stream}).exec((err,correspond)=>{
       if(err){
           res.sendStatus(401)
       }
       if(correspond){
           return res.send({
               account:stream,
               phone:correspond.phone,
           })
       }
       return res.sendStatus(400)
   })
}


//put phone
const put_phone=(req,res)=>{
    (async()=>{
        let renew = await Profile.findOne({'account': stream = req.account});
        renew.phone = req.body.phone;
        await renew.save();
        return res.send({
            account: stream = req.account,
            phone: renew.phone,
        })
    })()
}

//GET /email/:user?
const get_email=(req,res)=>{
    let stream=req.account
    //stream is other user's name
    if(req.params.user){
        stream=req.params.user
    }
   Profile.findOne({'account':stream}).exec((err,correspond)=>{
       if(err){
           res.sendStatus(401)
       }
       if(correspond){
           return res.send({
               account:stream,
               email:correspond.email,
               correspond:'success'
           })
       }
       return res.sendStatus(400)
   })

}
//PUT /email
const put_email=(req,res)=>{
    (async()=>{
        let renew = await Profile.findOne({'account': stream = req.account});
        renew.email = req.body.email;
        await renew.save();
        return res.send({
            account: stream = req.account,
            email: renew.email,
            correspond: 'success'
        })
    }
    )()
}
//GET /zipcode/:user?



const get_zipcode =(req,res)=>{
    let stream=req.account
    //stream is other user's name
    if(req.params.user){
        stream=req.params.user
    }
   Profile.findOne({'account':stream}).exec((err,correspond)=>{
       if(err){
           res.sendStatus(401)
       }
       if(correspond){
           return res.send({
               account:stream,
               zipcode:correspond.zipcode,
           })
       }
       return res.sendStatus(400)
   })
}

//PUT /zipcode
const put_zipcode=(req,res)=>{
    (async()=>{
        let renew = await Profile.findOne({'account': stream = req.account});
        renew.zipcode = req.body.zipcode;
        await renew.save();
        return res.send({
            account: stream = req.account,
            zipcode: renew.zipcode,
        })
    })()
}

//GET /avatar/:user?
const get_Avatar = (req, res) => {
    let stream = req.account
    if (req.params.user) {stream = req.params.user};
    Profile.findOne({'account': stream})
    .exec((err, correspond) => {
        if (err) {
            res.sendStatus(401);
            return errHandler(err);
        }
        if (correspond) {
            return res.send({
                account: stream,
                avatar: correspond.avatar,
            })
        }
        return res.sendStatus(400);
    })
}

//PUT /avatar
const put_Avatar = (req, res) => {
    (async () => {
        let renew = await Profile.findOne({'account': req.account});
        renew.avatar = req.body.avatar;
        await renew.save();
        return res.send({
            account: req.account,
            avatar: renew.avatar,
        })
    })()
}

//Get /dob
const get_dob=(req,res)=>{
    let stream = req.account
    if (req.params.user) {stream = req.params.user};
    Profile.findOne({'account': stream})
    .exec((err, correspond) => {
        if (err) {
            res.sendStatus(401);
            return errHandler(err);
        }
        if (correspond) {
            return res.send({
                account: stream,
                dob: correspond.birthdate,
            })
        }
        return res.sendStatus(400);
    });

}
 

 //GET /following/:user?
 const get_follower = (req, res) => {
    let stream = req.account
    if (req.params.user){
        stream = req.params.user
    }
    Profile.findOne({'account': stream})
    .exec((err, correspond) => {
        if (err) {
            res.sendStatus(401);
        }
        if (correspond) {
            return res.send({
                account : stream,
                following: correspond.follower,
                result:'success'
            })
        }
        return res.sendStatus(400);
    })
}
 //PUT /following/:user
const put_follower=async(req,res)=>{
    // User.findOne（{'account': req.account}）
    let exist = await User.findOne({'account':req.body.account})
    if(!exist){
        return res.sendStatus(401)
    }else{
    Profile.findOneAndUpdate(
        {'account': req.account},
        {$push: {follower: req.params.user}},
        (err, result) => {
            if (err) {
                console.error(error);
                return res.sendStatus(400);
            } else {
                return res.send({
                    account : req.account,
                    following: [...result.follower, req.params.user],
                    result:'success'
                })
            }
        });
    }
}


//Delete follower/:user

const delete_follower = (req, res) => {
    Profile.findOneAndUpdate(
        {'account': req.account},
        {$pull: {follower: req.params.user}},
        (err, correspond) => {
            if (err) {
                return res.sendStatus(400);
            } else {
                return res.send({
                    account : req.account,
                    following: correspond.follower.filter(ele => ele !== req.params.user),
                })
            }
        });
}


module.exports = (app) => {
    app.get('/profile',get_profile)
    /** Headline */
    app.get('/headline' + '/:user?', get_headline);
    app.put('/headline', put_headline);
     /** Username */
   

     /** Phone*/
    app.get('/phone',get_phone)
    app.put('/phone',put_phone)

    /** Email */
    app.get('/email' + '/:user?', get_email);
    app.put('/email', put_email);
    /** DOB */
    app.get('/dob' + '/:user?', get_dob);
    /** Zipcode */
    app.get('/zipcode' + '/:user?', get_zipcode);
    app.put('/zipcode', put_zipcode);
    /** Avatar */
    app.get('/avatar' + '/:user?', get_Avatar);
    app.put('/avatar', put_Avatar);
    /** Following */
    app.get('/following' + '/:user?', get_follower);
    app.put('/following' + '/:user', put_follower);
    //  x? delete other users 
    //? me and other users
    app.delete('/following' + '/:user', delete_follower);
    
}