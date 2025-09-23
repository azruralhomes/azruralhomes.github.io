async function init() {
    markCurrent('gallery');
    resizeHeader();

    document.getElementById('carousel_page').value = 1
    carouselPage();
}


function carouselPage() {
    let currPage = parseInt(document.getElementById('carousel_page').value)
    let numVisible = window.innerWidth / 100;
    let smalls = document.getElementsByClassName('small_image')
    for (let i = 0; i < smalls.length; i++) {
        if (i >= (currPage - 1) * numVisible && i < (currPage) * numVisible) {
            smalls[i].style.display = 'block'
        }
        else {
            smalls[i].style.display = 'none'
        }
    }
}

function nextPage() {
    let page = document.getElementById('carousel_page');
    let smalls = document.getElementsByClassName('small_image')
    let numVisible = window.innerWidth / 100;
    if (page.value * numVisible < smalls.length + numVisible) {
        page.value = parseInt(page.value) + 1
    }
    else {
        page.value = 1
    }
    console.log(document.getElementById('carousel_page').value)
    carouselPage();
}

function prevPage() {
    let page = document.getElementById('carousel_page');
    let smalls = document.getElementsByClassName('small_image')
    let numVisible = window.innerWidth / 100;
    if (page > 1) {
        page.value = parseInt(page.value) - 1
    }
    else {
        page.value = parseInt(smalls.length / numVisible)
    }
    console.log(document.getElementById('carousel_page').value)
    carouselPage();
}


function changeImage(element) {
    let currPhoto = document.getElementsByClassName('selected_image')[0]
    currPhoto.classList.remove('selected_image')

    element.classList.add('selected_image')

    document.getElementById('large_image').src = String(element.src).replace('small_', '');
}