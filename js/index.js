$(document).ready(function () {
    //var gdfrTrack = musicClient.registerSong("assets/songs/gdfr.mp3");
    var this_love_guitar_track = musicClient.registerSong("assets/songs/this_love/song.ogg");
    var current_track = this_love_guitar_track;

    /*new Howl({
                    urls: ['songs/gdfr.mp3']
    });*/



    Leap.loop(function (frame) {

        gestureClient.update(frame);
        if (frame.hands.length > 0) {

            $("#palm").text("Palm position : 1. " + frame.hands[0].palmPosition[0] + " 2. " + frame.hands[0].palmPosition[1] + " 3. " + frame.hands[0].palmPosition[2]);

            $("#index").text(gestureClient.isRightIndexFingerPressed());

            if (gestureClient.isRightIndexFingerPressed()) {
                musicClient.play(current_track);
            }
            else {
                musicClient.pause(current_track);
            }
        }

        $("#frame").text(frame.id);
    });
});

var musicClient = {
    _debugMode: false,
    _registeredSongs: new Array(),

    //this function will register a song and 
    //will return a GUID associated with that song
    registerSong: function (songPath) {
        var songGUID = guid();
        this._registeredSongs[songGUID] = {
            song: new Howl({ urls: [songPath] }),
            playing: false,
            mute: false,
        }
        return songGUID;
    },
    //will play the music with guid if paused
    play: function (guid) {
        if (!this._registeredSongs[guid].playing) {
            this._registeredSongs[guid].playing = true;
            var temp = this._registeredSongs[guid].song.play();
            this.log(guid, " Playing");

            console.log(temp);
        }
    },
    //will pause the music with guid if playing
    pause: function (guid) {
        if (this._registeredSongs[guid].playing) {
            this._registeredSongs[guid].playing = false;
            this._registeredSongs[guid].song.pause();
            this.log(guid, " Paused");
        }
    },

    //will mute the song
    mute : function(guid){
        if (!this._registeredSongs[guid].mute) {
            this._registeredSongs[guid].mute = true;
            this._registeredSongs[guid].song.mute();
            this.log(guid, " Muted");
        }
    },


    //will unmate the song
    unmute : function(){
        if (this._registeredSongs[guid].mute) {
            this._registeredSongs[guid].mute = false;
            this._registeredSongs[guid].song.unmute();
            this.log(guid, " Unmuted");
        }
    },

    //this is just a logger
    log: function (data) {
        if (this.debugMode)
            console.log(data);
    }

}

var gestureClient = {
    config:{
        hands:['right','left'],
    },

    data: {},
    hands: { 'right': undefined, 'left': undefined },


    update: function (lp_data) {
        this.data = lp_data;
        if (lp_data.hands.length == 0) {
            this.hands.right = undefined;
            this.hands.left = undefined;
        }
        else if(lp_data.hands.length == 1){
            this.hands[lp_data.hands[0].type] = lp_data.hands[0];
            this.hands[this.config.hands[(this.config.hands.indexOf(lp_data.hands[0].type) + 1) % 2]] = undefined;
        }
        else if(lp_data.hands.length == 2){
            this.hands[lp_data.hands[0].type] = lp_data.hands[0];
            this.hands[lp_data.hands[1].type] = lp_data.hands[1];
        }
    },
    isRightIndexFingerPressed: function () {
        var pressedThreshold = 10;
        if(this.hands.right != undefined){
            if (this.hands.right.palmPosition[1] - this.hands.right.fingers[1].tipPosition[1] > pressedThreshold)
                return true;
        }
        return false;
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}
