Flickr = function(apiKey, userId) {
    this.apiKey = apiKey;
    this.userId = userId;

    this.urls = new Flickr.Urls(this);
}

Flickr.prototype = {
    getPhotosets: function(handle) {
        var me = this;        
        return this._callFlickrApi("flickr.photosets.getList", {})
            .then((data) => {
                    return data.photosets.photoset.map((ps) => new Flickr.Photoset(me, ps)); });
    },

    _callFlickrApi: function(method, data) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                url: "https://api.flickr.com/services/rest/",
                type: "post",
                dataType: "json",
                data: Object.assign(
                    {
                        method: method,
                        api_key: this.apiKey,
                        user_id: this['userId'] !== undefined ? this.userId : null,
                        format: "json",
                        nojsoncallback: 1,
                    },
                    data),

                success: function(data) {
                    if(data.stat == "fail") {
                        reject("Flickr error: " + data.message);
                    }
                    resolve(data);
                },

                error: function() { reject("Unexpected Flickr API failure"); }
            });
        });
    }
}

Flickr.Urls = function(api) {
    this.api = api;
}

Flickr.Urls.prototype = {
    lookupUser: function(url) {
        return this.api._callFlickrApi(
                'flickr.urls.lookupUser',
                { url: url })
            .then((data) => data.user.id);
    },
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
        return this.api._callFlickrApi(
            "flickr.photosets.getPhotos", 
            { 
                photoset_id: me.id,
                extras: 'url_t,url_m,date_taken,original_format,o_dims',
            })
            .then(function(data) {
                return data.photoset.photo.map((p) => new Flickr.Photo(me.api, p)); });
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
        return this.api._callFlickrApi("flickr.photos.getSizes", { photo_id: me.id })
            .then((data) => data.sizes.size);
    },

};
