// API url
const blogURL = "https://tbulndcgqv6svxcrxz4msjmaue0lhfla.lambda-url.us-east-2.on.aws?process=blogger";

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
    markCurrent('blog');
    resizeHeader();
    scroll(0, 0);

    let iframe = document.getElementById('header_iframe');
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let head_tab = iframeDocument.getElementById('header_blog');
    head_tab.outerHTML = head_tab.outerHTML.replace('header_tab', 'current')

    let content = document.getElementById("blog_content")
    content.innerHTML = '<h2 id="loading_icon">Loading Blog</h2>'

    let response = await sendRequest();

    buildPosts(response);

    filterBlog();
    drawTagBar();

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
    let pageSel = document.getElementsByClassName("page_select")
    let currPg = pageSel[0].value;

    if (currPg > 1) {
        pageSel[0].value = (parseInt(currPg) - 1);
        pageSel[1].value = (parseInt(currPg) - 1);
        filterBlog();
    }
}

/**
 * switches current visible blog to the next page
 * @param none
 * @returns none
*/
function nextPage() {
    let pageSel = document.getElementsByClassName("page_select")
    let currPg = pageSel[0].value;

    if (document.getElementById('pg' + (parseInt(currPg) + 1))) {
        pageSel[0].value = (parseInt(currPg) + 1);
        pageSel[1].value = (parseInt(currPg) + 1);
        filterBlog();
    }
}

//loads the posts from json to html
async function buildPosts(response) {
    content = document.getElementById("blog_content")

    let postsPer = document.getElementById('postPerPage').value;

    let pageSel = document.getElementsByClassName("page_select")
    pageSel[0].innerHTML = '<option value="1" id="opt1">1</option>'
    pageSel[1].innerHTML = '<option value="1" id="opt1">1</option>'

    for (let h = 0; h < response.length; h++) {
        let page = JSON.parse(response[h]);
        for (let i = 0; i < page['items'].length; i++) {
            pageNum = Math.floor(i / postsPer) + 1
            content.innerHTML += newBlogPost(page['items'][i], pageNum);
        }
    }

    document.getElementById('loading_icon').remove();
}

//format a json response into a legible blog post
function newBlogPost(entry, pageNum) {
    let tags = newTagsBar(entry);
    let post = '';

    entry['content'] = entry['content'].replaceAll('<span style="font-size: medium;">', '').replaceAll('</span>', '').replaceAll('&nbsp;', '')

    if (pageNum == 1) {
        post = `<details class="post_div" id="post_${entry['id']}" style="display: block;"><summary class="title">${entry['title']}</summary><h3 class="published">${new Date(entry['updated']).toDateString()}</h3><h3 class="author">${entry['author']['displayName']}</h3><div class="body">${entry['content']}</div><div class="tags">${tags}</div></details>`
    }
    else {
        post = `<details class="post_div" id="post_${entry['id']}" style="display: none;"><summary class="title">${entry['title']}</summary><h3 class="published">${new Date(entry['updated']).toDateString()}</h3><h3 class="author">${entry['author']['displayName']}</h3><div class="body">${entry['content']}</div><div class="tags">${tags}</div></details>`
    }

    return post;
}

//tag bars are separate from blog posts for formatting reasons; these are the tags for each post.
function newTagsBar(entry) {
    let tags = '';
    for (let j = 0; j < entry['labels'].length; j++) {
        let str = `<button id="${entry['labels'][j]}" class="tagButton" onclick="filterTag(this)">${entry['labels'][j]}</button>`
        tags += str;
    }
    return tags
}


/** 
 * create a most used tags list
 * @param {
        "body": "\"test\"",
        "tags": "test"
    } response 
 * @returns none
 */
