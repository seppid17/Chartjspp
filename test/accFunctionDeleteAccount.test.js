const dotenv =  require("dotenv");
const { json } = require("express");
dotenv.config({ path: ".env" });
dotenv.config({ path: "test/test.env" });
const superagent = require('superagent');
const user1 = superagent.agent();
const domain = 'http://localhost:'+process.env.PORT;


beforeAll(async () => {
    let res =  await user1
    .post(domain+"/login")
    .send({ email: process.env.EMAIL, password: process.env.PASSWORD })
});

let isJson = jsonstr => {
    try {
        let obj = JSON.parse(jsonstr);
        return true;
    } catch (e) {
        return false;
    }
}

test('Test 1: Password cannot be empty', async() => {
    let res = await user1.post(domain+"/account/delete").send({});
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj  = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");
});

test("Test 2: invalid password type",async () =>{
    let res = await user1.post(domain+"/account/delete").send({password:12345});
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj  = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");
});


test("Test 3: Incorrect password",async () =>{
    let res = await user1.post(domain+"/account/delete").send({password:"Notpassword"});
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj  = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Incorrect password");
});