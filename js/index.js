window.setVariableInterval = function (callbackFunc, timing) {
    var variableInterval = {
        interval: timing,
        callback: callbackFunc,
        stopped: false,
        runLoop: function () {
            if (variableInterval.stopped) return;
            var result = variableInterval.callback.call(variableInterval);
            if (typeof result == 'number') {
                if (result === 0) return;
                variableInterval.interval = result;
            }
            variableInterval.loop();
        },
        stop: function () {
            this.stopped = true;
            window.clearTimeout(this.timeout);
        },
        start: function () {
            this.stopped = false;
            return this.loop();
        },
        loop: function () {
            this.timeout = window.setTimeout(this.runLoop, this.interval);
            return this;
        }
    };
    return variableInterval.start();
};


$(document).ready(function () {

   
    var kick = new Wad({ source: 'assets/songs/kick.mp3' });
    var bass = new Wad({
        source: 'sine',
        volume: .9,
        globalReverb: true,
        env: {
            attack: .02,
            decay: .1,
            sustain: .9,
            hold: .4,
            release: .1
        }
    });

    musicClient.createKick(1000);

    Leap.loop(function (frame) {
        gestureClient.update(frame);

        if (gestureClient.isLeftIndexFingerPressed()) {
            var lh_height = Math.abs(gestureClient.hands.left.palmPosition[1]);

            //changing the range of the number
            //NewValue = (((OldValue - OldMin) * 
            //  (NewMax - NewMin)) / 
            //  (OldMax - OldMin)) + 
            //  NewMin

            var f = parseInt((((lh_height - gestureClient.config.heightMin) *
                (musicClient.config.kickFrequencyMax - musicClient.config.kickFrequencyMin)) /
                (gestureClient.config.heightMax - gestureClient.config.heightMin)) +
                musicClient.config.kickFrequencyMin);


            //updating the kick frequnecy based on the hand height
            musicClient.updateKickFrequency(f);

            //setting the height of the bar in the UI
            UI.setBarHeight(UI.config.bars.kick, lh_height);


            //$("#kick p").text(f);
        }

    });
});

var musicClient = {
    config:{
        kickFrequencyMin:50,
        kickFrequencyMax: 2000,


    },

    _debugMode: true,
    _registeredSongs: new Array(),
    
    //music related variables
    kickFreq: 1000,
    kickInterval: {},

    //this function will register a song and 
    //will return a GUID associated with that song
    registerSong: function (songPaths) {
        var retGuids = {};

        for (song in songPaths) {

            var path = songPaths[song];
            var songGUID = guid();

            this._registeredSongs[songGUID] = {
                song: new Howl({ urls: [path], buffer: true }),
                playing: false,
                mute: false,
            }

            //adding the guid to the return value
            retGuids[song]= songGUID;
        }
        return retGuids;
    },

    //will play the music with guid if paused
    play: function (guids) {
        var is_to_be_played = [];

        if (typeof guids === 'object') {

            for (song in guids)
            {
                var guid = guids[song];

                if(!this._registeredSongs[guid].playing) {
                    this._registeredSongs[guid].playing = true;
                    this._registeredSongs[guid].song.play();
                    this.log(guid, " Playing");
                }
            }
        }
        else {
            var guid = guids;
            if (!this._registeredSongs[guid].playing) {
                this._registeredSongs[guid].playing = true;
                this._registeredSongs[guid].song.play();
                this.log(guid, " Playing");
            }
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

    //will unmute the song
    unmute : function(guid){
        if (this._registeredSongs[guid].mute) {
            this._registeredSongs[guid].mute = false;
            this._registeredSongs[guid].song.unmute();
            this.log(guid, " Unmuted");
        }
    },

    //this is just a logger
    log: function (data) {
        if (this._debugMode)
            console.log(data);
    },

    //will create a beat
    createKick: function (freq) {
        var kick = new Wad({
            source: 'assets/songs/kick.mp3',
            reverb: {
                impulse: 'assets/songs/longhall.wav',
                wet: .9
            }
        });
        this.kickFreq = freq;

        this.kickInterval = setVariableInterval(function () {
            kick.play();
        }, freq);
    },

    //update the frequency of the currently playing kick
    updateKickFrequency: function (freq) {
        this.kickInterval.interval = freq;
    },
}

var gestureClient = {
    config:{
        hands: ['right', 'left'],
        pressedThreshold: 15,

        //Leap Motions Constants
        heightMin: 20,
        heightMax: 600
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

    //right hand functions
    isRightIndexFingerPressed: function () {
        if(this.hands.right != undefined){
            if (this.hands.right.palmPosition[1] - this.hands.right.fingers[1].tipPosition[1] > this.config.pressedThreshold)
                return true;
        }
        return false;
    },
    isRightMiddleFingerPressed: function () {
        var pressedThreshold = 10;
        if(this.hands.right != undefined){
            if (this.hands.right.palmPosition[1] - this.hands.right.fingers[2].tipPosition[1] > pressedThreshold)
                return true;
        }
        return false;
    },


    //left hand functions
    isLeftIndexFingerPressed: function () {
        if (this.hands.left != undefined) {
            if (this.hands.left.palmPosition[1] - this.hands.left.fingers[1].tipPosition[1] > this.config.pressedThreshold)
                return true;
        }
        return false;
    },
}

var UI = {

    config: {
        bars : {bass: "bass", piano : "piano", kick: "kick", fluit: "fluit"},
        barClass : "bar",

    },

    //this function will set the height of the given bar
    setBarHeight: function (bar,h) {
        $("#" + bar + " ." + UI.config.barClass).height(h + "px");
    },

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
