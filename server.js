const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = []

app.get("/users/", (request, response) => {
    response.json(users)
});

app.get("/users/login", (request, response) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
      }else {
        jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
          if (error) {
            response.status(401);
            response.send("Invalid JWT Token");
          }else{
              response.send("True");
          }
        });
      }
});

app.post("/register", async (request, response) => {
    const { username, password} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = users.find(user => user.username = username)
    if (name === undefined){
        const user = {name: username, password: hashedPassword}
        users.push(user)
        response.status(200);
        response.send("User created successfully");
    }
    else{
        response.status(400);
        response.send("User already exists");
    }
  });

  app.post("/login", async (request, response) => {
    const { username, password } = request.body;
    let itemIndex = users.findIndex(function(eachItem){
        if (eachItem.name === username){
            return true;
        }else{
            return false;
        }
    })
    if (itemIndex === -1) {
      response.status(400);
      response.send("Invalid user");
    } else {
        const databaseUser = users[itemIndex];
        const isPasswordMatched = await bcrypt.compare(
        password,
        databaseUser.password
      );
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid password");
      }
    }
  });


app.listen(4000)