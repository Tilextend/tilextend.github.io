var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");
notChromeDialog = "在非Chrome下浏览可能无法获得正常体验。"

if (isIOSChrome) { } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isIEedge == false) {
    var userLang = navigator.language || navigator.userLanguage;
    if (userLang.indexOf("zh") < 0) {
        notChromeDialog = "Something could be wrong while browsing in an not Chrome platform."
        convertInEnglish();
    }
} else {
    alert(notChromeDialog);
}

function convertInEnglish() {
    $('html').attr("lang", "en-US");
    $('meta[name="description"]').attr("content", "Tilextend is a design team committed to the platform's native experience.");

    $('head title').text("Tilextend");

    $('.logo').attr("alt", "Tilextend logo");
    $('h1').text("TILEXTEND");
    $('.introduction p').html("Help indie developers and your team<br>get Material Design solutions.");
    $('h2').eq(0).text("Get In Touch");
    $('h2').eq(1).text("Elsewhere");

    $('#Ice_Box').attr("alt", "Ice Box redesign preview");
    $('#Shadowsocks').attr("alt", "Shadowsocks redesign preview");
    $('#IThome').attr("alt", "IThome redesign preview");
}




hoverElements = ".projects picture, .button";
focusElements = ".button";
pressedElements = ".projects picture, .button";



/*方案详情*/

$('.projects picture').on("click", function (event) {

    $(".project-page").css({
        "--origin-left": event.clientX + "px",
        "--origin-top": event.clientY + "px",
    });

    selectedProject = $(this).attr("id");

    if (selectedProject == "Ice_Box") {
        $('.project-page').addClass('on');
        $(".project-content").one('animationend', function () {
            window.location.href = "https://tilextend.github.io/Ice-Box";
        });
    }
    if (selectedProject == "Shadowsocks") {
        alert("网页预览未完工，即将跳转Behance");
        window.location.href = "https://www.behance.net/gallery/60541627/Shadowsocks-Material-Redesign-";
    }
    if (selectedProject == "IThome") {
        alert("网页预览未完工，即将跳转Behance");
        window.location.href = "https://www.behance.net/gallery/55114445/IT-Material-Redesign-";
    }
});

