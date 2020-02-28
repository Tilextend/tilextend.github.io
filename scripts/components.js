/*状态*/

//初始化：
var touchCompatibility = ("ontouchstart" in document.documentElement);
var hoverElements, focusElements, selectedElements, activedElements, pressedElements, draggedElements;

$(hoverElements + ',' + focusElements + ',' + selectedElements + ',' + activedElements + ',' + draggedElements).prepend('<div class="states"></div>');
$(hoverElements).find('.states').append('<div class="hover"></div>');
$(focusElements).find('.states').append('<div class="focus"></div>');

$(pressedElements).prepend('<div class="ripples"></div>');
$(pressedElements).children('.ripples').prepend('<div class="ripple-background"></div>');


//鼠标悬浮：
if (!touchCompatibility) {
    $(hoverElements).hover(
        function () {
            $(this).children('.states').children('.hover').addClass("on");
        }, function () {
            $(this).children('.states').children('.hover').removeClass("on");
        }
    );
}

//聚焦：
let focusBefore = true;

$(focusElements).hover(
    function () {
        if ($(this).is(':focus')) {
            focusBefore = true;
        } else {
            focusBefore = false;
        }
    }, function () {
        focusBefore = true;
    }
);

$(focusElements).on("focus", function () {
    if (focusBefore == false) {
        $(this).blur();
    } else {
        $(this).children('.states').children('.focus').addClass("on");
    }
});

$(focusElements).on("blur", function () {
    $(this).children('.states').children('.focus').removeClass("on");
});


//涟漪：
let inputLeft, inputTop, parentElement, parentLeft, parentTop, rippleOriginLeft, rippleOriginTop, rippleBackgroundFullOn;

function rippleForeground() {
    containerWidth = parentElement.children('.ripples').innerWidth();
    containerHeight = parentElement.children('.ripples').innerHeight();
    containerLeft = parentElement.children('.ripples').offset().left;
    containerTop = parentElement.children('.ripples').offset().top;
    rippleOriginLeft = Math.abs(containerLeft - inputLeft);
    rippleOriginTop = Math.abs(containerTop - inputTop);

    parentElement.children('.ripples').append('<div class="ripple-foreground"></div>');

    parentElement.children('.ripples').children(".ripple-foreground:last").css({
        "--targets-center-offset-x": containerWidth / 2 - rippleOriginLeft + "px",
        "--targets-center-offset-y": containerHeight / 2 - rippleOriginTop + "px",
        "--ripple-diameter": Math.hypot(containerWidth, containerHeight) + "px",
        "--ripple-origin-left": rippleOriginLeft + "px",
        "--ripple-origin-top": rippleOriginTop + "px"
    });

    requestAnimationFrame(function () {
        parentElement.children('.ripples').children(".ripple-foreground:last").addClass('on');
        parentElement.children('.ripples').children(".ripple-foreground").one('animationend', function () {
            $(this).remove();
        });
    });
}

function rippleBackground() {
    parentElement.children('.ripples').children(".ripple-background").css({
        "--ripple-diameter": Math.hypot(containerWidth, containerHeight) + "px"
    });

    parentElement.children('.ripples').children(".ripple-background").addClass('on');
    parentElement.children('.ripples').children(".ripple-background").one('transitionend', function () {
        rippleBackgroundFullOn = true;
    });
    parentElement.one("touchend", function () {
        $(this).removeClass('pressed');
        if (rippleBackgroundFullOn == true) {
            $(this).children('.ripples').children(".ripple-background").removeClass('on');
        } else {
            $(this).one('transitionend', function () {
                $(this).children('.ripples').children(".ripple-background").removeClass('on');
            });
        }
    });
}

$(pressedElements).on("mousedown", function (rippleMouseEvent) {
    if (rippleMouseEvent.button === 0 && !touchCompatibility) {
        $(this).addClass('pressed');
        parentElement = $(this);
        inputLeft = rippleMouseEvent.pageX;
        inputTop = rippleMouseEvent.pageY;

        rippleForeground();
    }
});

$(pressedElements).on("mouseup", function () {
    $(this).removeClass('pressed');
});

$(pressedElements).on("touchstart", function (rippleTouchEvent) {
    $(this).addClass('pressed');
    parentElement = $(this);
    rippleBackgroundFullOn = false;
    inputLeft = rippleTouchEvent.changedTouches[0].pageX;
    inputTop = rippleTouchEvent.changedTouches[0].pageY;

    rippleForeground();
    rippleBackground();
});