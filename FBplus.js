function FBplus() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === "string") ? args : args[0],
        i;
    if (!(this instanceof FBplus)) {
        return new FBplus(modules, callback);
    }

    if (!modules || modules === '*') {
        modules = [];
        for (i in FBplus.modules) {
            if (FBplus.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }
    for (i = 0; i < modules.length; i++) {
        FBplus.modules[modules[i]](this);
    }
    callback(this);
};

FBplus.prototype.FN = {};
FBplus.prototype.FN.send = function(type, link, params){
    var  _params;
    if (typeof params === "object") {
        if(type === "get") {
            this.FN.QueryParamsProjection(params);
            for (var name in params) {
                if (typeof params[name] === "string" || typeof params[name] === "number") {
                    _params += (name + "=" + params[name] + "&");
                }
            }
            _params += ("access_token=" + this.config.TOKEN);
        }
        else{
            params.access_token = this.config.TOKEN;
            _params = params;
        }
    }
    else {
        _params = ("access_token=" + this.config.TOKEN);
    }
    return  $.ajax({
        url:link,
        data:_params,
        dataType:"json",
        type:type
    });
};

FBplus.prototype.FN.get = function(_this,link, params){
    return FBplus.prototype.FN.send.call(_this, "get", link, params);
};

FBplus.prototype.FN.post= function(_this, link, params){
    return FBplus.prototype.FN.send.call(_this, "post", link, params);
}

FBplus.prototype.FN.QueryParamsProjection = function(params){
    var project = ["limit","offset","until","since"],
        i;
    for(i in params) {
        if (params.hasOwnProperty(i)) {
            if (project.indexOf(i) === -1) {
                console.error("Fail, " + i + "is not correct parameter in this query");
            }
        }
    }
};

FBplus.prototype.LINK = {
    FB_SERVER  : "https://graph.facebook.com/",
    OAUTH_LINK : "https://www.facebook.com/dialog/oauth?",
    TOKEN_LINK : "https://graph.facebook.com/oauth/access_token?"
};

FBplus.modules = {};
FBplus.modules.auth = function(plus){
    plus.auth = plus.auth || {};
    plus.auth.getToken = function(){
       return plus.config.TOKEN;
    };
    plus.auth.setToken = function(token) {
        plus.config.TOKEN = token;

    };

    plus.auth.code2token = function(code) {
        var _link = plus.LINK.TOKEN_LINK + "client_id=" + plus.config.CLIENT_ID + "&redirect_uri=" + plus.config.REDIRECT_URI + "&client_secret=" + plus.config.SECRET_ID + "&code=" + code;
        return plus.FN.get(plus,_link);
    };

    plus.auth.getLoginUrl = function(scope){
        return plus.LINK.OAUTH_LINK + "client_id=" + plus.config.CLIENT_ID + "&redirect_uri=" + plus.config.REDIRECT_URI + "&scope=" + scope + "&response_type=token";
    };

    plus.auth.getLogoutUrl = function(uri){
        return "https://www.facebook.com/logout.php?next=" + uri + "&access_token=" + plus.config.TOKEN;
    };

    plus.auth.ltoken = function(){
        var _link = "https://graph.facebook.com/oauth/access_token?client_id=" + plus.config.CLIENT_ID + "&client_secret=" + plus.config.SECRET_ID + "&grant_type=fb_exchange_token&fb_exchange_token=" + plus.config.TOKEN;
        return plus.FN.get(plus,_link);
    };
};

FBplus.modules.friends = function(plus){
    plus.friends = plus.friends || {};
    plus.friends.list = function(params){
        var _link = plus.LINK.FB_SERVER + "me/friends/";
        return plus.FN.get(plus,_link, params);
    };

    plus.friends.info = function(fid){
         var _fid  = (typeof fid !== "undefined" && typeof fid === "string") ? fid : "me",
             _link = plus.LINK.FB_SERVER + _fid;
        return plus.FN.get(plus,_link);
    };

    plus.friends.groups = function(fid) {
        var _fid  = (typeof fid !== "undefined" && typeof fid === "string") ? fid : "me",
        _link = plus.LINK.FB_SERVER + _fid + "/groups";
        return plus.FN.get(plus,_link);
    };
};

FBplus.modules.groups = function(plus){
    plus.groups = {};
    plus.groups.list = function(fid){
        var _fid  = (typeof fid !== "undefined" && typeof fid === "string") ? fid : "me",
        _link = plus.LINK.FB_SERVER + _fid + "/groups";
        return plus.FN.get(plus,_link);
    };

    plus.groups.info = function(gid){
        var _link = plus.LINK.FB_SERVER + gid;
        return plus.FN.get(plus,_link);
    };

    plus.groups.members = function(gid){
        var _link = plus.LINK.FB_SERVER + gid + "/members";
        console.log(_link);
        return plus.FN.get(plus,_link);
    };

    plus.groups.docs = function(gid){
        var _link = plus.LINK.FB_SERVER + gid + "/docs";
        return plus.FN.get(plus,_link);
    };

   plus.groups.feed = function(gid){
        var _link = plus.LINK.FB_SERVER + gid + "/feed";
        return plus.FN.get(plus,_link);
    };

};


FBplus.modules.checkin = function(plus){
    plus.checkin = plus.checkin || {};

    plus.checkin.friend = function(fid, params){
        var _link = plus.LINK.FB_SERVER + fid + "/checkins/";
        return plus.FN.get(plus,_link);
    };

    plus.checkin.me = function(params){
        return plus.checkin.friend("me", params);
    };

    plus.checkin.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           _link = plus.LINK.FB_SERVER + _fid + "/checkins/";
           return  plus.FN.post(plus, _link, _params);
    };
};

