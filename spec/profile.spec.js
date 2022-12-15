require('es6-promise').polyfill()
require('isomorphic-fetch')
const url = path => `http://localhost:3001${path}`;
let cookie
const testdata={
    account: "111",
    email: "email1",
    phone: "111-111-1111",
    birthdate: Date.now(),
    zipcode: "11111",
    password: "111111",
    headline: "HI!I am hu",
    avatar: "head",
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





//Unit test to validate GET /headline

  describe('test to validate GET /headline', () => {
    it('test headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
        .then(res => res.json())
        .then(res => {
            expect(res.account).toEqual(testdata.account);
            expect(res.result).toEqual('success');
            done();
        }).catch(err => {done(new Error(err))});
    });


});    

// Unit test to validate PUT /headline

describe('test put headlline', () => {
    it('User headline', (done) => {
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify({headline: 'new headline'})
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            expect(res.account).toEqual(testdata.account);
            expect(res.headline).toEqual('new headline');
            expect(res.correspond).toEqual('success');
            done();
        }).catch(err => {
            done(new Error(err))
        });
    }); 

});  
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
