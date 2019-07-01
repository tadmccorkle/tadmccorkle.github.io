const ACTIVE_CLASS_NAME = 'active';
const TOTAL_HAMBURGER_DROPDOWN_DURATION = 300; // length for scss transition

// social header link transitions
$('#social-site-header-transition-text').on('click', function () {
  $('#social-text').toggleClass(ACTIVE_CLASS_NAME);
  $('#social-site-header-links').toggleClass(ACTIVE_CLASS_NAME);
});

// setup for hamburger menu animations
hamburger = $('.hamburger');
mainSiteHeaderLinks = $('.main-site-header-links');
socialSiteHeaderLinks = $('.social-site-header-links');
mainItemCount = $('#main-site-header-links').children().length;
socialItemCount = $('#social-site-header-links').children().length;
mainDropDuration = (mainItemCount / (mainItemCount + socialItemCount)) * TOTAL_HAMBURGER_DROPDOWN_DURATION;
socialDropDuration = (socialItemCount / (mainItemCount + socialItemCount)) * TOTAL_HAMBURGER_DROPDOWN_DURATION;

// hamburger menu animations
hamburger.click(function () {
  mainSiteHeaderLinks.stop(true, true);
  socialSiteHeaderLinks.stop(true, true);
  if (hamburger.hasClass(ACTIVE_CLASS_NAME)) {
    hamburger.removeClass(ACTIVE_CLASS_NAME);
    socialSiteHeaderLinks.slideUp(socialDropDuration, 'linear', function () {
      mainSiteHeaderLinks.slideUp(mainDropDuration, 'linear');
    });
  } else {
    hamburger.addClass(ACTIVE_CLASS_NAME);
    mainSiteHeaderLinks.slideDown(mainDropDuration, 'linear', function () {
      socialSiteHeaderLinks.slideDown(socialDropDuration, 'linear');
    });
  }
});

// alternating taglines
i = 0;
var timeout;
var interval;
mainTagline = $('.main-tagline');
elements = document.getElementsByClassName('alt-tagline');
length = elements.length;
$('#site-tagline').on({
  mouseenter: function () {
    if (timeout != null) clearTimeout(timeout);
    timeout = setTimeout(function () {
      mainTagline.addClass('hide');
      $('#site-tagline').find(elements[i]).addClass('show');
      interval = setInterval(function () {
        $('#site-tagline').find(elements[i]).removeClass('show');
        i = (i + 1) % length;
        $('#site-tagline').find(elements[i]).addClass('show');
      }, 1250);
    }, 500);
  },
  mouseleave: function () {
    clearTimeout(timeout);
    clearInterval(interval);
    $('#site-tagline').find(elements[i]).removeClass('show');
    mainTagline.removeClass('hide');
    timeout = null;
  }
});