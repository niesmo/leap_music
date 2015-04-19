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

    // musicClient.createKick(1000);

    Leap.loop(function (frame) {
        gestureClient.update(frame);

        // if (gestureClient.isLeftIndexFingerPressed()) {
        //     app.leftIndexPressed();        
        // }


        //activating the menu for the make noise
        if(makeNoiseMenuClient.canBeActivated()){
            //acticating the create noise panel
            makeNoiseMenuClient.activate();

            //chaning the menu option based on the right hand degree
            makeNoiseMenuClient.setDegree(gestureClient.hands.right.direction[1]);

            //checking for a click on the noise menu
            makeNoiseMenuClient.setDepth(gestureClient.hands.right.palmPosition[2]);
        }
        else{
            makeNoiseMenuClient.deactivate();
        }

    });
});

/*
In this client goes all the actual logic behind different events
*/
var app = {
    leftIndexPressed:function () {
        var lh_height = Math.abs(gestureClient.hands.left.palmPosition[1]);

        

        var f = changeRange(
            lh_height, 
            musicClient.config.kickFrequencyMin, musicClient.config.kickFrequencyMax,
            gestureClient.config.heightMin,gestureClient.config.heightMax
            );

        //updating the kick frequnecy based on the hand height
        musicClient.updateKickFrequency(f);

        //setting the height of the bar in the UI
        UI.setBarHeight(UI.config.bars.kick, lh_height);


        //$("#kick p").text(f);
    }
}

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

