FBplus
======

FBplus is a light javascript library for handling facebook data.<br>
FBplus is used url to insert or query data, so developer doesn't need to load heavy library.<br>
FBplus is build on jquery, so user needs to load jquery library before using FBplus

#Setting
In first, developer needs to set you app information

```
    FBplus.prototype.config = {
        TOKEN:'access token',
        CLIENT_ID:"your app id ",
        SECRET_ID:"your secret id",
        CODE:"user's code",
        REDIRECT_URI:"after login, where will be redirect to "
    };

```

* TOKEN ：
* CLIENT_ID:
* SECRET_ID:
* CODE:
* REDIRECT_URI:

#Start
FBplus is implemented by sandbox methodology. So developer needs to choose which module does he needs.

```
    new FBplus(['checkin', 'friends', 'config', 'auth', 'wall'], function(box){
        // dosomethings
    });

    or

    new FBplus("*", function(box){
        // dosomethings
    });
```

#Auth
The module of Auth is using to help developer to create login url or deal token

```
    new FBplus(['auth'], function(box){
        // the scope is about permession which will developer access
        var scope = "read_stream,publish_checkins,publish_stream,user_status,user_checks,user_birthday,friends_status";

        // get login link
        box.auth.getLoginUrl(scope);

        // get logout link
        box.auth.getLogoutUrl()

        //get long live token, this is danger to use in client, because it needs the secret id.
        //add this feature is because the defuault timeout in facebook is 2 hours.
        //In develop step, developer needs always re-load access token, it is very annoying.
        box.auth.getLongLiveToken(success_callback_function, fail_callback_function);

    });
```
more information to see [facebook permession](http://developers.facebook.com/docs/authentication/permissions/)

#Wall
The wall is about some activity of user or friend.

```
    new FBplus(['wall'], function(box){
        // to get the home wall which include activitys of user and friends
        box.wall.home(success_callback_function, fail_callback_function);
        // to get the feed wall which base on friend's id
        box.wall.feed("fid", success_callback_function, fail_callback_function);
        // insert message into wall
        box.wall.insert({message:"content"}, success_callback_function, fail_callback_function);
    });
```

#Friends
The module of friends shows friend list and information

```
    new FBplus(['friends'], function(box){
        // show all friend
        box.friends.getFriendList(success_callback_function, fail_callback_function);
        // show information of friend
        box.friends.getFriendInfo("fid", success_callback_function, fail_callback_function);
        or
        box.friends.getFriendInfo("me", success_callback_function, fail_callback_function);
    });
```

#Checkin
The module of checkin shows the checkin from user or friend

```
    new FBplus(['checkin'], function(box){
        // show checkin from friend
        box.checkin.getFriendCheckin("fid", success_callback_function, fail_callback_function);

        // show checkin from me
        box.checkin.getMeCheckin(success_callback_function, fail_callback_function);

        // make checkin
        box.checkin.insert(
            {
               coordinates:
               {
                  latitude:"25.07698687147",
                  longitude:"121.23201566872"
               },
               message:"test",
               place:"142800992448822"
            }
        success_callback_function, fail_callback_function);
    });
```

#Query Parameter
When querying data, there are several useful parameters that enable you to filter and page through connection data:

* limit
* offset
* until
* since

[more information](https://developers.facebook.com/docs/reference/api/pagination/)

```
   new FBplus(['checkin'], function(box){
       // get 3 numbers data
       box.checkin.getMeCheckin({limit:3});
       // get checkin which create until yesterday
       box.checkin,getMeChekin({until:"yesterday"});
       // get checkin which was created  since yesterday
       box.checkin,getMeChekin({since:"yesterday"});
    });
```
