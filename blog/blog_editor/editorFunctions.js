// API urls
const blogURL = "https://u315eql0b6.execute-api.us-east-2.amazonaws.com/blog/scratch_blog";

//the variable for inactivity timeout
let inactiveTimeout = null

//the dictionary to format the fetch request
var restOptions = {
    method: '',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://*',
    },
};


/**
 * authenticates token and initializes the quill editor upon login
 * @param none
 * @returns none
*/
async function editorInit() {
    //authenticate token
    data = {
        'token': localStorage.getItem('compassrosecoding_token'),
        'id': '',
        'body': ''
    }

    restOptions['method'] = 'POST'
    restOptions['body'] = JSON.stringify(data)

    let result = '';

    try {
        const response = await fetch(blogURL, restOptions);
        if (!response.ok) {
            
        }
        result = await response.json();
        getTitles(result);
    } catch (error) {
        console.error(error.message);
        return 0;
    }

    //tag creation upon user hitting enter in tag input
    document.getElementById('tags_input').addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            let tagDiv = document.getElementById('tags_display');
            let newTag = document.getElementById('tags_input');

            //make sure tag does not already exist, if not, makes new tag
            if (!tagDiv.innerHTML.includes('>' + newTag.value + '<')) {
                let tag = document.createElement("button");
                tag.innerText = '#' + newTag.value;
                tag.id = '#' + newTag.value;
                tag.classList.add('tagButton')
                tag.onclick = function (event) {
                    tag.remove()
                }
                tagDiv.appendChild(tag);
            }

            //clear input for next tag
            newTag.value = '';
        }
    });

    inactiveTimeout = setTimeout(() => {
        localStorage.setItem('compassrosecoding_token', '')
        window.location.reload();
    }, 1000 * 60 * 60 * 2);
}


/**
 * clears all input fields
 * @param none
 * @returns none
*/
function clearPage() {
    document.getElementById('author_input').value = '';
    document.getElementById('title_input').value = '';
    document.getElementById('subtitle_input').value = '';
    document.getElementById('published_input').value = '';
    document.getElementById('editor').getElementsByClassName('ql-editor')[0].innerHTML = '';
    document.getElementById('tags_display').innerHTML = '';
    document.getElementById('tags_input').value = ""
}

/**
 * opens the preview modal and triggers the draw function
 * @param none
 * @returns none
*/
async function openPreview() {
    let preview_modal = document.getElementById('preview_modal');
    preview_modal.style.display = 'block';
    document.getElementById('post_div').innerHTML = '';
    drawPreview()
}

/**
 * closes the preview modal 
 * @param none
 * @returns none
*/
async function closePreview() {
    let preview_modal = document.getElementById('preview_modal');
    preview_modal.style.display = 'none';
    document.getElementById('post_div').innerHTML = '';
}


/**
 * deletes a post and reloads post list
 * @param none
 * @returns none
*/
async function deletePost() {
    data = {
        'token': localStorage.getItem('compassrosecoding_token'),
        'id': document.getElementById("posts_select").value,
    }

    restOptions['method'] = 'DELETE'
    restOptions['body'] = JSON.stringify(data)

    let text = "Are you sure you want to delete this blog post?";
    if (confirm(text) != true) {
        window.location.reload();
    }

    try {
        const response = await fetch(blogURL, restOptions);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        clearPage();
        document.getElementById('posts_select').innerHTML = '';
        getTitles(result);
    } catch (error) {
        console.error(error.message);
        return error;
    }
}


/**
 * publishes new post or edited post
 * @param none
 * @returns none
*/
async function postBlog(draft) {
    let select = document.getElementById("posts_select");

    if (draft.length > 0) {
        document.getElementById('post_div').getElementsByClassName('published')[0].value = "DRAFT"
    }

    data = {
        'token': localStorage.getItem('compassrosecoding_token'),
        'id': select.value,
        'body': document.getElementById('post_div').outerHTML.replaceAll(
            'id="post_div"', 
            'id="' + select.value + '"')
    }

    restOptions['method'] = 'POST'
    restOptions['body'] = JSON.stringify(data)

    closePreview();

    if (select.value != "") {
        let text = "Are you sure you want to overwrite the current version of this blog post?";
        if (confirm(text) != true) {
            return;
        }
    }

    let result = '';

    try {
        const response = await fetch(blogURL, restOptions);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        result = await response.json();
    } catch (error) {
        console.error(error.message);
        return 0;
    }

    clearPage();
    document.getElementById('posts_select').innerHTML = '';
    getTitles(result);
}


/**
 * create an opt to represent the blog post and append it to the posts select
 * @param {string} id a unique identifier for each post
 * @param {string} title the post title
 * @param {string} date the date the post was published
 * @returns none
*/
function createOpt(id, title, date) {
    let select = document.getElementById("posts_select");

    let opt = document.createElement("option");
    opt.innerText = title + date;
    opt.value = id;

    select.appendChild(opt);
}


/**
 * draw the preview of the post, getting information from the editor fields
 * @param none
 * @returns none
*/
function drawPreview() {
    let parentDiv = document.getElementById('post_div')

    let dateH = document.getElementById('published_input').value
    
    if (dateH === '') {
        dateH = new Date().toLocaleDateString('en-US');
    }

    let body = document.getElementById('editor').getElementsByClassName('ql-editor')[0];

    let tags = document.getElementById('tags_display').innerHTML.replaceAll('">', '" onclick="filterTag(this)">');

    let htmlText = `<summary class="title">${document.getElementById('title_input').value}</summary><h3 class="subtitle">${document.getElementById('subtitle_input').value}</h3><h3 class="published">${dateH}</h3><h3 class="author">${document.getElementById('author_input').value}</h3><div class="body">${body.innerHTML}</div><div class="tags">${tags}</div>`
    parentDiv.innerHTML = htmlText;
}



/**
 * brings post data up on editor fields for modification
 * @param none
 * @returns none
*/
function selectPost() {
    let select = document.getElementById("posts_select");

    if (select.value !== "TEMP_ID") {
        let process = document.getElementById(select.value);

        document.getElementById('author_input').value = process.getElementsByClassName('author')[0].innerText;
        document.getElementById('title_input').value = process.getElementsByClassName('title')[0].innerText;
        document.getElementById('subtitle_input').value = process.getElementsByClassName('subtitle')[0].innerText;
        document.getElementById('published_input').value = process.getElementsByClassName('published')[0].innerText;
        document.getElementById('editor').getElementsByClassName('ql-editor')[0].innerHTML = process.getElementsByClassName('body')[0].innerHTML;
        document.getElementById('tags_display').innerHTML = process.getElementsByClassName('tags')[0].innerHTML;
    }
    else {
        clearPage();
    }
}

/**
 * create an option for each post for user to select for modification
 * @param none
 * @returns none
*/
async function getTitles(response) {
    createOpt("TEMP_ID", "Create New Post", "")

    let process = document.getElementById('processing_modal');
    process.innerHTML = response['html'];
    let responseArr = process.getElementsByClassName('post_div')

    for (let item of responseArr) {
        let id = item.id;
        let title = item.getElementsByClassName('title')[0].innerText;
        let published = item.getElementsByClassName('published')[0].innerText;

        createOpt(id, title, ', ' + published)
    }
}
