require('es6-promise').polyfill()
require('isomorphic-fetch')
const url = path => `http://localhost:3001${path}`;
let cookie
const testdata={
    account: "222",
    email: "email2",
    phone: "222-222-2222",
    birthdate: Date.now(),
    zipcode: "22222",
    password: "222222",
    headline: "HI!I am  li",
    avatar: "head",
}
var postId;
const testPost = {
    title: 'title',
    content: 'content',
    image: 'image',
}

// Unit test to validate POST /register
describe('test post register',()=>{
    it('user register', async (done) => {
        return fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testdata)
        }).then(res => res.json()).then(res => {
            expect(res.account).toEqual(testdata.account);
            expect(res.email).toEqual(testdata.email);
            expect(res.phone).toEqual(testdata.phone);
            expect(res.zipcode).toEqual(testdata.zipcode);
            expect(res.password).toEqual(testdata.password);
            expect(res.headline).toEqual(testdata.headline);
            expect(res.avatar).toEqual(testdata.avatar);
            expect(res.result).toEqual('success');
            done();
        }).catch(err => {done(new Error(err))});
    }); 
})

//Unit test to validate POST /login

describe('test to validate post login',()=>{
    it('user Login', async (done) => {
        return fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'account':testdata.account,
                'password':testdata.password
            })
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.account).toEqual(testdata.account);
            expect(res.result).toEqual('success') 
            done();
        }).catch(err => {done(new Error(err))});
    }); 
}) 

  	
	
//Unit test to validate POST /article
describe('Unit test to validate POST /article',async()=>{
    const fakePost = {
        title: 'fakeTitle',
        content: 'fakeContent',
        image: 'fakeImage',
    }
    var postId;
    it('post an article', async (done) => {
        return fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
            body: JSON.stringify(fakePost),
        })
        .then(res => res.json())
        .then(res => {
            postId = res.posts[0]._id;
            expect(res.posts[0].title).toEqual(fakePost.title);
            expect(res.posts[0].content).toEqual(fakePost.content);
            done();
        })
        .catch(err => {done(new Error(err))});
    })
}) 

//Unit test to validate GET /articles  
 describe('validate GET /articles ',async()=>{
    it('test get articles', async (done) => {
        return fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
        })
        .then(res => res.json())
        .then(res => {
            expect(res.posts.length).toEqual(1);
            done();
        })
        .catch(err => {done(new Error(err))});
    }) 
}) 




//Unit test to validate GET /articles/id
describe('Unit test to validate GET /articles/id',async()=>{
     it('validate GET /articles/id -post - user', async (done) => {
        return fetch(url('/articles' + '/' + testdata.account), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
        }) 
        .then(res => res.json())
        .then(res => {
            expect(res.posts.length).toEqual(1);
            done();
        })
        .catch(err => {done(new Error(err))});
    })     
}) 


//test to validate PUT /logout	2
describe('test out logout', () => {
    it('User logout', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie }
        }).then(res => res.json())
        .then(res => {
            expect(res.result).toEqual('success');
            done();
        }).catch(err => { done(new Error(err)) });
    });
}); 

