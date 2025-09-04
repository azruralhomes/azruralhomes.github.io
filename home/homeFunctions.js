let map;
let centerCoordinates = { lat: 42.349134, lng: -71.083184 }; // Boston, MA
let infoWindow;
let contentString;

async function initMap() {
    let revs = await getReviews();

    if (revs.length < 1) {
        document.getElementById('reviews_pane').innerHTML = '<h2 class="intro_text abraham">No Reviews Available, Please Leave One!</h2>'
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

            let htmlText = `
        <div class="review_div">
        <text class="review_author">${revs[i].authorAttribution.displayName}</text>
        <text class="review_stars">${rateStars}</text>
        <text class="review_date">${pubStr}</text>
        <p class="review_text">${revs[i].text}</p>
        </div>
        `

            document.getElementById('reviews_pane').innerHTML = document.getElementById('reviews_pane').innerHTML + htmlText;
        }
    }
}

async function getReviews() {
    const { Place } = await google.maps.importLibrary("places");

    // Use a place ID to create a new Place instance.
    const place = new Place({
        id: "ChIJSVKA92PW-AgRfHH_Q84O0Yk",
    });

    // Call fetchFields, passing 'reviews' and other needed fields.
    await place.fetchFields({
        fields: ["reviews"],
    });

    return place.reviews
}

initMap();