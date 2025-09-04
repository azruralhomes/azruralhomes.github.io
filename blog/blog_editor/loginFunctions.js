//api url
const loginURL = "https://t6gz4jxvn3.execute-api.us-east-2.amazonaws.com/login/auth";

//the dictionary to format the fetch request
var restOptions = {
    method: '',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://*',
    },
};

/**
 * logs in and stores token, switches to editor page
 * @param
 * @returns
*/
async function login() {
    let user = document.getElementById('username_input').value;
    let pass = document.getElementById("password_input").value;

    localStorage.clear();

    data = {};
    data["username"] = user;
    data["password"] = pass;

    restOptions['method'] = 'POST'
    restOptions['body'] = JSON.stringify(data);

    let result = '';

    try {
        const response = await fetch(loginURL, restOptions);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        result = await response.json();
    } catch (error) {
        console.error(error.message);
        return 0;
    }

    if (result !== 0 && 'token' in result) {
        let token = result['token'];
        localStorage.setItem('compassrosecoding_token', token)

        window.location.href = "editor.html";
    }
    else {
        document.getElementById('error_message').style.display = 'block'
    }
}