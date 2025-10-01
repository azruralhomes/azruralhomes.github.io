// API url
const baseUrl = "https://tbulndcgqv6svxcrxz4msjmaue0lhfla.lambda-url.us-east-2.on.aws?process=";

//default options for the blog API request
var requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
};

async function init() {
    markCurrent('home');
    resizeHeader();

    zillowReviews();
    googleReviews();
}

async function zillowReviews() {
    response = await sendRequest('zillow_reviews');
    element = document.getElementById('zillow_reviews_pane');
    revs = response.value[0].Reviews
    

    if (revs.length < 1) {
        element.innerHTML = '<h2 class="intro_text Marcellus">No Reviews Available, Please Leave One!</h2>'
    }

    else {
        for (let i = 0; i < revs.length; i++) {
            let rateStars = ''
            for (let j = 0; j < 5; j++) {
                if (j < revs[i].Rating) {
                    rateStars = rateStars + '<span class="yellow_star">★</span>'
                }
                else {
                    rateStars = rateStars + '<span class="gray_star">★</span>'
                }
            }

            // Non-standard format resembling toUTCString()
            const pubDate = new Date(revs[i].ReviewDate);
            let pubStr = pubDate.toLocaleDateString('en-US')

            let htmlText = `<div class="review_div"><text class="review_author">${revs[i].ReviewerScreenName}</text><text class="review_stars">${rateStars}</text><text class="review_date">${pubStr}</text><p class="review_text">${revs[i].Description}</p></div>`

            element.innerHTML = element.innerHTML + htmlText;
        }
    }
}

async function googleReviews() {
    response = await sendRequest('google_reviews');
    element = document.getElementById('google_reviews_pane');
    revs = response['reviews']

    if (revs.length < 1) {
        element.innerHTML = '<h2 class="intro_text Marcellus">No Reviews Available, Please Leave One!</h2>'
    }

    else {
        for (let i = 0; i < revs.length; i++) {
            let rateStars = ''
            for (let j = 0; j < 5; j++) {
                if (j < revs[i].rating) {
                    rateStars = rateStars + '<span class="yellow_star">★</span>'
                }
                else {
                    rateStars = rateStars + '<span class="gray_star">★</span>'
                }
            }

            // Non-standard format resembling toUTCString()
            const pubDate = new Date(revs[i].publishTime);
            let pubStr = pubDate.toLocaleDateString('en-US')

            let htmlText = `<div class="review_div"><text class="review_author">${revs[i].authorAttribution.displayName}</text><text class="review_stars">${rateStars}</text><text class="review_date">${pubStr}</text><p class="review_text">${revs[i].text.text}</p></div>`

            element.innerHTML = element.innerHTML + htmlText;
        }
    }
}

async function sendRequest(process) {
    const response = await fetch(baseUrl + process, requestOptions)
    const json = await response.json()
    return json;
}