// API url
const blogURL = "https://u315eql0b6.execute-api.us-east-2.amazonaws.com/blog/scratch_blog";

//default options for the blog API request
var requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
};


/** 
 * on page load, sets up blog request, adds onEnter for search bar, inits the visual stuff
 * @param none
 * @returns none
 */
async function blogInit() {
    loadPosts();

    let search = document.getElementById('search_bar');
    search.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            searchBlog();
        }
    });
}


/**
 * send a specified request and return json response
 * @param none
 * @returns none
*/
async function sendRequest() {
    const response = await fetch(blogURL, requestOptions)
    const json = await response.json()
    return json;
}


/**
 * switches current visible blog to the previous page
 * @param none
 * @returns none
*/
function prevPage() {
    let pgSelect = document.getElementById('pageSelect')

    if (pgSelect.value > 1) {
        pgSelect.value = pgSelect.value - 1;
        filterBlog();
    }
}

/**
 * switches current visible blog to the next page
 * @param none
 * @returns none
*/
function nextPage() {
    let pgSelect = document.getElementById('pageSelect')

    if (document.getElementById('pg' + (parseInt(pgSelect.value) + 1))) {
        pgSelect.value = (parseInt(pgSelect.value) + 1);
        console.log(pgSelect.value)
        filterBlog();
    }
}


/**
 * switches current visible blog to the previous page
 * @param {number} pgNum the number of the page select option to be created
 * @returns none
*/
function createPgOption(pgNum) {
    return `<option value=${pgNum} id="pg${pgNum}">1</option>`
}


/** 
 * loads blog from API
 * @param none
 * @returns none
 */
async function loadPosts() {
    scroll(0, 0)

    document.getElementById("tags_content").innerHTML = '';

    let content = document.getElementById("blog_content");
    let response = await sendRequest();
    content.innerHTML = response['html'];

    filterBlog();
    drawTagBar(response);
}


/** 
 * create a most used tags list
 * @param {
        "body": "\"test\"",
        "tags": "test"
    } response 
 * @returns none
 */
function drawTagBar(response) {
    let tagsDiv = document.getElementById('tags_content');

    for (let i = 0; i < response['tags'].length; i++) {
        let row = document.createElement("div");
        row.innerHTML = response['tags'][i][0];
        tagsDiv.appendChild(row)

        row = document.createElement("text");
        row.innerText = response['tags'][i][1];
        tagsDiv.appendChild(row);
    }
}


/** 
 * filter blog for a text search query, re-paginate results, etc
 * @param none
 * @returns none
 */
function searchBlog() {
    let search = document.getElementById('search_bar').value;
    let blog = document.getElementById('blog_content');
    blog.innerHTML = blog.innerHTML.replaceAll('<span class="search_highlight">', '').replaceAll('</span  >', '')

    if (search === '') {
        filterBlog();
        return;
    }

    document.getElementsByClassName('selected_tags_div').innerHTML = '';
    let posts = document.getElementsByClassName('post_div');
    let pgSelect = document.getElementById('pageSelect');
    let postsPer = document.getElementById('postPerPage');
    let currentPg = parseInt(pgSelect.value);

    pgSelect.innerHTML = '';
    pgSelect.innerHTML = pgSelect.innerHTML + createPgOption(1);

    let filteredCount = 0;
    for (let i = 0; i < posts.length; i++) {
        let pageNum = parseInt(parseInt(filteredCount) / parseInt(postsPer.value)) + 1;

        if (!document.getElementById('pg' + pageNum)) {
            pgSelect.innerHTML = pgSelect.innerHTML + createPgOption(pageNum);
        }

        if (posts[i].innerText.indexOf(search) >= 0) {
            posts[i].style.display = 'block';
            posts[i].open = false;
            filteredCount = filteredCount + 1;
            highlightSearch(posts[i])
        }
        else {
            posts[i].style.display = 'none';
        }
    }
    pgSelect.value = currentPg;
}

