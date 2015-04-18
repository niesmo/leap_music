
jade = (function (exports) {
    /*!
     * Jade - runtime
     * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
     * MIT Licensed
     */

    /**
     * Lame Array.isArray() polyfill for now.
     */

    if (!Array.isArray) {
        Array.isArray = function (arr) {
            return '[object Array]' == Object.prototype.toString.call(arr);
        };
    }

    /**
     * Lame Object.keys() polyfill for now.
     */

    if (!Object.keys) {
        Object.keys = function (obj) {
            var arr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            return arr;
        }
    }

    /**
     * Merge two attribute objects giving precedence
     * to values in object `b`. Classes are special-cased
     * allowing for arrays and merging/joining appropriately
     * resulting in a string.
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object} a
     * @api private
     */

    exports.merge = function merge(a, b) {
        var ac = a['class'];
        var bc = b['class'];

        if (ac || bc) {
            ac = ac || [];
            bc = bc || [];
            if (!Array.isArray(ac)) ac = [ac];
            if (!Array.isArray(bc)) bc = [bc];
            ac = ac.filter(nulls);
            bc = bc.filter(nulls);
            a['class'] = ac.concat(bc).join(' ');
        }

        for (var key in b) {
            if (key != 'class') {
                a[key] = b[key];
            }
        }

        return a;
    };

    /**
     * Filter null `val`s.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function nulls(val) {
        return val != null;
    }

    /**
     * Render the given attributes object.
     *
     * @param {Object} obj
     * @param {Object} escaped
     * @return {String}
     * @api private
     */

    exports.attrs = function attrs(obj, escaped) {
        var buf = []
          , terse = obj.terse;

        delete obj.terse;
        var keys = Object.keys(obj)
          , len = keys.length;

        if (len) {
            buf.push('');
            for (var i = 0; i < len; ++i) {
                var key = keys[i]
                  , val = obj[key];

                if ('boolean' == typeof val || null == val) {
                    if (val) {
                        terse
                          ? buf.push(key)
                          : buf.push(key + '="' + key + '"');
                    }
                } else if (0 == key.indexOf('data') && 'string' != typeof val) {
                    buf.push(key + "='" + JSON.stringify(val) + "'");
                } else if ('class' == key && Array.isArray(val)) {
                    buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
                } else if (escaped && escaped[key]) {
                    buf.push(key + '="' + exports.escape(val) + '"');
                } else {
                    buf.push(key + '="' + val + '"');
                }
            }
        }

        return buf.join(' ');
    };

    /**
     * Escape the given string of `html`.
     *
     * @param {String} html
     * @return {String}
     * @api private
     */

    exports.escape = function escape(html) {
        return String(html)
          .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
    };

    /**
     * Re-throw the given `err` in context to the
     * the jade in `filename` at the given `lineno`.
     *
     * @param {Error} err
     * @param {String} filename
     * @param {String} lineno
     * @api private
     */

    exports.rethrow = function rethrow(err, filename, lineno) {
        if (!filename) throw err;

        var context = 3
          , str = require('fs').readFileSync(filename, 'utf8')
          , lines = str.split('\n')
          , start = Math.max(lineno - context, 0)
          , end = Math.min(lines.length, lineno + context);

        // Error context
        var context = lines.slice(start, end).map(function (line, i) {
            var curr = i + start + 1;
            return (curr == lineno ? '  > ' : '    ')
              + curr
              + '| '
              + line;
        }).join('\n');

        // Alter exception message
        err.path = filename;
        err.message = (filename || 'Jade') + ':' + lineno
          + '\n' + context + '\n\n' + err.message;
        throw err;
    };

    return exports;

})({});

jade.templates = {};
jade.render = function (node, template, data) {
    var tmp = jade.templates[template](data);
    node.innerHTML = tmp;
};

