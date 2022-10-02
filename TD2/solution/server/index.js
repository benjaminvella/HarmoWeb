const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const sha256 = require('js-sha256').sha256;
const url = require('url');
const jwt = require('jsonwebtoken');

const secretCode = "mySecret";

/* Exercise 2 */
// If the DB already exists, let's use it.
let db = new sqlite3.Database('my.db', sqlite3.OPEN_READWRITE, (error) => {
    // If the DB doesn't exist, let's create it.
    if (error) {
        console.log("DB do not exist, let's create it");
        let db2 = new sqlite3.Database('my.db', (err) => {
            if (err) {
                console.error("fail.");
            } else {
                db2.run('CREATE TABLE user(name TEXT NOT NULL, password TEXT NOT NULL, secretMessage TEXT)');
                db = db2;
                console.log("Listening to requests...");
            }
        });
    } else {
        console.log("Listening to requests...");
    }
});
/* End exercise 2 */

http.createServer(async function (request, response) {
    /* Exercise 1
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/html' );
    response.end(`${request.method} ${request.url}`);
    */

    /* Exercise 3 */

    // Cancel CORS. Bad practise but efficient.
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "PATCH"]);
    response.setHeader("Access-Control-Allow-Headers", "*");

    const reqUrl =  url.parse(request.url, true);
    console.log('Request type: ' + request.method + ' Endpoint: ' + request.url);

    // OPTIONS is a request sent automatically by browsers to check what method/origin/headers can be part of a request. It comes from the CORS policy.
    // Usually you should only return the correct origins/methods/headers, but for this lab we will just authorize everything.
    if (request.method === 'OPTIONS') {
        response.statusCode = 200;
        response.end();
    } else if (request.method === 'POST') {
        // If the request is a POST, it may have a body, so the first step is to retrieve sent data. For that, the request is iterable, and once complete it is
        // possible to concatenate received data into a string, and into an object thanks to JSON.parse.
        const buffers = [];

        for await (const chunk of request) {
            buffers.push(chunk);
        }

        const data = JSON.parse(Buffer.concat(buffers).toString());
        console.log(data);

        // Never store passwords in clear, encrypt them so that no-one can know anyone's password.
        data.password = sha256(data.password);

        // Exercise 3: If the request is for signup, let's insert the user in the db. In real projects, we should first ensure that the name doesn't already exist
        // and the password is correct.
        if (reqUrl.pathname === '/signup') {
            db.run(`INSERT INTO user (name, password, secretMessage) VALUES(?, ?, ?)`, [data.username, data.password, data.message], function (err) {
                if (err) {
                    response.statusCode = 418;
                    response.end(JSON.stringify(err));
                } else {
                    response.statusCode = 201;
                    response.end("OK");
                }
            });

            // Exercise 4: Login
        } else if (reqUrl.pathname === '/login') {
            db.get(`SELECT name FROM user WHERE name=? and password=?`, [data.username, data.password], function(err, result) {
                if (!err && result) {
                    response.statusCode = 200;
                    // Returns a Json Web Token containing the name. We know this token is an acceptable proof of identity since only the server know the secretCode.
                    response.end(jwt.sign({username: result.name}, secretCode, {expiresIn: "1d"}));
                } else {
                    response.statusCode = 418;
                    console.log(err);
                    response.end(JSON.stringify(err));
                }
            });
        }
    // Exercise 5: Retrieve Secret Message.
    } else if (request.method === 'GET' && reqUrl.pathname === '/getMesssage') {
        // Before retrieving the secret message, we need to ensure the token is valid.
        let token = request.headers.token;
        let decodedToken = jwt.verify(token, secretCode);

        // We should do something if the verification fails, but that's not the point.
        if (!decodedToken.verifyFailed) {
            db.get(`SELECT name, secretMessage FROM user WHERE name=?`, [decodedToken.username], function(err, result) {
                if (!err) {
                    response.statusCode = 200;
                    // Returns a Json Web Token containing the name. We know this token is an acceptable proof of identity since only the server know the secretCode.
                    response.end(JSON.stringify(result));
                } else {
                    response.statusCode = 418;
                    console.log(err);
                    response.end(JSON.stringify(err));
                }
            });
        }


    }
}).listen(8765);