function FBplus() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === "string") ?
        args : args[0],
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

    var isJquery = (typeof $ === "function") ? true : false;
    this.send = function(type, link, params, scallback, fcallback){
        var _fcallback,
            _scallback,
            _params = "";

        if (typeof params === "object" || typeof params === "undefined") {
            if(type === "get") {
                this.QueryParamsProjection(params);
                for (var name in params) {
                console.log(name);
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
            _scallback = (scallback) ? scallback : this.SCALLBACK;
            _fcallback = (fcallback) ? fcallback : this.FCALLBACK;
        }
        else {
            _scallback = (params)    ? params    : this.SCALLBACK;
            _fcallback = (scallback) ? scallback : this.FCALLBACK;
            _params += ("access_token=" + this.config.TOKEN);
        }
        if(isJquery) {
            $.ajax({
                url:link,
                data:_params,
                dataType:"json",
                type:type
            }).done(_scallback).fail(_fcallback);
        }
        else {
            console.error("no ajax object, default is used JQuery");
        }
    };
    callback(this);
};

FBplus.prototype.QueryParamsProjection = function(params){
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

/*
 * using in user not set fail handle callback
 */
FBplus.prototype.SCALLBACK = function(res) {
    console.error("need the parameter of success callback function");
    console.log(res);
};

/*
 * using in user not set success handle callback
 */
FBplus.prototype.FCALLBACK = function(res) {
    console.error("need the parameter of fail callback function");
    console.log(res);
};


FBplus.prototype.LINK = {
    FB_SERVER  : "https://graph.facebook.com/",
    OAUTH_LINK : "https://www.facebook.com/dialog/oauth?",
    TOKEN_LINK : "https://graph.facebook.com/oauth/access_token?"
};

FBplus.modules = {};
/*
FBplus.modules.config = function(box){
    box.config = box.config || {};
    box.config.FB_SERVER  = "https://graph.facebook.com/";
    box.config.OAUTH_LINK = "https://www.facebook.com/dialog/oauth?";
    box.config.TOKEN_LINK = "https://graph.facebook.com/oauth/access_token?";
};
*/
FBplus.modules.auth = function(box){
    box.auth = box.auth || {};
    box.auth.getToken = function(){
       return box.config.TOKEN;
    };

    box.auth.reloadToken = function(scallback, fcallback){
        var _link = box.LINK.TOKEN_LINK + "client_id=" + box.config.CLIENT_ID + "&redirect_uri=" + box.config.REDIRECT_URI + "&client_secret=" + box.config.SECRET_ID + "&code=" + box.config.CODE;
        console.log(_link);
        box.send("get", _link, scallback, fcallback);
    };

    box.auth.getLoginUrl = function(scope){
        return box.LINK.OAUTH_LINK + "client_id=" + box.config.CLIENT_ID + "&redirect_uri=" + box.config.REDIRECT_URI + "&scope=" + scope;
    };

    box.auth.getLogoutUrl = function(uri){
        return "https://www.facebook.com/logout.php?next=" + uri + "&access_token=" + box.config.TOKEN;
    };

    box.auth.getLongLiveToken = function(scallback, fcallback){
        var _link = "https://graph.facebook.com/oauth/access_token?client_id=" + box.config.CLIENT_ID + "&client_secret=" + box.config.SECRET_ID + "&grant_type=fb_exchange_token&fb_exchange_token=" + box.config.TOKEN;
        box.send("get", _link, scallback, fcallback);
    };
};

FBplus.modules.friends = function(box){
    box.friends = box.friends || box;
    box.friends.getFriendList = function(params, scallback, fcallback){
        var link = box.LINK.FB_SERVER + "me/friends/";
        box.send("get", link, params);
    };
    box.friends.getFriendInfo = function(fid, params, scallback, fcallback){
         var link = box.LINK.FB_SERVER + fid;
        box.send("get",link, params, scallback, fcallback);
    }
};

FBplus.modules.checkin = function(box){
    box.checkin = box.checkin || {};
    box.checkin.getFriendCheckin = function(fid, params, scallback, fcallback){
        var link = box.LINK.FB_SERVER + fid + "/checkins/";
        box.send("get", link, params, scallback, fcallback);
    },
    box.checkin.getMeCheckin = function(params, scallback, fcallback){
        box.checkin.getFriendCheckin("me", params, scallback, fcallback);
    };

    box.checkin.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.LINK.FB_SERVER + _fid + "/checkins/";
       box.send("post", link, _params);
    };
};

FBplus.modules.wall = function(box){
    box.wall = box.wall || {};
    box.wall.insert = function(fid, params){
       var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.LINK.FB_SERVER + _fid + "/feed/";
       box.send("post", link, _params);
    };

    box.wall.home = function(params){
        var link = box.LINK.FB_SERVER + "me/home/";
        box.send("get", link, params);
    };

    box.wall.feed = function(fid, params){
        var _fid    = (typeof fid === "string") ? fid : "me",
           _params = (typeof fid === "object") ? fid : params,
           link = box.LINK.FB_SERVER + _fid + "/feed/";
        box.send("get", link, _params);
    };
};