jade.templates["bass-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Bass</h2><div class="space"></div><p class="p-text">The bass in this song is synthesized with a sine wave. Specify a wave shape as the source, and set the envelope to control the loudness of the sound as it plays. If you\'ve used other audio synthesis software, <a href="http://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope">these parameters</a> should look familiar to you. To play specific notes, pass in the name of a note as a pitch parameter to the <code>play()</code> method. </p><div class="space"></div><pre><code>var bass = new Wad({\n    source : \'sine\',\n    env : {\n        attack : .02,\n        decay : .1,\n        sustain : .9,\n        hold : .4,\n        release : .1\n    }\n})\n \nbass.play({ pitch : \'C2\' })</code></pre></div></div>');
    }
    return buf.join("");
}
jade.templates["flute-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Flute</h2><div class="space"></div><p class="p-text">The flute-like synth in this song is synthesized using a square wave. It uses vibrato to make that eerie, wavering sound. It is panned to either side by passing a panning parameter to the <code>play()</code> method.</p><div class="space"></div><pre><code>var flute = new Wad({\n    source : \'square\', \n    env : {\n        attack : .015, \n        decay : .002, \n        sustain : .5, \n        hold : 2.5, \n        release : .3\n    }, \n    filter : {\n        type : \'lowpass\', \n        frequency : 600, \n        q : 7, \n        env : { \n            attack : .7, \n            frequency : 1600\n        }\n    }, \n    vibrato : {\n        attack : 8, \n        speed : 8, \n        magnitude : 100 \n    }\n})\n \nflute.play({ panning :  .1, pitch : \'F5\'  })\nflute.play({ panning : -.1, pitch : \'Ab5\' })</code></pre></div></div>');
    }
    return buf.join("");
}
jade.templates["hihats-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Hihat Cymbals</h2><div class="space"></div><p class="p-text">The hi-hats in this song are synthesized using similar parameters as the snare drum. Rather than specifying the values manually, you can simply use a preset.</p><div class="space"></div><pre><code>var hatClosed = new Wad( Wad.presets.hiHatClosed )\n \nhatClosed.play()</code></pre></div></div>');
    }
    return buf.join("");
}
jade.templates["kick-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Kick Drum</h2><div class="space"></div><p class="p-text">The kick drum in this song is just an audio file. Use a URL to an audio file as the source, and then call <code>play()</code> with no arguments. It doesn\'t get much simpler than this. </p><div class="space"></div><pre><code>var kick = new Wad({ source : \'http://www.myServer.com/kick.wav\' })\n \nkick.play()</code></pre></div></div>');
    }
    return buf.join("");
}
jade.templates["piano-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Piano</h2><div class="space"></div><p class="p-text">The piano-like synth in this song is synthesized using a square wave, similarly to how the flute was synthesized. The real fun happens in the parameters to the <code>play()</code> method. Several paremeters are changed for each individual note to make a more dynamic, expressive melody. </p><div class="space"></div><pre><code>var piano = new Wad({\n    source : \'square\', \n    env : {\n        attack : .01, \n        decay : .005, \n        sustain : .2, \n        hold : .015, \n        release : .3\n    }, \n    filter : {\n        type : \'lowpass\', \n        frequency : 1200, \n        q : 8.5, \n        env : {\n            attack : .2, \n            frequency : 600\n        }\n    }\n})\n \npiano.play({ pitch : \'C5\' })\npiano.play({ pitch : \'Eb5\', filter : { q : 15 } })\npiano.play({ pitch : \'F5\', env : { release : .2 } })</code></pre></div></div>');
    }
    return buf.join("");
}
jade.templates["snare-template"] = function (locals, attrs, escape, rethrow, merge) {
    attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
    var buf = [];
    with (locals || {}) {
        var interp;
        buf.push('<div class="row"><div class="col-sm-1"></div><div class="col-sm-10"><h2 class="text-center">Snare Drum</h2><div class="space"></div><p class="p-text">The snare drum in this song is synthesized using filtered noise. In this example, a band-pass filter is removing the noise above and below 300 hertz.  </p><div class="space"></div><pre><code>var snare = new Wad ({\n   source : \'noise\', \n    env : {\n        attack : .001, \n        decay : .01, \n        sustain : .2, \n        hold : .03, \n        release : .02\n    }, \n    filter : {\n        type : \'bandpass\', \n        frequency : 300, \n        q : .180\n    }\n})\n \nsnare.play()</code></pre></div></div>');
    }
    return buf.join("");
}