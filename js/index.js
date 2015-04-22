$(document).ready(function () {

    //setting up the events
    app.setup();
   
    Leap.loop(function (frame) {


        gestureClient.update(frame);

        // if (gestureClient.isLeftIndexFingerPressed()) {
        //     app.leftIndexPressed();        
        // }

        if(gestureClient.gestures.isClap()){
            soundClient.globalSounds.clap.play();
        }

        // if(configurationClient.canBeActivated()){
        //     configurationClient.activate();

        //     //set the degree of the hand and the config item
        //     configurationClient.setDegree(gestureClient.hands.left.direction[1]);

        //     // set the depth of the hand for the user to be able to change the configuration
        //     configurationClient.setDepth(gestureClient.hands.left.palmPosition[2]);

        // }
        // else{
        //     configurationClient.deactivate();
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
    },

    //sets up all the necessary events for the app
    setup:function(){
        //setup of other clients
        soundClient.setup();

        // $("#kick-frequency").on("input change",configurationClient.kickClient.eventHanders.frequencyUpdated);
        $("#kick-reverb").on("input change", configurationClient.kickClient.eventHanders.reverbUpdated);

    }
}

var configurationClient = {
    config : {
        minDepthForSelect : 30,
        leftHandDirectionRange:{
            min:-0.8,
            max: 0.9
        },
    },

    currentSound : undefined,
    is_active: false,
    selected: -1,
    selected_next: -1,
    selected_item_is_lock: false,

    globalSoundsConfiguration:{
        soundDuration: 30000,
        kick:{
            source: 'assets/sounds/kick.mp3',
            reverb:{
                impulse: 'assets/sounds/longhall.wav',
                wet: 0.01,
            }
        },
        kickFrequency: 520,

        bass:{
            source: 'sine',
            volume: 1.5,
            globalReverb: true,
            env: {
                attack: 0.2,
                decay: .1,
                sustain: .9,
                hold: .4,
                release: .1
            },
            pitch : 'C2',
        },
        bassFrequency: 520,

        piano:{
            source : 'square', 
            env : {
                attack : .01, 
                decay : .005, 
                sustain : .2, 
                hold : .015, 
                release : .3
            }, 
            filter : {
                type : 'lowpass', 
                frequency : 1200, 
                q : 8.5, 
                env : {
                    attack : .2, 
                    frequency : 600
                }
            }
        },
        pianoFrequency: 500,

        flute:{
            source : 'square', 
            env : {
                attack : .015, 
                decay : .002, 
                sustain : .5, 
                hold : 0.5, 
                release : .3
            }, 
            filter : {
                type : 'lowpass', 
                frequency : 600, 
                q : 7, 
                env : { 
                    attack : .7, 
                    frequency : 1600
                }
            }, 
            vibrato : {
                attack : 1, 
                speed : 1, 
                magnitude : 5 
            }
        },
        flutePitch:"D4",
        fluteFrequency: 500,

        clap:{
            source : "assets/sounds/clap.wav",
            reverb: {
                impulse: "assets/sounds/longhall.wav",
                wet: 0.01,
            }
        },
        clapFrequency : 916.6666,

        // TODO, do this for all the sounds
    },


    canBeActivated: function(){

        if (gestureClient.hands.left === undefined) return false;
        if (this.currentSound == undefined) return false;

        return true;
    },

    activate: function(){
        if(!this.is_active){
            this.is_active = true;
            this.UI.activate();
        }
    },

    deactivate: function(){
        if(this.is_active){
            this.is_active = false;
            this.UI.deactivate();
        }
    },

    setDegree:function(direction){
        if(this.selected_item_is_lock) return;

        //getting the number of the inputs in the current config panel
        var inputCount = $("#"+this.currentSound.type + " input").length;
        

        var inputIndex = changeRange(direction, 0, inputCount, 1,-1);
        this.selected_next = Math.floor(inputIndex);

        //selected the selected item in the UI
        this.setSelectedItem(this.selected_next);
    },

    setDepth : function(depth){
        if(depth < this.config.minDepthForSelect){
            if(this.canChangeConfiguration()){
                //adding the lock icon to the locked item
                this.UI.setLockedItem();

                //locking the item that is being changed
                this.selected_item_is_lock = true;

                //actually setting the config
                this.setConfig();
            }
        }
        else{
            this.selected_item_is_lock = false;
            this.UI.unlockItem();
        }
    },

    setConfig: function(){
        //reroute the controll to the appropriate client
        switch (this.currentSound.type){
            case "kick":
                this.kickClient.setConfig();
                break;

            case "bass":
                this.bassClient.setConfig();
                break;
            
            case "piano":
                this.pianoClient.setConfig();
                break;
            
            case "flute":
                this.fluteClient.setConfig();
                break;
            
            case "clap":
                this.clapClient.setConfig();
                break;

            default:
                alert("Something went wrong!");
                break;
        }
    },

    //checks the angle of the left hand
    canChangeConfiguration: function(){
        return true;
    },

    setSelectedItem: function(index){
        if(this.selected == index) return;
        this.selected = index;
        this.UI.setSelectedItem(index);
    },

    setActiveSound: function(cs){
        this.currentSound = cs;

        //changing the config panel
        this.UI.setConfigPanel(cs.type);
    },



    UI:{
        setConfigPanel: function(type){
            $(".config-wrapper > div").addClass("hidden");
            $("#"+type).removeClass("hidden");
        },

        activate: function(){
            $(".config-wrapper").addClass("active");
        },

        deactivate: function(){
            $(".config-wrapper").removeClass("active");
            $(".config-wrapper > div:not(.hidden) label").removeClass("red-active");
            $(".config-wrapper > div:not(.hidden) label img").remove();
        },

        setSelectedItem: function(index){

            //removing the previously active element
            $("#"+ configurationClient.currentSound.type + " label").removeClass("red-active");
            $("#"+ configurationClient.currentSound.type + " label img").remove();

            //applying the new styling
            var label = $($("#"+ configurationClient.currentSound.type + " label")[index]);
            if(label.class != "red-active"){
                label.addClass("red-active");
                label.append("<img src='img/hand.png' alt='hand' />");
            }   
        },

        setLockedItem: function(){
            if(configurationClient.selected_item_is_lock) return;

            var index = configurationClient.selected;
            var label = $($("#"+ configurationClient.currentSound.type + " label")[index]);
            label.append("<img src='img/lock.png' alt='locked' class='lock' />");
        },

        unlockItem: function(){
            $(".config-wrapper > div > label img.lock").remove();
        },
    },

    kickClient: {
        config: {
            attributes: {/*frequency:"frequency",*/ reverb:"reverb"},
            attributes_order: [/*"frequency",*/"reverb"],
            ranges: {
                /*frequency:{
                    min:20,
                    max:5000
                },*/
                reverb:{
                    min:0.01,
                    max:1,
                }
            },
        },

        setConfig: function(){
            // find the min and max of the selected item
            var range = this.config.ranges[this.config.attributes_order[configurationClient.selected]];
            // console.log(range);
            
            //change the range of the hand diretion to a number within the range
            var direction = gestureClient.hands.left.direction[0];
            var val = changeRange(direction, range.min, range.max, configurationClient.config.leftHandDirectionRange.min, configurationClient.config.leftHandDirectionRange.max);

            if(val < range.min) val = range.min;
            if(val > range.max) val = range.max;

            // updating the sound configuration
            this.upadateSoundConfig(val);

            // update the UI and the slider
            this.UI.setConfig(val);
        },

        upadateSoundConfig: function(val){
            //update not ever frame, but every 10 frame
            if (gestureClient.data.id % 10 != 0) return;

            //if we are updating the frequency
            if(this.config.attributes_order[configurationClient.selected] == "frequency"){
                configurationClient.currentSound.interval.interval = val;
            }
            //setting the reverb
            else{
                //create a new sound and replace it with the sound in the currecnt sound
                var newKick = new Wad({
                    source: 'assets/sounds/kick.mp3',
                    reverb: {
                        impulse: 'assets/sounds/longhall.wav',
                        wet: val
                    }
                });

                configurationClient.currentSound.sound = newKick;
            }
            // console.log(gestureClient.data.id);
            // console.log(configurationClient.currentSound.args);
        },

        eventHanders:{
            frequencyUpdated: function(e){
                configurationClient.kickClient.UI.updateFrequency(e.target.value);
            },

            reverbUpdated: function(e){
                configurationClient.kickClient.UI.updateReverb(e.target.value);  
            }


        },

        UI:{
            setConfig:function(val){
                $("#kick-" + configurationClient.kickClient.config.attributes_order[configurationClient.selected]).val(val);
            },

            updateFrequency: function(f){
                $("#kick-frquency-value").text(f);
            },

            updateReverb: function(d){
                $("#kick-reverb-value").text(d);                  
            },
        },
    },

    bassClient: {
        setConfig: function(){

        }
    },

    pianoClient: {
        setConfig: function(){

        }
    },

    fluteClient: {
        setConfig: function(){

        }
    },

    clapClient: {
        setConfig: function(){

        }
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
            source: 'assets/sounds/kick.mp3',
            reverb: {
                impulse: 'assets/sounds/longhall.wav',
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
        sounds: {kick:"kick", bass:"bass", piano:"piano", flute:"flute", clap: "clap"},
        defaultFrequency : 1000,
    },

    setup: function(){
        var clapSound = new Wad(configurationClient.globalSoundsConfiguration.clap);
        this.globalSounds.clap = clapSound;

        var kickSound = new Wad(configurationClient.globalSoundsConfiguration.kick);
        this.globalSounds.kick = kickSound;

        var bassSound = new Wad(configurationClient.globalSoundsConfiguration.bass);
        this.globalSounds.bass = bassSound;

        var pianoSound = new Wad(configurationClient.globalSoundsConfiguration.piano);
        this.globalSounds.piano = pianoSound;

        var fluteSound = new Wad(configurationClient.globalSoundsConfiguration.flute);
        this.globalSounds.flute = fluteSound;


        // TODO Do the same for all other sounds
    },

    globalSounds: {
        clap:undefined,
        kick:undefined,
        bass:undefined,
        flute:undefined,
        piano:undefined
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
            
            case this.config.sounds.flute:
                this.createFlute();
                break;

            case this.config.sounds.clap:
                this.createClap();
                break;
            
            default:
                break;
        }

        //after the song is created, add it to the history
        soundHistoryClient.UI.addNewSound(this.lastCreatedSound);

        //setting the active sound of the config
        configurationClient.setActiveSound(this.lastCreatedSound);
    },

    //Creates a kick noise
    createKick: function(){
        //defining variables
        var kickGuid = guid();

        //registerig the sound
        this._registeredSounds[kickGuid] = {
            guid: kickGuid,
            type: this.config.sounds.kick,
            sound : soundClient.globalSounds.kick,
            frequency: this.config.defaultFrequency,
            // interval: tempInterval,
            args: configurationClient.globalSoundsConfiguration.kick,
        };


        // var tempInterval;
        // //startig the interval that repeats the sound
        // tempInterval = setVariableInterval(function () {
        //     soundClient._registeredSounds[kickGuid].sound.play(soundClient._registeredSounds[kickGuid].args);
        // }, this.config.defaultFrequency);

    
        var count = (configurationClient.globalSoundsConfiguration.soundDuration / configurationClient.globalSoundsConfiguration.kickFrequency);
        
        for(var i=0;i<count;i++){

            setTimeout(function(){
                soundClient.globalSounds.kick.play();    
            },i*configurationClient.globalSoundsConfiguration.kickFrequency);

        }


        //updating the song and setting the inteval
        // this._registeredSounds[kickGuid].interval = tempInterval;

        //setting the last created sounds
        this.lastCreatedSound = this._registeredSounds[kickGuid];

        return kickGuid;
    },

    //creates a bass noise
    createBass: function(){
        var bassGuid = guid();

        //registering the song
        this._registeredSounds[bassGuid] = {
            guid: bassGuid,
            type: this.config.sounds.bass,
            sound : soundClient.globalSounds.bass,
            frequency: configurationClient.globalSoundsConfiguration.bassFrequency,
            // interval: tempInterval,
            args: configurationClient.globalSoundsConfiguration.bass
        };

        // var tempInterval;

        //starting the interval
        // tempInterval = setVariableInterval(function(){
        //     soundClient._registeredSounds[bassGuid].sound.play(soundClient._registeredSounds[bassGuid].args);
        // },this.config.defaultFrequency);

        var count = (configurationClient.globalSoundsConfiguration.soundDuration / configurationClient.globalSoundsConfiguration.bassFrequency);
        for(var i=0;i<count;i++){
            soundClient.globalSounds.bass.play({wait:(i/2)});
        }

        //updating the song and setting the inteval
        // this._registeredSounds[bassGuid].interval = tempInterval;

        //setting the last created sounds
        this.lastCreatedSound = this._registeredSounds[bassGuid];

        //returning
        return bassGuid;
    },

    //creates a piano sound
    createPiano: function(){
        var pianoGuid = guid();

        //registering the sound
        this._registeredSounds[pianoGuid] = {
            guid: pianoGuid,
            type: this.config.sounds.piano,
            sound : soundClient.globalSounds.piano,
            frequency: configurationClient.globalSoundsConfiguration.pianoFrequency,
            // interval: tempInterval,
            args:configurationClient.globalSoundsConfiguration.piano
        };

        // var tempInterval;

        //starting the time interval
        // tempInterval = setVariableInterval(function(){
        //     soundClient._registeredSounds[pianoGuid].sound.play(soundClient._registeredSounds[pianoGuid].args);
        // },this.config.defaultFrequency);

        var count = (configurationClient.globalSoundsConfiguration.soundDuration / configurationClient.globalSoundsConfiguration.pianoFrequency);
        for(var i=0;i<count;i++){
            soundClient.globalSounds.piano.play({wait:(i/2)});
        }
        

        //updating the song and setting the inteval
        // this._registeredSounds[pianoGuid].interval = tempInterval;

        //setting the last created sounds
        this.lastCreatedSound = this._registeredSounds[pianoGuid];

        //returning
        return pianoGuid;
    },

    //creats a flute sound
    createFlute: function(){
        var fluteGuid =  guid();

        //registering the sound
        this._registeredSounds[fluteGuid] = {
            guid: fluteGuid,
            type: this.config.sounds.flute,
            sound : soundClient.globalSounds.flute,
            frequency: configurationClient.globalSoundsConfiguration.fluteFrequency,
            // interval: tempInterval,
            args:configurationClient.globalSoundsConfiguration.flute,
        };

        // var tempInterval;

        //starting the time interval
        // tempInterval = setVariableInterval(function(){
        //     soundClient._registeredSounds[fluteGuid].sound.play(soundClient._registeredSounds[fluteGuid].args);
        // },this.config.defaultFrequency);

    
        var count = (configurationClient.globalSoundsConfiguration.soundDuration / configurationClient.globalSoundsConfiguration.fluteFrequency);
        for(var i=0;i<count;i++){
            soundClient.globalSounds.flute.play({
                wait:(i/2),
                pitch: configurationClient.globalSoundsConfiguration.flutePitch,
            });
        }


        //updating the song and setting the inteval
        // this._registeredSounds[fluteGuid].interval = tempInterval;

        //setting the last created sound
        this.lastCreatedSound = this._registeredSounds[fluteGuid];

        //returning the value
        return fluteGuid;
    },

    //creates a clap sound
    createClap: function(){
        //defining the sound and other variables
        var clapSound = new Wad({
            source: 'assets/sounds/clap.wav',
        });

        var clapGuid = guid();

        //registerig the sound
        this._registeredSounds[clapGuid] = {
            guid: clapGuid,
            type: this.config.sounds.clap,
            sound : clapSound,
            frequency: this.config.defaultFrequency,
            interval: tempInterval,
            args: {}
        };

        var tempInterval;
        //startig the interval that repeats the sound
        tempInterval = setVariableInterval(function () {
            soundClient._registeredSounds[clapGuid].sound.play(soundClient._registeredSounds[clapGuid].args);
        }, this.config.defaultFrequency);

        //updating the song and setting the inteval
        this._registeredSounds[clapGuid].interval = tempInterval;

        //setting the last created sounds
        this.lastCreatedSound = this._registeredSounds[clapGuid];

        return clapGuid;
    }
}

var gestureClient = {
    config:{
        hands: ['right', 'left'],
        pressedThreshold: 0,

        //Leap Motions Constants
        heightMin: 20,
        heightMax: 600
    },

    data: {},
    hands: { 'right': undefined, 'left': undefined },


    //updates the lp_data
    update: function (lp_data) {
        if(!lp_data.valid) return;
        if(lp_data.confidence < 0.5) return;
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

    // Gestures
    gestures: {
        lastClapTimestamp:new Date(),

        isClap: function(){
            if(gestureClient.hands.right != undefined && gestureClient.hands.left != undefined){
                if(gestureClient.hands.right.palmNormal[0] < 0.96 &&
                    gestureClient.hands.left.palmNormal[0]  > 0.96 &&
                    gestureClient.hands.right.palmVelocity[0] < -100 &&
                    gestureClient.hands.left.palmVelocity[0] > 100 &&
                    gestureClient.hands.right.palmPosition[0] - gestureClient.hands.left.palmPosition[0] < 35){

                    var now = new Date();

                    if(now - this.lastClapTimestamp > 100){
                        this.lastClapTimestamp = now;
                        return true;
                    }
                    return false;

                    
                    
                }
                return false;
            }
        },

        isBass: function(){

        },

        isKick: function(){

        },


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
        bars : {bass: "bass", piano : "piano", kick: "kick", flute: "flute"},
        barClass : "bar",
    },

    //this function will set the height of the given bar
    setBarHeight: function (bar,h) {
        $("#" + bar + " ." + UI.config.barClass).height(h + "px");
    },
}

var soundHistoryClient = {
    UI:{
        //Adds a list item to the history 
        addNewSound: function(soundObj){
            var newItem = $("<li guid='"+soundObj.guid+"' />").text(soundObj.type);

            $("#sound-history ol").append(newItem);
        }
    }
}

var makeNoiseMenuClient = {
    //config
    config : {
        //the required height and position for the menu to get activated
        rightHandHeightForMenu : 150,
        rightHandXForMenu:50,
        rightHandXAngleMenu:-0.3,
        
        //the required depth for a click
        menuClickDepth: -30,

        //time for reseting the make noise menu
        selectedTimeout: 1000,

        //menu items
        menuItems: ["kick", "bass", "piano", "flute", "clap"],
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

        //checking if they waited the timeout
        if(this.lastSelected && now - this.lastSelected < this.config.selectedTimeout) return false;

        //checking if they hand exist
        if(gestureClient.hands.right === undefined || !this.restarted) return false;

        //checking for valid position range
        if(gestureClient.hands.right.palmPosition[1] > this.config.rightHandHeightForMenu &&
            gestureClient.hands.right.palmPosition[0] > this.config.rightHandXForMenu &&
            gestureClient.hands.right.direction[0] < this.config.rightHandXAngleMenu)
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
        var itemCount = this.config.menuItems.length;

        var newRange = changeRange(direction, 0, itemCount, 1,-1);
        this.selected_next = Math.floor(newRange);

        // if(this.lp_direction > 0 ) this.selected_next = 0;
        // else if(this.lp_direction < 0 && this.lp_direction > -0.3 ) this.selected_next = 1;
        // else if(this.lp_direction < -0.3 && this.lp_direction > -0.5) this.selected_next = 2;
        // else this.selected_next = 3;

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
        var type = this.config.menuItems[index];

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