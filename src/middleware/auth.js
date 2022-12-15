let cookieKey = "sid";
function isLoggedIn(req, res, next) {
    if (!req.cookies) {
       return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.sendStatus(401);
    }
    redis.get(sid, (err, res) => {
        if (err) {return res.sendStatus(401);}
        req.account = res;
        next();
    })
}

module.exports = (app) => {
    app.use(isLoggedIn);
}