function drawTagBar() {
    let allTags = document.getElementsByClassName('tagButton');
    let tagsDict = {};

    for (let i = 0; i < allTags.length; i++) {
        if (allTags[i].outerHTML in tagsDict) {
            tagsDict[allTags[i].outerHTML] += 1;
        }
        else {
            tagsDict[allTags[i].outerHTML] = 1;
        }
    }

    let tagsDiv = document.getElementById('tags_content');

    for (let i = 0; i < 7; i++) {
        let maxKey = Object.keys(tagsDict).reduce(function (a, b) { return tagsDict[a] > tagsDict[b] ? a : b });

        if (tagsDict[maxKey] > 0) {
            tagsDiv.innerHTML += `<div>${maxKey}</div>`;

            tagsDiv.innerHTML += `<div>${tagsDict[maxKey]}</div>`;

            tagsDict[maxKey] = 0;
        }
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
    let pageSel = document.getElementsByClassName("page_select");
    let postsPer = document.getElementById('postPerPage');
    let currentPg = parseInt(pageSel[0].value);

    pageSel[0].innerHTML = `<option value=${1} id="pg${1}">${1}</option>`;
    pageSel[1].innerHTML = `<option value=${1} id="pg${1}">${1}</option>`;

    let filteredCount = 0;
    for (let i = 0; i < posts.length; i++) {
        let pageNum = parseInt(parseInt(filteredCount) / parseInt(postsPer.value)) + 1;

        if (!document.getElementById('pg' + pageNum)) {
            pageSel[0].innerHTML = pageSel[0].innerHTML + `<option value=${pageNum} id="pg${pageNum}">pg${pageNum}</option>`;
            pageSel[1].innerHTML = pageSel[1].innerHTML + `<option value=${pageNum} id="pg${pageNum}">pg${pageNum}</option>`;
        }

        if (posts[i].innerText.indexOf(search) >= 0) {
            posts[i].style.display = 'block';
            posts[i].open = false;
            filteredCount = filteredCount + 1;
            posts[i].innerHTML = highlightSearch(posts[i], search);
        }
        else {
            posts[i].style.display = 'none';
        }
    }
    pageSel[0].value = currentPg;
    pageSel[1].value = currentPg;
}

/**
 * highlights the search term in post
 * @param none
 * @returns none
*/
function highlightSearch(post, search) {
    console.log(post.innerText)

    const regex = />(.*?)</g;
    const found = post.innerHTML.match(regex);

    for (let i = 0; i < found.length; i++) {
        if (found[i].indexOf(search) >= 0) {
            let temp = found[i].replaceAll(search, '<span class="search_highlight">' + search + '</span  >')
            console.log(temp)
            post.innerHTML = post.innerHTML.replaceAll(found[i], temp)
        }
    }

    return post.innerHTML
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

    let pageSel = document.getElementsByClassName("page_select")
    let postsPer = document.getElementById('postPerPage')
    let currentPg = parseInt(pageSel[0].value);

    pageSel[0].innerHTML = `<option value=${1} id="pg${1}">${1}</option>`;
    pageSel[1].innerHTML = `<option value=${1} id="pg${1}">${1}</option>`;
        
    let filteredCount = 0;
    for (let i = 0; i < posts.length; i++) {
        let add = true;
        posts[i].open = false;

        let tagsDiv = posts[i].getElementsByClassName('tags_div')[0]

        for (let j = 0; j < tags.length; j++) {
            if (!tagsDiv.innerHTML.includes(tags[j].id)) {
                add = false;
            }
        }

        let pageNum = parseInt(filteredCount / parseInt(postsPer.value)) + 1;

        if (!document.getElementById('pg' + pageNum)) {
            pageSel[0].innerHTML = pageSel[0].innerHTML + `<option value=${pageNum} id="pg${pageNum}">pg${pageNum}</option>`;
            pageSel[1].innerHTML = pageSel[1].innerHTML + `<option value=${pageNum} id="pg${pageNum}">pg${pageNum}</option>`;
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
    pageSel[0].value = currentPg;     
    pageSel[1].value = currentPg;     
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