FBplus.modules.wall = function(plus){
    plus.wall = plus.wall || {};

    plus.wall.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           _link = plus.LINK.FB_SERVER + _fid + "/feed/";
       return plus.FN.post(plus, _link, _params);
    };

    plus.wall.insertComment = function(fid, params){
       var  _link = plus.LINK.FB_SERVER + fid + "/comments/";
       return plus.FN.post(plus, _link, params);
    };

    plus.wall.insertLike = function(fid){
       var  _link = plus.LINK.FB_SERVER + _fid + "/likes/";
       return plus.FN.post(plus, _link);
    };

    plus.wall.home = function(params){
        var _link = plus.LINK.FB_SERVER + "me/home/";
        return plus.FN.get(plus, _link, params);
    };

    plus.wall.feed = function(fid, params){
        var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           _link = plus.LINK.FB_SERVER + _fid + "/feed/";
        return plus.FN.get(plus, _link, params);
    };

    plus.wall.comments = function(post_id) {
        var _link = plus.LINK.FB_SERVER + post_id + "/comments/";
        return plus.FN.get(plus, _link);
    };

    plus.wall.likes = function(post_id) {
        var _link = plus.LINK.FB_SERVER + post_id + "/likes/";
        return plus.FN.get(plus, _link);
    };

    plus.wall.links = function(fid) {
        var _link = plus.LINK.FB_SERVER + fid + "/links/";
        return plus.FN.get(plus, _link);
    };

    plus.wall.shares = function(ctime, limit) {
        var  _default_time  = new Date().getTime().toString().substr(0,10) - (86400),
             _default_limit = 100,
             _ctime = (typeof ctime != "undefined" && typeof ctime != "number") ? ctime : _default_time,
             _limit = limit || (ctime && typeof ctime == "number") ? ((ctime.length > 10) ? ctime.substr(0,10) : ctime)  : _default_limit,
             _fql  = "SELECT post_id, actor_id, target_id, message, comments, permalink, likes, attachment  FROM stream"
                   + " WHERE created_time > " + _ctime + " and type = 80 and filter_key "
                   + " in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') AND is_hidden = 0 limit " + _limit,
            _link = plus.LINK.FB_SERVER + "fql?q=" + _fql;
        return plus.FN.get(plus, _link);
    };

};
