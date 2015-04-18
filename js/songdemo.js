var kick = new Wad({ source: 'assets/songs/kick.mp3' })
kick.globalReverb = true
var bpm = 68
var beat = 60 / bpm

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
})

var piano = new Wad({
    source: 'square',
    volume: 1.4,
    env: {
        attack: .01,
        decay: .005,
        sustain: .2,
        hold: .015,
        release: .3
    },
    filter: {
        type: 'lowpass',
        frequency: 1200,
        q: 8.5,
        env: {
            attack: .2,
            frequency: 600
        }
    }
})

piano.globalReverb = true

var hat = new Wad(Wad.presets.hiHatClosed)
hat.globalReverb = true
var snare = new Wad(Wad.presets.snare)
snare.globalReverb = true
var hatOpen = new Wad(Wad.presets.hiHatOpen)
hatOpen.globalReverb = true
var ghost = new Wad(Wad.presets.ghost)
Wad.setGlobalReverb({ impulse: 'assets/songs/longhall.wav', wet: .5 })
snare.setVolume(9)


var oneLoop = function () {
    if ($('#hihats').hasClass('on')) {
        hat.play({ wait: beat * 0.5 })
        hat.play({ wait: beat * 1.5 })
        hat.play({ wait: beat * 2.5 })
        hat.play({ wait: beat * 3.0 })
        hatOpen.play({ wait: beat * 3.5, panning: .1 })
        hat.play({ wait: beat * 4.5 })
        hat.play({ wait: beat * 5.5 })
        hat.play({ wait: beat * 6.5 })
        hat.play({ wait: beat * 7.0 })
        hatOpen.play({ wait: beat * 7.5, panning: -.1 })


        hat.play({ wait: beat * (0.5 + 8) })
        hat.play({ wait: beat * (1.5 + 8) })
        hat.play({ wait: beat * (2.5 + 8) })
        hat.play({ wait: beat * (3.0 + 8) })
        hatOpen.play({ wait: beat * (3.5 + 8), panning: .1 })
        hat.play({ wait: beat * (4.5 + 8) })
        hat.play({ wait: beat * (5.5 + 8) })
        hat.play({ wait: beat * (6.5 + 8) })
        hat.play({ wait: beat * (7.0 + 8) })

    }

    if ($('#snare').hasClass('on')) {

        snare.play({ wait: beat * 1 })
        snare.play({ wait: beat * 2.25 })
        snare.play({ wait: beat * 3 })
        snare.play({ wait: beat * 5 })
        snare.play({ wait: beat * 6.25 })
        snare.play({ wait: beat * 7 })

        snare.play({ wait: beat * (1 + 8) })
        snare.play({ wait: beat * (2.25 + 8) })
        snare.play({ wait: beat * (3 + 8) })
        snare.play({ wait: beat * (5 + 8) })
        snare.play({ wait: beat * (6.25 + 8) })
        snare.play({ wait: beat * (7 + 8) })


    }

    if ($('#kick').hasClass('on')) {
        kick.play({ wait: beat * 0 })
        kick.play({ wait: beat * 2 })
        kick.play({ wait: beat * 4 })
        // kick.play({wait : beat*4.5})
        kick.play({ wait: beat * 6 })
        // kick.play({wait : beat*7})
        // kick.play({wait : beat*7.5})
        kick.play({ wait: beat * (0 + 8) })
        kick.play({ wait: beat * (2 + 8) })
        kick.play({ wait: beat * (4 + 8) })
        // kick.play({wait : beat*(4.5+8)})
        kick.play({ wait: beat * (6 + 8) })
        // kick.play({wait : beat*(7+8)})
        kick.play({ wait: beat * (7.5 + 8) })

    }




    if ($('#bass').hasClass('on')) {
        bass.play({ pitch: 'C2', wait: beat * 0 })
        bass.play({ pitch: 'C3', wait: beat * .5 })
        bass.play({ pitch: 'C2', wait: beat * 1 })
        bass.play({ pitch: 'C3', wait: beat * 1.5 })
        bass.play({ pitch: 'C2', wait: beat * 2 })
        bass.play({ pitch: 'C3', wait: beat * 2.5 })
        bass.play({ pitch: 'C2', wait: beat * 3 })
        bass.play({ pitch: 'C3', wait: beat * 3.5 })
        bass.play({ pitch: 'F2', wait: beat * 4 })
        bass.play({ pitch: 'F3', wait: beat * 4.5 })
        bass.play({ pitch: 'F2', wait: beat * 5 })
        bass.play({ pitch: 'F3', wait: beat * 5.5 })
        bass.play({ pitch: 'F2', wait: beat * 6 })
        bass.play({ pitch: 'F3', wait: beat * 6.5 })
        bass.play({ pitch: 'F2', wait: beat * 7 })
        bass.play({ pitch: 'F3', wait: beat * 7.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 8 })
        bass.play({ pitch: 'Ab3', wait: beat * 8.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 9 })
        bass.play({ pitch: 'Ab3', wait: beat * 9.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 10 })
        bass.play({ pitch: 'Ab3', wait: beat * 10.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 11 })
        bass.play({ pitch: 'Ab3', wait: beat * 11.5 })
        bass.play({ pitch: 'G2', wait: beat * 12 })
        bass.play({ pitch: 'G3', wait: beat * 12.5 })
        bass.play({ pitch: 'G2', wait: beat * 13 })
        bass.play({ pitch: 'G3', wait: beat * 13.5 })
        bass.play({ pitch: 'G2', wait: beat * 14 })
        bass.play({ pitch: 'G3', wait: beat * 14.5 })
        bass.play({ pitch: 'G2', wait: beat * 15 })
        bass.play({ pitch: 'Bb2', wait: beat * 15.5 })


    }

    if ($('#piano').hasClass('on')) {
        piano.play({ pitch: 'C5', wait: beat * (0.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (1), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (1.5) })
        piano.play({ pitch: 'F5', wait: beat * (1.75), env: { release: .2 } })

        piano.play({ pitch: 'C5', wait: beat * (4.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (5), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (5.5) })
        piano.play({ pitch: 'F5', wait: beat * (5.75), env: { release: .2 } })

        piano.play({ pitch: 'C5', wait: beat * (8.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (9), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (9.5) })
        piano.play({ pitch: 'F5', wait: beat * (9.75), env: { release: .2 } })

        piano.play({ pitch: 'C5', wait: beat * (12.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (13), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (14.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (15) })
        piano.play({ pitch: 'G5', wait: beat * (15.5), filter: { q: 15 } })

    }


    if ($('#flute').hasClass('on')) {
        ghost.play({ pitch: 'G5', wait: beat * (0), panning: -.1 })
        ghost.play({ pitch: 'Gb5', wait: beat * (3.75), panning: -.1, env: { hold: .1 } })
        ghost.play({ pitch: 'F5', wait: beat * (4), panning: .1 })
        ghost.play({ pitch: 'Ab5', wait: beat * (8), panning: -.1 })
        ghost.play({ pitch: 'G5', wait: beat * (11), panning: .1 })
        ghost.play({ pitch: 'Bb5', wait: beat * (12), panning: .1 })
        // ghost.play( {pitch : 'Eb5', wait : beat * (13), env : {hold : .1}})

    }

}

var twoLoop = function () {
    if ($('#hihats').hasClass('on')) {
        hat.play({ wait: beat * 0.5 })
        hat.play({ wait: beat * 1.5 })
        hat.play({ wait: beat * 2.5 })
        hat.play({ wait: beat * 3.0 })
        hatOpen.play({ wait: beat * 3.5, panning: .1 })
        hat.play({ wait: beat * 4.5 })
        hat.play({ wait: beat * 5.5 })
        hat.play({ wait: beat * 6.5 })
        hat.play({ wait: beat * 7.0 })
        hatOpen.play({ wait: beat * 7.5, panning: -.1 })


        hat.play({ wait: beat * (0.5 + 8) })
        hat.play({ wait: beat * (1.5 + 8) })
        hat.play({ wait: beat * (2.5 + 8) })
        hat.play({ wait: beat * (3.0 + 8) })
        hatOpen.play({ wait: beat * (3.5 + 8), panning: .1 })
        hat.play({ wait: beat * (4.5 + 8) })
        hat.play({ wait: beat * (5.5 + 8) })
        hat.play({ wait: beat * (6.5 + 8) })
        hat.play({ wait: beat * (7.0 + 8) })

    }

    if ($('#snare').hasClass('on')) {

        snare.play({ wait: beat * 1 })
        snare.play({ wait: beat * 2.25 })
        snare.play({ wait: beat * 3 })
        snare.play({ wait: beat * 5 })
        snare.play({ wait: beat * 6.25 })
        snare.play({ wait: beat * 7 })

        snare.play({ wait: beat * (1 + 8) })
        snare.play({ wait: beat * (2.25 + 8) })
        snare.play({ wait: beat * (3 + 8) })
        snare.play({ wait: beat * (5 + 8) })
        snare.play({ wait: beat * (6.25 + 8) })
        snare.play({ wait: beat * (7 + 8) })


    }

    if ($('#kick').hasClass('on')) {
        kick.play({ wait: beat * 0 })
        kick.play({ wait: beat * 2 })
        kick.play({ wait: beat * 4 })
        // kick.play({wait : beat*4.5})
        kick.play({ wait: beat * 6 })
        // kick.play({wait : beat*7})
        // kick.play({wait : beat*7.5})
        kick.play({ wait: beat * (0 + 8) })
        kick.play({ wait: beat * (2 + 8) })
        kick.play({ wait: beat * (4 + 8) })
        // kick.play({wait : beat*(4.5+8)})
        kick.play({ wait: beat * (6 + 8) })
        // kick.play({wait : beat*(7+8)})
        kick.play({ wait: beat * (7.5 + 8) })

    }




    if ($('#bass').hasClass('on')) {
        bass.play({ pitch: 'C2', wait: beat * 0 })
        bass.play({ pitch: 'C3', wait: beat * .5 })
        bass.play({ pitch: 'C2', wait: beat * 1 })
        bass.play({ pitch: 'C3', wait: beat * 1.5 })
        bass.play({ pitch: 'C2', wait: beat * 2 })
        bass.play({ pitch: 'C3', wait: beat * 2.5 })
        bass.play({ pitch: 'C2', wait: beat * 3 })
        bass.play({ pitch: 'C3', wait: beat * 3.5 })
        bass.play({ pitch: 'F2', wait: beat * 4 })
        bass.play({ pitch: 'F3', wait: beat * 4.5 })
        bass.play({ pitch: 'F2', wait: beat * 5 })
        bass.play({ pitch: 'F3', wait: beat * 5.5 })
        bass.play({ pitch: 'F2', wait: beat * 6 })
        bass.play({ pitch: 'F3', wait: beat * 6.5 })
        bass.play({ pitch: 'F2', wait: beat * 7 })
        bass.play({ pitch: 'F3', wait: beat * 7.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 8 })
        bass.play({ pitch: 'Ab3', wait: beat * 8.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 9 })
        bass.play({ pitch: 'Ab3', wait: beat * 9.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 10 })
        bass.play({ pitch: 'Ab3', wait: beat * 10.5 })
        bass.play({ pitch: 'Ab2', wait: beat * 11 })
        bass.play({ pitch: 'Ab3', wait: beat * 11.5 })
        bass.play({ pitch: 'G2', wait: beat * 12 })
        bass.play({ pitch: 'G3', wait: beat * 12.5 })
        bass.play({ pitch: 'G2', wait: beat * 13 })
        bass.play({ pitch: 'G3', wait: beat * 13.5 })
        bass.play({ pitch: 'G2', wait: beat * 14 })
        bass.play({ pitch: 'G3', wait: beat * 14.5 })
        bass.play({ pitch: 'G2', wait: beat * 15 })
        bass.play({ pitch: 'Bb2', wait: beat * 15.5 })


    }

    if ($('#piano').hasClass('on')) {

        piano.play({ pitch: 'C5', wait: beat * (0.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (1), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (1.5) })
        piano.play({ pitch: 'F5', wait: beat * (1.75), env: { release: .2 } })

        piano.play({ pitch: 'C5', wait: beat * (4.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (5), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (5.5) })
        piano.play({ pitch: 'F5', wait: beat * (5.75), env: { release: .2 } })

        piano.play({ pitch: 'C5', wait: beat * (8.75) })
        piano.play({ pitch: 'Eb5', wait: beat * (9), filter: { q: 15 } })
        piano.play({ pitch: 'C5', wait: beat * (9.5) })
        piano.play({ pitch: 'F5', wait: beat * (9.75), env: { release: .2 } })
        piano.play({ pitch: 'F5', wait: beat * (11) })
        piano.play({ pitch: 'Gb5', wait: beat * (11.75), filter: { q: 15 } })
        piano.play({ pitch: 'G5', wait: beat * (12) })
        piano.play({ pitch: 'C5', wait: beat * (12.75) })
        piano.play({ pitch: 'D6', wait: beat * (13), filter: { q: 15 } })
        piano.play({ pitch: 'G5', wait: beat * (13), filter: { q: 15 } })
        piano.play({ pitch: 'D6', wait: beat * (13.25), filter: { q: 15 } })
        piano.play({ pitch: 'G5', wait: beat * (13.25), filter: { q: 15 } })
        piano.play({ pitch: 'C6', wait: beat * (13.5), filter: { q: 15 } })
        piano.play({ pitch: 'F6', wait: beat * (13.5), filter: { q: 15 } })
        piano.play({ pitch: 'D6', wait: beat * (13.75), filter: { q: 15 } })
        piano.play({ pitch: 'G5', wait: beat * (13.75), filter: { q: 15 } })
    }


    if ($('#flute').hasClass('on')) {
        ghost.play({ pitch: 'G5', wait: beat * (0), panning: -.1 })
        ghost.play({ pitch: 'Gb5', wait: beat * (3.75), panning: -.1, env: { hold: .1 } })
        ghost.play({ pitch: 'F5', wait: beat * (4), panning: .1 })
        ghost.play({ pitch: 'Ab5', wait: beat * (8), panning: -.1 })
        ghost.play({ pitch: 'G5', wait: beat * (11), panning: .1 })
        ghost.play({ pitch: 'Bb5', wait: beat * (12), panning: .1 })
        // ghost.play( {pitch : 'Eb5', wait : beat * (13), env : {hold : .1}})

    }

}

$(document).ready(function () {
    $('#play').one('click', function () {
        oneLoop();
        setInterval(oneLoop, Math.floor(beat * 32 * 1000));
        setTimeout(twoLoop, Math.floor(beat * 32 * 500))
        setInterval(function () { setTimeout(twoLoop, Math.floor(beat * 32 * 500)) }, Math.floor(beat * 32 * 1000))
        $(this).addClass('disabled')
    })

    $('.toggle').on('click', function () {
        $(this).toggleClass('on')
    })

    $('.toggle').on('mouseenter', function () {
        var templateName = $(this).text().toLowerCase() + '-template'
        $('#text-box').addClass('transitioning')
        setTimeout(function () { jade.render(document.getElementById('text-box'), templateName, {}) }, 200)
        setTimeout(function () { $('#text-box').removeClass('transitioning') }, 250)

    })


})
