Flickr = function(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;
}

Flickr.prototype = {
    getPhotosets: function(handle) {
        var me = this;
        return new Promise((resolve, reject) => {
            this._ajax({
                data: {
                    method: "flickr.photosets.getList"
                },
                success: function(data) {
                    if(data.stat == "fail") {
                        reject("Flickr error: " + data.message);
                        return;
                    }

                    var photosets = data.photosets.photoset.map((ps) => new Flickr.Photoset(me, ps));
                    resolve(photosets);

                },
                error: function() { reject("Unexpected Flickr API failure"); },
            });
        });
    },

    urls: {
        lookupUser: function(url) {
            return new Promise((resolve, reject) => {
                this.__proto__._ajax({
                    data: {
                        method: 'flickr.urls.lookupUser',
                        url: url,
                    },
                    success: function(data) {
                        if(data.stat == "fail")
                        {
                            reject("Flickr error: " + data.message);
                            return;
                        }

                        resolve(data.user);
                    },
                    error: function() { reject("Unexpected Flickr API failure"); },
                });
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
        return new Promise((resolve, reject) => {
            this.api._ajax({
                data: {
                    method: "flickr.photosets.getPhotos",
                    photoset_id: me.id,
                    extras: 'url_t,url_m,date_taken,original_format,o_dims',
                },
                success: function(data) {
                    if(data.stat == "fail") {
                        reject("Flickr API error: " + data.message);
                        return;
                    }

                    var photos = data.photoset.photo.map(
                        (p) => new Flickr.Photo(me.api, p));
                    resolve(photos);
    
                },
                error: function() { 
                    reject("Unexpected Flickr API failure");
                },
            });
        });
    },

}

Flickr.Photo = function(api, data)
{
    for (var attrname in data) { 
        this[attrname] = data[attrname]; 
    }
    this.api = api;
}

Flickr.Photo.prototype = {
    getSizes: function(handler) {
        me = this;
        return new Promise((resolve, reject) => {
            this.api._ajax({
                data: {
                    method: "flickr.photos.getSizes",
                    photo_id: me.id,
                },
                success: function(data) {
                    if(data.stat == "fail") {
                        reject("Flickr API error: " + data.message);
                        return;
                    }

                    resolve(data.sizes.size);
                },
                error: function() { reject("Unexpected Flickr API failure"); },
            });
        });
    },

};
