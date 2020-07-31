document.querySelectorAll('.projects picture, button').forEach((element) => {
    let div = document.createElement('div');
    div.className = 'ripples';
    element.appendChild(div);
});

let rippleTouchCalled = false;
let rippleKeyboardCalled = false;
let rippleTapTimer;

document.querySelectorAll('.projects picture, button').forEach((element) => {
    element.addEventListener('touchstart', (event) => {
        rippleTouchCalled = true;
        rippleTapTimer = setTimeout(() => {
            rippleForeground(element, event);
            element.classList.add('pressed');
        }, 100);
    }, { passive: true });
    element.addEventListener('touchmove', () => {
        clearTimeout(rippleTapTimer);
    }, { passive: true });
    element.addEventListener('touchend', () => {
        element.classList.remove('pressed');
    }, { passive: true });
    element.addEventListener('keydown', (event) => {
        if (event.key !== " " && event.key !== "Enter" || rippleKeyboardCalled == true) {
            return;
        }
        rippleKeyboardCalled = true;
        rippleForeground(element, event);
    });
    element.addEventListener('keyup', () => {
        rippleKeyboardCalled = false;
    });
    element.addEventListener('mousedown', (event) => {
        if (event.button !== 0 || rippleTouchCalled == true) {
            rippleTouchCalled = false;
            return;
        }
        rippleForeground(element, event);
    });
});

let rippleExpandDuration;
let rippleMoveParameter;

function rippleForeground(element, event) {
    let containerWidth = parseFloat(window.getComputedStyle(element).width);
    let containerHeight = parseFloat(window.getComputedStyle(element).height);
    let containerEqualAreaRadius = Math.pow(containerWidth * containerHeight / Math.PI, 0.5);
    let rippleRadius = (containerEqualAreaRadius * 0.9 + containerEqualAreaRadius * Math.random() * 0.1);

    if (element.classList.contains('unbounded')) {
        rippleExpandDuration = 400;
        rippleMoveParameter = 0;
    } else {
        rippleExpandDuration = 800;
        rippleMoveParameter = 0.7;
    }

    let div = document.createElement('div');
    div.className = 'foreground';
    element.querySelector('.ripples').appendChild(div);
    let lastRippleForeground = element.querySelector('.ripples div:last-child');

    if (event.type == "touchstart") {
        rippleOffsetX = event.changedTouches[0].clientX - element.getBoundingClientRect().left - containerWidth / 2;
        rippleOffsetY = event.changedTouches[0].clientY - element.getBoundingClientRect().top - containerHeight / 2;
    }
    if (event.type == "mousedown") {
        rippleOffsetX = event.clientX - element.getBoundingClientRect().left - containerWidth / 2;
        rippleOffsetY = event.clientY - element.getBoundingClientRect().top - containerHeight / 2;
    }

    lastRippleForeground.style.setProperty('--diameter', rippleRadius * 2 + 'px');

    if (event.type !== "keydown") {
        lastRippleForeground.animate({
            transform: ['translate(' + rippleOffsetX + 'px,' + rippleOffsetY + 'px)', 'translate(' + rippleOffsetX * rippleMoveParameter + 'px,' + rippleOffsetY * rippleMoveParameter + 'px)']
        }, {
            duration: 300,
            easing: 'cubic-bezier(0.17, 0.74, 0.4, 1)',
            fill: 'both'
        });
    }

    lastRippleForeground.animate({
        transform: ['scale(0)', 'scale(1)']
    }, {
        duration: rippleExpandDuration,
        easing: 'cubic-bezier(0.17, 0.74, 0.4, 1)',
        fill: 'both',
        composite: 'add'
    });

    lastRippleForeground.addEventListener('animationend', (event) => {
        event.target.remove();
    });
}

let touchCalled = false;
let touchMoved = false;

document.querySelectorAll('.projects picture').forEach((element) => {
    element.addEventListener('touchend', (event) => {
        if (touchMoved == true) {
            touchMoved = false;
            return;
        }
        touchCalled = true;
        projectPageEnter(element, event);
    }, { passive: true });
    element.addEventListener('touchmove', () => {
        touchMoved = true;
    }, { passive: true });
    element.addEventListener('mouseup', (event) => {
        if (touchCalled == true) {
            touchCalled = false;
            return;
        }
        projectPageEnter(element, event);
    });
    element.addEventListener('keyup', (event) => {
        if (event.key !== " " && event.key !== "Enter") {
            return;
        }
        projectPageEnter(element, event);
    });
});

let revealOriginX;
let revealOriginY;

function projectPageEnter(element, event) {
    let selectedProject = event.target.id;
    let projectPageContainer = document.querySelector('.project-page');
    let projectPage = document.querySelector('.project-content');

    if (event.type == "touchend") {
        revealOriginX = event.changedTouches[0].clientX;
        revealOriginY = event.changedTouches[0].clientY;
    }
    if (event.type == "mouseup") {
        revealOriginX = event.clientX;
        revealOriginY = event.clientY;
    }
    if (event.type == "keyup") {
        revealOriginX = element.getBoundingClientRect().left + parseFloat(window.getComputedStyle(element).width) / 2;
        revealOriginY = element.getBoundingClientRect().top + parseFloat(window.getComputedStyle(element).height) / 2;
    }

    projectPageContainer.classList.add("on");

    let projectPageShow = projectPage.animate([
        { opacity: 0.5, transform: 'translateY(' + revealOriginY / 7 + 8 + 'px)' },
        { opacity: 1, offset: 0.25 },
        { transform: 'translateY(0px)' }
    ], {
        pseudoElement: '::before',
        duration: 420,
        easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        fill: 'both'
    });

    projectPage.animate([
        { clipPath: 'inset(' + revealOriginY + 'px 0% calc(100% - ' + revealOriginY + 'px) 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)' }
    ], {
        duration: 420,
        easing: 'cubic-bezier(0.3, 0.0, 0.1, 1)',
        fill: 'both'
    });

    projectPage.animate([
        { clipPath: 'inset(0% calc(100% - ' + revealOriginX + 'px) 0% ' + revealOriginX + 'px)' },
        { clipPath: 'inset(0% 0% 0% 0%)', offset: 0.4 },
        { clipPath: 'inset(0% 0% 0% 0%' }
    ], {
        duration: 420,
        easing: 'cubic-bezier(0.0, 0.0, 0.4, 1)',
        fill: 'both',
        composite: 'accumulate'
    });

    projectPageShow.onfinish = function () {
        if (selectedProject == "Ice_Box") {
            window.location.href = "https://tilextend.github.io/Ice-Box";
        }
        if (selectedProject == "Shadowsocks") {
            window.location.href = "https://www.behance.net/gallery/60541627/Shadowsocks-Material-Redesign-";
        }
        if (selectedProject == "IThome") {
            window.location.href = "https://www.behance.net/gallery/55114445/IT-Material-Redesign-";
        }
    };
}