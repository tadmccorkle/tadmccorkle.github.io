---
title: 'Be Aware of Comma-Separated Pseudo-Classes'
date: 2019-07-26
category: Programming
tags:
  - browser-compatibility
  - css
  - web-design
excerpt: <p>The <code>:focus-within</code> pseudo-class is one of my favorite things to use in CSS, but placing it with comma-separated selectors can cause problems.</p>
---

Chris Coyier of [css-tricks.com](https://css-tricks.com){:target="_blank"} beat me to this topic earlier this week. Check out [his post](https://css-tricks.com/dont-comma-separate-focus-within-if-you-need-deep-browser-support/){:target="_blank"} if you're interested - he also includes a nifty use-case for CSS mixins that I didn't think of.

## Focus-Within

I was really excited to find out about the `:focus-within` pseudo-class. My favorite place I'm using it right now is with the form element animations on this site, but my first use for it was with the social media icon links in this site's navbar. Tabbing through the links on any page eventually focuses on the social media icon links, whose display properties are dictated by their parent `<li>` element. Because I'm using `:focus-within`, the parent `<li>` element can be "selected" when the child `<a>` element is in focus. This allows the social media icon links to be displayed on tab-focus without clicking "Social." Originally, my SCSS looked like this:

```scss
.social-site-header-links {
  @extend %header-links;
  @include only-screen-b {
    -webkit-box-flex: 100%;
        -ms-flex: 100%;
            flex: 100%;
  }
  @include screen-c {
    display: none;
    height: 0;
  }

  &.active > .social-site-header-link,
  > .social-site-header-link:focus-within {
    @include only-screens-ab {
      cursor: pointer;
      pointer-events: all;
      -webkit-box-sizing: content-box;
              box-sizing: content-box;
      width: 1em;
      padding-left: 1em;
      opacity: 1;
    }
    @include only-screen-b {
      height: 1em;
      -webkit-transform: scale(1, 1);
              transform: scale(1, 1);
    }
  }
}
```

The above works with Chrome, Firefox, and Safari, which are the browsers I use/test most frequently, but it doesn't (at the time of this writing) work with Microsoft Edge, which I usually reluctantly launch to test changes with this site. It was on one of these occasions that I realized this sad truth. Because Edge doesn't support `:focus-within`, the `.active` selector wouldn't produce the UI animation I had grown to expect after clicking "Social" in the navbar. I wasn't aware of browser behavior when it comes to unknown selectors, so I spent an afternoon Googling and tinkering with my JavaScript, HTML, and CSS, all to no avail.

{% include image.html url_src='https://imgs.xkcd.com/comics/debugging.png'
                      class='center'
                      alt='xkcd 1722'
                      href='https://xkcd.com/1722/'
                      target='_blank'
                      caption='<a href="https://xkcd.com/1722/" target="_blank">https://xkcd.com/1722/</a>'
                      caption_class='center-figure-caption' %}

Eventually I figured out browsers don't apply styling associated with comma-separated selector groups if they don't recognize one or more of the selectors. Ungrouping the selectors fixed the issue.

```scss
// show header links when active
&.active > .social-site-header-link {
  @include only-screens-ab {
    cursor: pointer;
    pointer-events: all;
    -webkit-box-sizing: content-box;
            box-sizing: content-box;
    width: 1em;
    padding-left: 1em;
    opacity: 1;
  }
  @include only-screen-b {
    height: 1em;
    -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
  }
}

// show header links when focused
// must keep separate from above for MS
// Edge compatibility
> .social-site-header-link:focus-within {
  @include only-screens-ab {
    cursor: pointer;
    pointer-events: all;
    -webkit-box-sizing: content-box;
            box-sizing: content-box;
    width: 1em;
    padding-left: 1em;
    opacity: 1;
  }
  @include only-screen-b {
    height: 1em;
    -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
  }
}
```

The `:focus-within` animation still doesn't work in Edge, but at least the icons can be seen by clicking "Social."

## The takeaway?

If you care about browser support, be sure to check [https://caniuse.com](https://caniuse.com){:target="_blank"} before comma-separating selectors with [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes){:target="_blank" title="Mozilla web docs on pseudo-classes"} and/or [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements){:target="_blank" title="Mozilla web docs on pseudo-elements"}, and never comma-separate selectors with [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix){:target="_blank" title="Mozilla web docs on vendor prefixes"}. Also, don't use Edge.
