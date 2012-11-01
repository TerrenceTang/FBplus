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
    new FBplus(['checkin', 'friends', 'config', 'auth', 'wall'], function(plus){
        // dosomethings
    });

    or

    new FBplus("*", function(plus){
        // dosomethings
    });
```

#Auth
The module of Auth is using to help developer to create login url or deal token

```
    new FBplus(['auth'], function(plus){
        // the scope is about permession which will developer access
        var scope = "read_stream,publish_checkins,publish_stream,user_status,user_checks,user_birthday,friends_status";

        // get login link
        plus.auth.getLoginUrl(scope);

        // get logout link
        plus.auth.getLogoutUrl()

        //get long live token, this is danger to use in client, because it needs the secret id.
        //add this feature is because the defuault timeout in facebook is 2 hours.
        //In develop step, developer needs always re-load access token, it is very annoying.
        plus.auth.ltoken().done(success_callback_function).fail(fail_callback_function);

    });
```
more information to see [facebook permession](http://developers.facebook.com/docs/authentication/permissions/)

#Wall
The wall is about some activity of user or friend.

```
    new FBplus(['wall'], function(plus){
        // to get the home wall which include activitys of user and friends
        plus.wall.home().done(success_callback_function).fail(fail_callback_function);

        // to get the feed wall which base on friend's id
        plus.wall.feed("fid").done(success_callback_function).fail(fail_callback_function);

        // to get freined's shares
        plus.wall.shares("start_time", "limit").done(success_callback_function).fail(fail_callback_function);

        // get comments by id
        plus.wall.comments("id").done(success_callback_function).fail(fail_callback_function);

        // get comments by id
        plus.wall.likes("id").done(success_callback_function).fail(fail_callback_function);

        // get share links by id
        plus.wall.links("id").done(success_callback_function).fail(fail_callback_function);

        // insert message into wall
        plus.wall.insert({message:"content"}).done(success_callback_function).fail(fail_callback_function);
        // insert conment
        plus.wall.insertComment(id, {message:"content"}).done(success_callback_function).fail(fail_callback_function);
        // insert like
        plus.wall.insertLike(id).done(success_callback_function).fail(fail_callback_function);

    });
```

#Friends
The module of friends shows friend list and information

```
    new FBplus(['friends'], function(plus){
        // show all friend
        plus.friends.list().done(success_callback_function).fail(fail_callback_function);

        // show information of friend
        plus.friends.nfo("fid").done(success_callback_function).fail(fail_callback_function);
        or
        plus.friends.info("me").done(success_callback_function).fail(fail_callback_function);
    });
```

#Checkin
The module of checkin shows the checkin from user or friend

```
    new FBplus(['checkin'], function(plus){
        // show checkin from friend
        plus.checkin.friend("fid").done(success_callback_function).fail(fail_callback_function);

        // show checkin from me
        plus.checkin.me().done(success_callback_function).fail(fail_callback_function);

        // make checkin
        plus.checkin.insert(
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
   new FBplus(['checkin'], function(plus){
       // get 3 numbers data
       plus.checkin.me({limit:3});
       // get checkin which create until yesterday
       plus.checkin,me({until:"yesterday"});
       // get checkin which was created  since yesterday
       plus.checkin,me({since:"yesterday"});
    });
```