/**
 * highlights the search term in post
 * @param none
 * @returns none
*/
function highlightSearch(post) {
    post.getElementsByClassName('title')[0].replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
    post.getElementsByClassName('subtitle')[0].replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
    post.getElementsByClassName('author')[0].replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
    post.getElementsByClassName('published')[0].replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
    
    return post.innerHTML.replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
}

/**
 * clears the search bar value and removes all of the highlighted search terms in blog
 * @param none
 * @returns none
*/
function clearSearch() {
    document.getElementById('search_bar').value = '';
    let blog = document.getElementById('blog_content');
    blog.innerHTML = blog.innerHTML.replaceAll('<span class="search_highlight">', '').replaceAll('</span  >', '')
    filterBlog();
}


/**
 * adds a filter tag to the filter system
 * @param {element} param tag that is going to be filtered
 * @returns none
*/
const filterTag = function (param) {
    let filters = document.getElementById('selected_tags_div');

    if (!filters.innerHTML.includes(param.innerText)) {
        let clone = param.cloneNode(true);
        filters.appendChild(clone)
        clone.outerHTML = clone.outerHTML.replace('filter', 'unfilter').replace('tagButton', 'filterButton');
        filterBlog();
    }
};

/**
 * removes a filter tag from the system
 * @param {element} param tag that is going to be removed from filters
 * @returns none
*/
const unfilterTag = function (param) {
    param.remove();
    filterBlog();
}


/** 
 * re-paginate blog on tag filter, or just as a basic load function on change of page or Posts Per Page value
 * @param none
 * @returns none
 */
function filterBlog() {
    document.getElementsByClassName('search_bar').value = '';

    let posts = document.getElementsByClassName('post_div')
    let tags = document.getElementsByClassName('filterButton')

    let pgSelect = document.getElementById('pageSelect')
    let postsPer = document.getElementById('postPerPage')
    let currentPg = parseInt(pgSelect.value);

    pgSelect.innerHTML = '';
    pgSelect.innerHTML = pgSelect.innerHTML + createPgOption(1);

    let filteredCount = 0;
    for (let i = 0; i < posts.length; i++) {
        let add = true;
        posts[i].open = true;

        let tagsDiv = posts[i].getElementsByClassName('tags')[0]

        let dateDiv = posts[i].getElementsByClassName('published')[0]
        if (dateDiv.innerText === 'DRAFT') {
            posts[i].remove();
        }

        for (let j = 0; j < tags.length; j++) {
            if (!tagsDiv.innerHTML.includes(tags[j].id)) {
                add = false;
            }
        }

        let pageNum = parseInt(filteredCount / parseInt(postsPer.value)) + 1;

        if (!document.getElementById('pg' + pageNum)) {
            pgSelect.innerHTML = pgSelect.innerHTML + createPgOption(pageNum);
        }

        if (add && pageNum === currentPg) {
            posts[i].style.display = 'block';
            filteredCount = filteredCount + 1;
        }
        else if (!add) {
            posts[i].style.display = 'none';
        }
        else {
            posts[i].style.display = 'none';
            filteredCount = filteredCount + 1;
        }
    }
    pgSelect.value = currentPg;
}

/** 
 * opens all post drop downs
 * @param none
 * @returns none
 */
function openAll() {
    let posts = document.getElementsByClassName('post_div');

    for (let i = 0; i < posts.length; i++) {
        posts[i].open = true;
    }
}

/** 
 * close all post drop downs
 * @param none
 * @returns none
 */
function closeAll() {
    let posts = document.getElementsByClassName('post_div');

    for (let i = 0; i < posts.length; i++) {
        posts[i].open = false;
    }
}

/** 
 * order recent first
 * @param none
 * @returns none
 */
function chronOrder() {
    let content = document.getElementById("blog_content");

    content.style.flexDirection = "column";
}

/** 
 * order oldest first
 * @param none
 * @returns none
 */
function refChronOrder() {
    let content = document.getElementById("blog_content");

    content.style.flexDirection = "column-reverse";
}