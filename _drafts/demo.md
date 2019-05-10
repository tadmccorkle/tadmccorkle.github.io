---
layout: blog-post
title: Demo
category: Draft
permalink: /demo/
mathjax: true
excerpt: <p>This is an excerpt from the demo post.</p>
---

This page demos the formatting of blog posts on this site. It isn't built in the production version of the site. To see it in action, serve the site via "bundle exec jekyll serve --incremental --drafts --host 0.0.0.0".

## Demonstrations

This section is going to test out various element formatting implementations.

```python
import matplotlib.pyplot as plt
import random

plt.style.use('fivethirtyeight')

true = True # test

def gen_list(count=100):
    list_to_gen = []
    for _ in range(count):
        list_to_gen = list_to_gen + random.sample(range(10), 1)
    return list_to_gen

x = [x for x in range(10)]
x_even = [x for x in range(0, 10, 2)]
x_odd = [x for x in range(1, 11, 2)]
y1 = [y for y in range(2, 10, 2)] + [y for y in range(10, 0, -2)]
y2 = [y for y in range(10, 2, -2)] + [y for y in range(2, 12, 2)]

plt.xlabel('x-value')
plt.ylabel('y-value')
plt.title('Graph Title')
plt.hist(gen_list(1000), bins=5, label='histogram', color='g')
#plt.bar(x_even, gen_list(5), label='evens', color='g')
#plt.bar(x_odd, gen_list(5), label='odds', color='c')
#plt.plot(x, y1, label='Up and Down')
#plt.plot(x, y2, label='Down and Up')
plt.legend()
plt.show()
```

`def main()` is an example of inline code, and it looks like: `var a = 2`. We can test horizontal rules, now.

---

Success! Up next, a look at blockquotes.

> This is a not a quote, but someone may have said it.

That was a quick quote. Here's a long one.

> This is a quote that doesn't span multiple lines, but it is very long, which forces it to go over over multiple lines.

Here's a quote that has a header.

> ### Quote
>
> This is the quote. It also has [a link](#/) to nothing in it.

Finally, here's a multi-line quote.

> This is the quote
>
> that is explicitly multi-lined
> unlike the others thus far.

Now we can look at lists.

First, bullets:

* Item 1
* Item 2
* Item 3

Now, nested bullets:

* Item 1
  * Item a
  * Item b
* Item 2

Now numbers:

1. Item 1
2. Item 2

Now, nested numbers:

1. Item 1
   1. Item a
   2. Item b
2. Item 2

Now nested bullets within numbers:

1. This is item 1.
   * this is item 1.1
   * this is item 1.2
2. This is item 2.

Now, finally, numbers within bullets:

* This is a bullet.
  1. This is the first item.
  2. This is the second item.
* This is another bullet.

That's all for lists...for now. Tables are shown below:

|---|
| Default aligned | Left aligned | Center aligned | Right aligned |
|-|:-|:-:|-:|
| First body part | Second cell | Third cell | fourth cell |
| Second line |foo | **strong** | baz |
| Third line |quux | baz | bar |
|===|
| Footer row |
{:.with-caption}

{% include table-caption.html caption='**Caption for table**'
                              position='bottom'
                              align='center' %}

And here is a multi-body table:

{% include table-caption.html caption='**Caption for the table**'
                              position='top'
                              align='left' %}

|---|
| Default aligned | Left aligned | Center aligned | Right aligned |
|-|:-|:-:|-:|
| First body part | Second cell | Third cell | fourth cell |
| Second line |foo | **strong** | 1.67 |
| Third line |quux | [baz](/demo/) | bar |
|---|
| Second body |
| 2 line |
|===|
| Footer row |

Next, observe the formatting of images. Make sure the image below is added to the site's assets. See below:

{% include image.html src='posts/drafts/DSC_0050.JPG'
                      class='center limit-width-40r'
                      alt='Bird'
                      caption='*This* is **the** image caption with a *[link](/demo/)*.'
                      caption_class='center-figure-caption' %}

Up next is the double image:

{% include double-image.html left_src='posts/drafts/DSC_0050.JPG'
                             left_class='center no-border limit-height-10r'
                             left_alt='Left Bird'
                             right_src='posts/drafts/DSC_0050.JPG'
                             right_class='center limit-height-10r'
                             right_alt='Right Bird'
                             caption='*This* is **the** image caption with a *[link](/demo/)*' %}

How about equations?
{:style='padding-bottom:0'}

{% include equation.html equations='a^2 + b^2 = c^2' %}

Multiple?
{:style='padding-bottom:0'}

{% include equation.html equations='a^2 + b^2 = c^2\?/a^2 + b^2 = c^2\?/a^2 + b^2 = c^2' %}

And inline? {% raw %}$$a^2 + b^2 = c^2$${% endraw %} - So impressive.

And that's it for formatting. The section below demonstrates the comments for this site. All comments were taken from the Spinning Numbers site's [post on Staticman](https://spinningnumbers.org/a/staticman.html) for testing purposes. Both that article and that site's [GitHub repo](https://github.com/willymcallister/willymcallister.github.io) were used extensively in creating the comment system for this site. The [Made Mistakes site's GitHub repo](https://github.com/mmistakes/made-mistakes-jekyll) and [Eduardo Boucas's personal site's GitHub repo](https://github.com/eduardoboucas/eduardoboucas.com) were also used for reference.
