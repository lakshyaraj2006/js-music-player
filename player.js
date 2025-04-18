const songs = [
    { songName: 'Clarx - Zig Zag', songSrc: 'musics/Clarx - Zig Zag [NCS Release].mp3' },
    { songName: 'Janji - Heroes Tonight (feat. Johnning)', songSrc: 'musics/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3' },
    { songName: 'Jarico - Island', songSrc: 'musics/Jarico - Island [NCS BEST OF].mp3' },
    { songName: 'Jarico - Landscape', songSrc: 'musics/Jarico - Landscape [NCS BEST OF].mp3' },
    { songName: 'Jarico - Paradise', songSrc: 'musics/Jarico - Paradise [NCS BEST OF].mp3' },
    { songName: 'Jarico - Taj Mahal', songSrc: 'musics/Jarico - Taj Mahal [NCS BEST OF].mp3' },
    { songName: 'Jarico - Waves', songSrc: 'musics/Jarico - Waves [NCS BEST OF].mp3' },
    { songName: 'Beat Your Competition - Vibe Tracks', songSrc: 'musics/Beat Your Competition - Vibe Tracks.mp3' },
    { songName: 'Clarx - Bones', songSrc: 'musics/Clarx - Bones [NCS Release].mp3' },
    { songName: 'Cushy - Fire Drill', songSrc: 'musics/Cushy - Fire Drill (Royalty Free Music).mp3' },
    { songName: 'Elektronomia - Energy', songSrc: 'musics/Elektronomia - Energy [NCS Release].mp3' },
    { songName: 'Elektronomia - Limitless', songSrc: 'musics/Elektronomia - Limitless [NCS Release].mp3' },
    { songName: 'Flooaw - Don Lito', songSrc: 'musics/Flooaw - Don Lito.mp3' },
    { songName: 'The Emperor\'s Army - Jeremy Blake', songSrc: 'musics/The Emperor\'s Army - Jeremy Blake.mp3' },
    { songName: 'You Like It - Vibe Tracks', songSrc: 'musics/You Like It - Vibe Tracks.mp3' }
];
const playBtn = document.querySelector('img#playBtn');
const nextBtn = document.querySelector('img#nextBtn');
const prevBtn = document.querySelector('img#prevBtn');
const repeatBtn = document.querySelector('img#repeatBtn');
let songNameEl = document.querySelector('h1.songName');
let songsList = document.querySelector('ul.songsList');
let seekbar = document.querySelector('div.seekbar');
let circle = seekbar.querySelector('span.circle');
let playingImg = document.querySelector('img.playing');
let durationEl = document.querySelector('p#duration');
let currentTimeEl = document.querySelector('p#currentTime');
let index = 0;
let audio = new Audio(songs[index].songSrc);
songNameEl.innerText = songs[index].songName;

async function getAudioDuration(src) {
    return new Promise((resolve, err) => {
        let i = new Audio();
        i.src = src;

        i.addEventListener('loadedmetadata', () => {
            resolve(i.duration);
        })
        i.addEventListener('error', (err) => {
            reject(err);
        });
    })
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

audio.addEventListener('loadedmetadata', () => {
    durationEl.innerHTML = secondsToMinutesSeconds(audio.duration);
})

async function getSongs() {
    let str = "";
    for (let song of songs) {
        const duration = await getAudioDuration(song.songSrc);
        str += `<li class="songItem">
        <img class="songItemPlay" src="images/play.svg" alt="" />
        <p>${song.songName}</p>
        <p>${secondsToMinutesSeconds(duration)}</p>
        </li>`
    }

    songsList.innerHTML = str;
    document.querySelectorAll('li.songItem')[index].style.background = 'dodgerblue';
    document.querySelectorAll('li.songItem')[index].style.color = 'white';
    document.querySelectorAll('img.songItemPlay')[index].src = 'images/play-white.svg';

    Array.from(document.querySelectorAll('li.songItem')).forEach((element, i) => {
        const songItemPlay = element.querySelector('img.songItemPlay');
        songItemPlay.addEventListener('click', (e) => {
            audio.pause();
            audio.currentTime = 0;
            index = i;
            songNameEl.innerText = songs[i].songName;
            audio.src = songs[i].songSrc;
            durationEl.innerHTML = secondsToMinutesSeconds(audio.duration);
            playMusic();
            changeBg(i);
        })
    })
}

getSongs();

const changeBg = (index) => {
    let songItems = Array.from(document.querySelectorAll('li.songItem'));
    let songItemPlays = Array.from(document.querySelectorAll('img.songItemPlay'));

    for (let i = 0; i < songItems.length; i++) {
        if (i === index) {
            songItems[i].style.background = 'dodgerblue';
            songItems[i].style.color = 'white';
            songItemPlays[i].src = 'images/pause-white.svg';
        } else {
            songItems[i].removeAttribute('style');
            songItemPlays[i].src = 'images/play.svg';
        }
    }
}

seekbar.addEventListener('click', (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percent + '%';

    if (((audio.duration * percent) / 100) === audio.duration) {
        audio.pause();
        audio.currentTime = 0;
        circle.style.left = '0';
        playBtn.src = 'images/play.svg';
    } else {
        audio.currentTime = (audio.duration * percent) / 100;
    }

})

audio.addEventListener('ended', () => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    playBtn.src = 'images/play.svg';
})

const playMusic = () => {
    songNameEl.innerText = songs[index].songName;
    if (audio.paused) {
        audio.play();
        Array.from(document.querySelectorAll('img.songItemPlay'))[index].src = 'images/pause-white.svg';
        playBtn.src = 'images/pause.svg';
        playingImg.style.opacity = 1;
    } else {
        audio.pause();
        playBtn.src = 'images/play.svg';
        Array.from(document.querySelectorAll('img.songItemPlay'))[index].src = 'images/play-white.svg';
        playingImg.style.opacity = 0;

    }
    audio.addEventListener('timeupdate', () => {
        circle.style.left = ((audio.currentTime / audio.duration) * 100) + '%';
        currentTimeEl.innerHTML = secondsToMinutesSeconds(audio.currentTime);
    })
}

playBtn.addEventListener('click', (e) => {
    playMusic();
})

nextBtn.addEventListener('click', (e) => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    if (index === songs.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    audio.src = songs[index].songSrc;
    durationEl.innerHTML = secondsToMinutesSeconds(audio.duration);
    playMusic();
    changeBg(index);
})

prevBtn.addEventListener('click', (e) => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    if (index === 0) {
        index = songs.length - 1;
    } else {
        index -= 1;
    }
    audio.src = songs[index].songSrc;
    durationEl.innerHTML = secondsToMinutesSeconds(audio.duration);
    playMusic();
    changeBg(index);
})

repeatBtn.addEventListener('click', (e) => {
    if (!audio.loop) {
        audio.loop = true;
        e.target.src = 'images/repeat-one.svg';
    } else {
        audio.loop = false;
        e.target.src = 'images/repeat.svg';
    }
})