var soundClient = {
    config: {
        sounds: {kick:"kick", bass:"bass", piano:"piano", fluit:"fluit"},
        defaultFrequency : 1000,
    },

    //local variables
    _registeredSounds : new Array(),
    lastCreatedSound: {},


    //create new sound
    createNewSound: function(soundType){

        switch(soundType){
            case this.config.sounds.kick:
                this.createKick();
                break;
            case this.config.sounds.bass:
                this.createBass();
                break;
            case this.config.sounds.piano:
                this.createPiano();
                break;
            case this.config.sounds.fluit:
                this.createFluit();
                break;
            default:
                break;
        }
    },

    //Creates a kick noise
    createKick: function(){
        //defining the sound and other variables
        var kickSound = new Wad({source: 'assets/songs/kick.mp3'});
        var kickGuid = guid();
        var tempInterval;


        //startig the interval that repeats the sound
        tempInterval = setVariableInterval(function () {
            kickSound.play();
        }, this.config.defaultFrequency);


        //registerig the sound
        this._registeredSounds[kickGuid] = {
            sound : kickSound,
            frequency: this.config.defaultFrequency,
            interval: tempInterval,
        };

        //setting the last created sounds
        this.lastCreatedSound = this._registeredSounds[kickGuid];

        return kickGuid;
    },

    //creates a bass noise
    createBass: function(){

    },

    //creates a piano sound
    createPiano: function(){

    },

    //creats a fluit sound
    createFluit: function(){

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


    //updates the lp_data
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
    //---------------------------------------

    //returns true is right hand's index finger is pressed
    isRightIndexFingerPressed: function () {
        if(this.hands.right != undefined){
            if (this.hands.right.palmPosition[1] - this.hands.right.fingers[1].tipPosition[1] > this.config.pressedThreshold)
                return true;
        }
        return false;
    },

    //returns true is right hand's middle finger is pressed
    isRightMiddleFingerPressed: function () {
        var pressedThreshold = 10;
        if(this.hands.right != undefined){
            if (this.hands.right.palmPosition[1] - this.hands.right.fingers[2].tipPosition[1] > pressedThreshold)
                return true;
        }
        return false;
    },


    //left hand functions
    //---------------------------------------

    //returns true is left hand's index finger is pressed
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


var makeNoiseMenuClient = {
    //config
    config : {
        //the required height for the menu to get activated
        rightHandHeightForMenu : 150,
        
        //the required depth for a click
        menuClickDepth: -30,

        //time for reseting the make noise menu
        selectedTimeout: 15000,

        //menu items
        menuItem: ["kick", "bass", "piano", "fluit"],
    },


    //class variables
    selected : 0,
    selected_next : 0,
    is_active: false,
    restarted: true,

    //leap motion variables
    lp_direction : 0,
    lp_depth: 0,


    //checks the height of the right hands to see if
    //it is high enough for the menu to be activated
    canBeActivated: function(){
        var now = new Date();

        if(this.lastSelected && now - this.lastSelected < this.config.selectedTimeout) return false;


        if(gestureClient.hands.right === undefined || !this.restarted) return false;
        if(gestureClient.hands.right.palmPosition[1] > this.config.rightHandHeightForMenu)
            return true;
        return false;
    },

    //activates the panel
    activate: function (){
        if(!this.is_active)
        {
            this.is_active = true;
            this.UI.activatePanel();
        }
    },

    //deactivates the panel
    deactivate: function (){
        if(this.is_active)
        {
            this.restarted = true;
            this.is_active = false;
            this.UI.deactivatePanel();
        }
    },


    //changed the selected menu to menu[index]
    setSelectedItem:function (index) {
        this.selected = index;
        this.UI.changeSelectedItem(index);
    },

    //set the lp_direction to what we receive from the Leap
    //and figures out what the next selected index should be
    //and call the setSelectedItem with the next index
    setDegree: function (direction){
        this.lp_direction = direction;

        if(this.lp_direction > 0 ) this.selected_next = 0;
        else if(this.lp_direction < 0 && this.lp_direction > -0.3 ) this.selected_next = 1;
        else if(this.lp_direction < -0.3 && this.lp_direction > -0.5) this.selected_next = 2;
        else this.selected_next = 3;

        if(this.selected_next != this.selected)
            this.UI.removeProgressBar();

        this.setSelectedItem(this.selected_next);
    },

    //sets the depth of the right hands
    //this is used to see if they have clicked 
    //the button yet or not
    setDepth: function(depth){
        this.lp_depth = depth;

        var percent = changeRange(this.lp_depth, 100,0,-50,300);
        this.UI.setProgressBar(percent);

        if(percent >= 100){
            this.UI.ripple();

            this.restarted = false;
            this.lastSelected = new Date();

            this.soundCreated();
        }
    },

    //this function is the menu function to communicate to the sound client
    soundCreated : function(){
        var index = $("#create ul li.selected").index();
        var type = this.config.menuItem[index];

        soundClient.createNewSound(soundClient.config.sounds[type]);
    },

    /*
    All the UI functionality of the make noise panel goes here
    */
    UI:{
        /*
        changes the selected class from the current one to the li[index]
        */
        changeSelectedItem:function (index) {
            $("#create ul li.selected").removeClass("selected");
            $("#create ul li:nth-child("+(index+1)+")").addClass("selected");
        },

        /*
        Activates the panel by adding the class `selected` to the li[0]
        */
        activatePanel: function (){
            $("#create ul li:first-child").addClass("selected");
        },

        /*
        Deactivates the panel by removing the class `selected` to the li[0]
        */
        deactivatePanel: function (){
            this.removeProgressBar();
            $("#create ul li").removeClass("selected"); 
        },

        /*
        Creating a ripple effect on click to the selected menu item
        */
        ripple: function(){
            var el = $("#create ul li.selected");
            var index = el.index();

            var center = {
                x:parseInt( ( el.offset().left + el.width() ) / 2),
                y:parseInt( ( el.offset().top  + el.height()) / 2)
            };

            //remving the previously existing svg
            el.find("svg").remove();

            //adding the new svg and circle
            el.append('<svg><circle cx="'+center.x+'" cy="'+(center.y-157- (31*index))+'" r="'+0+'"></circle></svg>');
            
            //creating the svg
            var svg = el.find("svg");
            svg.css({
                "top": el.position().top+"px",
                "left": 0,
                "width": el.width()+parseInt(el.css("padding-left"))+parseInt(el.css("padding-right"))+"px",
                "height": el.height()+parseInt(el.css("padding-top"))+parseInt(el.css("padding-bottom"))+"px"
            });

            var c = el.find("circle");
            c.animate(
                {
                    "r" : el.outerWidth()
                },
                {
                    easing: "easeOutQuad",
                    duration: 400,
                    step : function(val){
                        c.attr("r", val);
                    },
                    complete: function(){
                        c.fadeOut("fast",function(){
                            c.remove();
                        });
                    }
                }
            );
        },

        /*
        Creates and adds a progress bar to the selected menu
        */
        setProgressBar: function(percent){
            if(percent > 100) percent = 100;
            
            //if the progress bar is already created
            if ($("#create ul li.selected div").length ){
                $("#create ul li.selected div span").css("width", percent+"%");
            }

            //if its the first time and we are creating the progress bar
            else
                $("#create ul li.selected").append("<div class='meter'><span style='width:"+percent+"%'></span></div>");
        },

        /*
        Removes the progress bar from the selected li
        */
        removeProgressBar: function(){
            $("#create ul li.selected div").remove();
        }
    }
}


//this function changes the range of a number
/*
@n_min => new min
@n_max => new max
@o_min => old min
@o_max => old max
@val => the value that you are trying to change the range of
*/
function changeRange(val, n_min, n_max, o_min, o_max){
    //changing the range of the number
    //NewValue = (((OldValue - OldMin) * 
    //  (NewMax - NewMin)) / 
    //  (OldMax - OldMin)) + 
    //  NewMin

    return (((val - o_min)*(n_max - n_min))/(o_max - o_min))+ n_min;
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