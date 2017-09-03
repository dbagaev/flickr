Flickr = function(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;
}

Flickr.prototype = {
    getPhotosets: function(handle) {
        var me = this;
        this._ajax({
            data: {
                method: "flickr.photosets.getList"
            },
            success: function(data) {
                if(data.stat == "fail")
                {
                    alert("Flickr error: " + data.message);
                    return;
                }

                for(i = 0; i<data.photosets.photoset.length; ++i)
                {
                    var photoset = new Flickr.Photoset(me, data.photosets.photoset[i]);
                    handle(photoset);
                }

            },
            error: function() { alert("Fail..."); },
        });
    },

    urls: {
        lookupUser: function(url, handler) {
            this.__proto__._ajax({
                data: {
                    method: 'flickr.urls.lookupUser',
                    url: url,
                },
                success: function(data) {
                    if(data.stat == "fail")
                    {
                        alert("Flickr error: " + data.message);
                        return;
                    }

                    handler(data.user);
                }
            });
        },
    },

    _ajax: function(cfg) {
        cfg.url = "https://api.flickr.com/services/rest/";
        cfg.data.api_key = this.apiKey;
        cfg.data.user_id = this.userId;
        cfg.data.format = "json";
        cfg.data.nojsoncallback = 1;
        cfg.type = "post";
        cfg.dataType = "json";

        jQuery.ajax(cfg);
    }


}

Flickr.Photoset = function(api, data)
{
    this.api = api;
    this.id = data.id;

    this.title = data.title._content;
    this.description = data.description._content;
}

Flickr.Photoset.prototype = {

    getPhotos: function(handler) {
        var me = this;
            this.api._ajax({
                data: {
                    method: "flickr.photosets.getPhotos",
                    photoset_id: me.id,
                    extras: 'url_t',
                },
                success: function(data) {
                    if(data.stat == "fail")
                    {
                        alert("Flickr error: " + data.message);
                        return;
                    }

                    for(i = 0; i<data.photoset.photo.length; ++i)
                    {
                        var photo = new Flickr.Photo(me.api, data.photoset.photo[i]);
                        handler(photo);
                    }

                },
                error: function() { alert("Fail..."); },
            });

      //  }
    },

}

Flickr.Photo = function(api, data)
{
    this.api = api;
    this.id = data.id;

    this.url_t = data.url_t;
    //this.title = data.title._content;
    //this.description = data.description._content;
}

Flickr.Photo.prototype = {
        getSizes: function(handler) {
            me = this;
            this.api._ajax({
                data: {
                    method: "flickr.photos.getSizes",
                    photo_id: me.id,
                },
                success: function(data) {
                    if(data.stat == "fail")
                    {
                        alert("Flickr error: " + data.message);
                        return;
                    }

                    handler(data.sizes.size);
                },
                error: function() { alert("Fail..."); },
            });


        //}
    },

};
