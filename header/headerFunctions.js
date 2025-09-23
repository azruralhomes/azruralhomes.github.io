function resizeHeader() {
    document.getElementById("header_iframe").contentWindow.document.body.onclick = function () {
        if (window.innerWidth > 600) {
            console.log('too wide')
            return
        }
        let iFrame = document.getElementById("header_iframe");
        let menu = iFrame.contentWindow.document.getElementById('header_menu');
        let header = iFrame.contentWindow.document.getElementById('header_html');
        if (menu.style.display === 'flex') {
            menu.style.display = 'none'
            iFrame.height = 150 + 'vw'
        }
        else {
            menu.style.display = 'flex'
            iFrame.height = 350 + 'vw'
        }
    }
}

function markCurrent(page) {
    let iframe = document.getElementById('header_iframe');
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let head_tab = iframeDocument.getElementById('header_' + page);
    head_tab.outerHTML = head_tab.outerHTML.replace('header_tab', 'current')
}