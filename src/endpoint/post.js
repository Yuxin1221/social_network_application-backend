const Post=require('../data/PostSchema')
const Profile=require('../data/ProfileSchema')
// GET /articles returns articles for logged in user
const get_articles=(req,res)=>{
    if(req.params.id){
        //find specific if =>ariticle in mongoDB
        Profile.findOne({'account':req.params.id}).exec((err,result)=>{
            if(err){
                res.sendStatus(400)
            }
            if(result){
               Post.find({'author':req.params.id}).exec((err,result)=>{
                if(err){
                    res.sendStatus(400)
                }
                if(result){
                    return res.send({posts:result})
                }
               })
            }
            else{
                 Post.findOne({'_id': req.params.id})
                 .exec((err, result) => {
                     if (err) {
                         res.sendStatus(400);
                     }
                     if (result) {
                         return res.send({
                             posts: [result],
                             result: 'success'
                         })
                     }
                     return res.sendStatus(400);
                 })
            }
        })
    }
 //  / articles
    else{
        Profile.findOne({'account':req.account}).exec((err,result)=>{
            if(err){
                res.sendStatus(400)
            }
            if(result){
                Post.find({'author':[req.account,...result.follower]}).exec((err,result)=>{
                    return res.send({
                        account:req.account,
                        posts:result,
                        result: 'success'
                    })
                })  
            }
        })

    }
}
	
// POST /article returns an array of articles with newly added article
const put_article = async (req, res) => {
    let comment = req.body.commentId;
    if(comment){
        await Post.findOneAndUpdate(
            {'_id': req.params.id}, 
            {$push: {comment: {text: req.body.text, time: comment}}}
        )
    }
    
    let renew = await Post.find({'author': req.account});
    res.send({
        posts: renew, 
        result: 'success'
    })
}

//POST /article returns an array of articles with newly added article

const post_article = (req, res) => {
    (async () => {
        await Post.create({
            author: req.account,
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
        })
        let renew = await Post.find({'author': req.account});
        if (renew) {
            return res.send({
                account: req.account,
                posts: renew,
                result: 'success'
            })
        }
        return res.sendStatus(400);
    })();
}


module.exports = (app) => {
    app.get('/articles' + '/:id?', get_articles);
     app.put('/articles' + '/:id', put_article);
    app.post('/article', post_article);
}