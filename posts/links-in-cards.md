---
title: Links in Cards
tags: ['How to Use']
color: '#90ffff'
---

<video class="wide" autoplay loop muted playsinline>
  <source src="/assets/posts/add-url-to-card.mp4">
</video>

So you might know that adding a URL (like [spacejam.com](https://spacejam.com)) to a card enables a `→` link button on the card.

## Multiple URLs

<video class="wide" autoplay loop muted playsinline>
  <source src="/assets/posts/multiple-urls-in-card.mp4">
</video>

In cards with multiple URLs (e.g. images, audio, and links), if a link URL is available, the `→` card button use the link, otherwise it'll use the first URL in the card.

So if I have a card with an image url and a link like:

> https://us-east-1.linodeobjects.com/kinopio-uploads/prwduNJJz32Dn6C1VopLX/image.png
this is an image with a link to
folklore.org

The `→` will link to [folklore.org](folklore.org)


## Hiding Links

<video class="wide" autoplay loop muted playsinline>
  <source src="/assets/posts/hide-links.mp4">
</video>

There are times when you might not want to display the link URL on a card, but still have a `→` button that links to it.

You can hide links by appending a querystring param `?kinopio=hide` to it.

Note that the way URL querystrings work is a little inelegant:

If the url doesn't have any querystrings, like [folklore.org](folklore.org) then append `?kinopio=hide`

However, if the url already has a querystring like the `?v=` in [https://www.youtube.com/watch?v=QRMBKd-4OIg](https://www.youtube.com/watch?v=QRMBKd-4OIg), then you'll need to append `&kinopio=hide` (with `&` instead of `?`)

