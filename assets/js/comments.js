/********************************************************************
 * All code below taken from
 * https://github.com/eduardoboucas/popcorn/blob/gh-pages/js/main.js,
 * https://github.com/willymcallister/willymcallister.github.io/,
 * and https://github.com/mmistakes/made-mistakes-jekyll/.
 * Slightly modified to be compatible with this site.
 *
*********************************************************************/

// Static comments
(function($) {
  $('#comment-form').submit(function() {
    $('#comment-submit-success').hide();
    $('#comment-submit-failure').hide();
    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      contentType: 'application/x-www-form-urlencoded',
      success: function() {
        $('#comment-submit-success').show();
      },
      error: function (e) {
        console.log(e);
        $('#comment-submit-failure').show();
      }
    });
    return false;
  });
})(jQuery);

/**
 * Staticman comment replies.
 * - from: https://github.com/mmistakes/made-mistakes-jekyll
 * - portions of this code modified from:
 *   https://core.svn.wordpress.org/trunk/wp-includes/js/comment-reply.js
 */
var addComment = {
  moveForm: function(commentId, parentId, respondId, postId) {
    var div, element, firstChild, style,
    t = this,
    comment = t.I(commentId),
    respond = t.I(respondId),
    cancel = t.I('comment-cancel'),
    parent = t.I('comment-replying-to'),
    post = t.I('comment-post-slug'),
    commentForm = t.I('comment-form'),
    commentFormHeading = t.I('comment-heading'),
    commentReplyHeading = t.I('comment-reply-heading');

    if (!comment || !respond || !cancel || !parent
        || !commentForm || !commentFormHeading
        || !commentReplyHeading) return;

    t.respondId = respondId;
    postId = postId || false;

    // create placeholder for comment form
    if (!t.I('form-placeholder')) {
      div = document.createElement('div');
      div.id = 'form-placeholder';
      div.style.display = 'none';
      respond.parentNode.insertBefore(div, respond);
    }

    // move form directly below reply-to comment
    firstChild = t.I(comment.id+'-1');
    if (firstChild) {
      respond.style.paddingTop = '3rem';
      respond.style.paddingBottom = '';
      comment.insertBefore(respond, firstChild);
    } else {
      respond.style.paddingTop = '';
      respond.style.paddingBottom = '3rem';
      comment.parentNode.insertBefore(respond, comment.nextSibling);
    }
    
    if (post && postId) {
      post.value = postId;
    }
    parent.value = parentId;

    // swap comment form header
    commentFormHeading.style.display = 'none';
    commentReplyHeading.style.display = '';

    cancel.onclick = function() {
      var t = addComment,
      placeholder = t.I('form-placeholder'),
      respond = t.I(t.respondId);
      if (!placeholder || !respond) return;

      t.I('comment-replying-to').value = null;
      placeholder.parentNode.insertBefore(respond, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      commentReplyHeading.style.display = 'none';
      commentFormHeading.style.display = '';
      respond.style.padding = '';
      this.onclick = null;
      return false;
    };

    try { // set initial focus to first form-focusable element
      for (var i = 0; i < commentForm.elements.length; i++) {
        element = commentForm.elements[i];

        if ('getComputedStyle' in window) {
          style = window.getComputedStyle(element);
        } else if (document.documentElement.currentStyle) {
          style = element.currentStyle; // IE 8
        }

        // skip form elements that are hidden or disabled.
        if (element.type === 'hidden' || element.disabled
            || ((element.offsetWidth <= 0 && element.offsetHeight <= 0)
                || style.visibility === 'hidden')) continue;

        // stop after the first focusable element.
        element.focus();
        break;
      }
    } catch(er) {} // IE 7 errors
    return false;
  },
  I: function(id) {
    return document.getElementById(id);
  }
};