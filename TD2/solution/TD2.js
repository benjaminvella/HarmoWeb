let token = "";
window.addEventListener('load', function () {

    /* Exercise 3 */
    document.getElementById("signupButton").addEventListener("click", function() {
        const values = {
            username: document.getElementById("signupUsername").value,
            password: document.getElementById("signupPassword").value,
            message: document.getElementById("signupMessage").value
        }

        fetch("http://localhost:8765/signup", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then( (response) => {
            console.log(response);
        });
    });
    /* End Exercise 3 */

    /* Exercise 4 */
    document.getElementById("loginButton").addEventListener("click", function() {
        const values = {
            username: document.getElementById("loginUsername").value,
            password: document.getElementById("loginPassword").value,
        }

        fetch("http://localhost:8765/login", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(async (response) => {
            // if the login worked, we should save the token.
            token = await response.text();
        });
    });
    /* End Exercise 4 */

    /* Exercise 5 */
    document.getElementById("messageButton").addEventListener("click", function() {
        fetch("http://localhost:8765/getMesssage", {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // Usually there is a real syntax for tokens to be recognized, but here we don't need special treatment.
                'Token': token
            },
        }).then(async (response) => {
            // if the login worked, we should save the token.
            console.log(await response.text());
        });
    });
    /* End Exercise 5 */



});