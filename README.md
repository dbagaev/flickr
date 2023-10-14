This is a one pager helper to view your Flick images and generate links with images of different sizes to insert them into html.

Working page is hosted on github pages at https://dbagaev.github.io/flickr/

To use the page you will need your API key, which you can get for free for non commercial use from Flickr. As User ID you can use you Flickr user ID which looks like `12345678@Z09` as well as url of your photos in form of `https://www.flickr.com/photos/username/` or even just your Flickr `username`.

* You can select multiple images with Ctrl key, then you can add flex attribute to keep them nicely aligned
* You can use your own template with a few tags:
  - {url} - URL of current selected image size. Note that all images should have selected size on Flickr
  - {align} - add align property to the image, actually deprecated
