let allSongs;
let currentSong = new Audio();
let currentIndex = 0;
let isPlay = false;
let isShuffle = false;
let isRepeat = false;
//fetch all song
async function fetchAllSong() {
  const data = await fetch("./songs/songs.json");
  const res = await data.json();
  allSongs = res;
}

//song card UI
function songCard(song) {
  return `<div class="playlist-item" onclick="handleCardClick(event,${song.id})">
          <div class="item-info">
            <span class="song-name">${song.title}</span>
            <span class="artist-small">${song.artist}</span>
          </div>
          <span class="duration">${song.duration}</span>
        </div>`;
}
//direct jump to click song
function handleCardClick(e, id) {
  document.querySelector(".playlist-item.active")?.classList.remove("active");
  let clickedSong = allSongs.filter((song) => song.id == id);
  currentSong.src = clickedSong[0].song;
  e.target.closest(".playlist-item").classList.add("active");
  currentSong.play();
  currentIndex = allSongs.findIndex((song) => song.id == id);
  console.log(currentIndex);
  const playbtn = document.querySelector(".play-btn");
  playbtn.classList.remove("fa-play");
  playbtn.classList.add("fa-pause");
  isPlay = true;
  setAlbum();
}

// render all song cards
function renderAllCard() {
  const container = document.querySelector(".playlist-panel");
  allSongs.map((song) => {
    container.innerHTML += songCard(song);
  });
}
//set album images
function setAlbum() {
  const albumTitle = document.querySelector(".track-title");
  const artistName = document.querySelector(".artist-name");
  const albumImg = document.querySelector(".album-img");
  console.log(albumImg);
  let currSong = allSongs[currentIndex];
  artistName.textContent = currSong.artist;
  albumTitle.textContent = currSong.title;
  albumImg.src = currSong.album;
}
//toggle pause and play
const togglePlay = () => {
  let playBtn = document.querySelector(".play-btn");
  if (!isPlay) {
    currentSong.play();
    isPlay = true;
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");
    activeSongCard();
    setAlbum();
  } else if (isPlay) {
    currentSong.pause();
    isPlay = false;
    playBtn.classList.remove("fa-pause");
    playBtn.classList.add("fa-play");
  }
};
//Play music when next song clicked
function playMusic(index) {
  currentIndex = index;
  currentSong.src = allSongs[currentIndex].song;
  currentSong.play();
  setAlbum();
  isPlay = true;
  activeSongCard();
}

//manage active song
function activeSongCard() {
  const songsInPlaylist = document.querySelectorAll(".playlist-item");
  const songsArray = Array.from(songsInPlaylist);
  const exactSong = songsArray.at(currentIndex);
  songsArray.forEach((e) => e.classList.remove("active"));
  exactSong.classList.add("active");
}
//playNextSong
const playNextSong = () => {
  if (currentIndex < allSongs.length - 1) {
    if (isShuffle) {
      let randomIndex = Math.round(Math.random() * allSongs.length);
      currentIndex = randomIndex;
    } else {
      currentIndex++;
    }
  } else {
    currentIndex = 0;
  }
  playMusic(currentIndex);
};
const playPreviousSong = () => {
  if (currentIndex > 0) {
    currentIndex--;
  }
  playMusic(currentIndex);
};

//handle song ending
function handleSongEnding() {
  if (isRepeat) {
    playMusic(currentIndex);
  } else {
    playNextSong();
  }
}
//Handle volume
function handleVolume(e) {
  currentSong.volume = e.target.value / 100;
}

//function for convert minute to minute sec
function secondsToMinutesSeconds(second) {
  if (isNaN(second) || second <= 0) {
    return "00:00";
  }
  const minutes = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(sec).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

//Move seekbar
function updateseekBar() {
  seekbarfill = document.querySelector(".progress-fill");
  seekbarfillPositon = Number(
    (currentSong.currentTime / currentSong.duration) * 100,
  );
  seekbarfill.style.width = `${seekbarfillPositon}%`;
}

//handle progress bar click
function handleProgessBarClick(e) {
  let cleintReact = e.clientX - e.target.getBoundingClientRect().x;
  let progress = (cleintReact / e.target.getBoundingClientRect().width) * 100;
  currentSong.currentTime = (progress / 100) * currentSong.duration;
}
async function init() {
  await fetchAllSong();
  currentSong.src = allSongs[currentIndex].song;
  renderAllCard();
  const btnPlay = document.querySelector(".btn-play");
  btnPlay.addEventListener("click", () => {
    togglePlay();
  });
  document.querySelector(".btn-next").addEventListener("click", () => {
    playNextSong();
  });
  document.querySelector(".btn-previous").addEventListener("click", () => {
    playPreviousSong();
  });
  document.querySelector("#volume-control").addEventListener("change", (e) => {
    handleVolume(e);
  });
  currentSong.addEventListener("timeupdate", () => {
    let currTime = document.querySelector("#song-time");
    let totalTime = document.querySelector(".total-time");
    let songTime = secondsToMinutesSeconds(currentSong.currentTime);
    currTime.textContent = songTime;
    totalTime.textContent = secondsToMinutesSeconds(currentSong.duration);
    updateseekBar();
  });
  document.querySelector(".progress-bar").addEventListener("click", (e) => {
    handleProgessBarClick(e);
  });
  currentSong.addEventListener("ended", () => {
    handleSongEnding();
  });
  document.querySelector(".btn-repeat").addEventListener("click", function () {
    if (isRepeat) {
      isRepeat = false;
      this.style.color = "#fefefe";
    } else {
      this.style.color = "#1dd9f9f5";
      isRepeat = true;
    }
  });
  document.querySelector(".btn-shuffle").addEventListener("click", function () {
    if (isShuffle) {
      isShuffle = false;
      this.style.color = "#fefefe";
    } else {
      this.style.color = "#1dd9f9f5";
      isShuffle = true;
    }
    console.log(isShuffle);
  });

  document.querySelector(".volume-icon").addEventListener("click", function () {
    if (currentSong.muted) {
      this.classList.remove("fa-volume-xmark");
      this.classList.add("fa-volume-high");
      currentSong.muted = false;
    } else {
      console.log("mute ni tha");
      this.classList.remove("fa-volume-high");
      this.classList.add("fa-volume-xmark");
      currentSong.muted = true;
    }
  });
}
init();
