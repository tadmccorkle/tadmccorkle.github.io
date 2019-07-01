// contains modified contents of 'scroll-up.js' - do not use
// 'scroll-up.js' if this file is in use. either use 'main.js'
// components ('comments.js' and 'site-nav.js') or modify
// 'main.js' to be compatible w/ this file before use.

// not perfect, but avoid scroll event for most small screens
// any larger and risk inconsistency among browsers and css
smallScreenSize = 800;
canCheck = true;

// get now, since this is loaded after the page
smallScreen = $(window).width() < smallScreenSize;
scrollElement = $('#scroll-link-icons');
linkBottom = $('#last-links').offset().top + $('#last-links').height();
postBottom = $('#post-container').offset().top + $('#post-container').height();
pageTop = $(window).scrollTop();
pageHeight = $(window).height();

// from underscore.js
getNow = Date.now || function () {
  return new Date().getTime();
};

// from https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
throttle = (func, limit) => {
  let lastFunc, lastRan;
  return function () {
    if (!lastRan) {
      func.apply(this, arguments);
      lastRan = getNow();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (getNow() - lastRan >= limit) {
          func.apply(this, arguments);
          lastRan = getNow();
        }
      }, limit - (getNow() - lastRan));
    }
  }
}

// toggles side link visibility/position based on scroll location
checkSideLinks = function () {
  if (pageTop < linkBottom || postBottom < pageTop + pageHeight) {
    scrollElement.removeClass('visible')
  } else {
    scrollElement.addClass('visible');
  }
};

// check to see if links should be shown on load
$(document).ready(function () {
  checkSideLinks();
});

// scroll to top if button clicked
$('#scroll-up-fade,#scroll-up-perm').click(function () {
  canCheck = false;
  scrollElement.removeClass('visible');
  $('html,body').animate({scrollTop:0}, 'slow', function () {
    canCheck = true;
  });
});

// side link scroll event
$(window).on('scroll', throttle(function () {
  if (canCheck && !smallScreen) {
    pageTop = $(window).scrollTop();
    checkSideLinks();
  }
}, 100));

// side link resize event
$(window).on('resize', throttle(function () {
  smallScreen = $(window).width() < smallScreenSize;
  if (canCheck && !smallScreen) {
    pageHeight = $(window).height();
    linkBottom = $('#last-links').offset().top + $('#last-links').height();
    postBottom = $('#post-container').offset().top + $('#post-container').height();
    checkSideLinks();
  }
}, 100));