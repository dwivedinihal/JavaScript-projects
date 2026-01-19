console.log("Start with js");

let songs = [];
let cursong = new Audio();
let play;
function secondsToMinutesSeconds(seconds) {
     if (isNaN(seconds) || seconds < 0) return "00:00";
     const minutes = Math.floor(seconds / 60);
     const remainingSeconds = Math.floor(seconds % 60);
     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Fetch songs
async function getSongs(folder) {
     let res = await fetch(`/songs/${folder}/songs.json`);
     let data = await res.json();

     return data.map(song => `/songs/${folder}/${song}`);
}

async function loadPlaylist(folder) {
     songs = await getSongs(folder);

     if (songs.length === 0) return;

     playMusic(songs[0]);

     let songUL = document.querySelector(".songList ul");
     songUL.innerHTML = "";

     songs.forEach(songPath => {
          let songName = songPath.split("/").pop().replace(".mp3", "");

          let li = document.createElement("li");
          li.dataset.src = songPath;

          li.innerHTML = `
            <img class="invert" src="img/music.svg">
            <div class="info">
                <div>${songName}</div>
                <div>Nihal Dwivedi</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg">
            </div>
          `;

          li.addEventListener("click", () => playMusic(li.dataset.src));
          songUL.appendChild(li);
     });
}

// Play music
const playMusic = (track, pause = false) => {
     cursong.src = track;
     let songName = track.split("/").pop().replace(".mp3", "");
     document.querySelector(".songinfo").innerHTML = songName;

     if (!pause) {
          cursong.play();
          play.src = "img/pause.svg";
     } else {
          play.src = "img/play.svg";
     }
};

async function displayAlbums() {
     let res = await fetch("/songs/");
     let text = await res.text();

     let div = document.createElement("div");
     div.innerHTML = text;

     let anchors = div.getElementsByTagName("a");

     for (let a of anchors) {
          let folder = a.getAttribute("href");

          if (!folder || folder.includes(".")) continue;

          try {
               let infoRes = await fetch(`/songs/${folder}/info.json`);

               if (!infoRes.ok) {
                    console.warn(`Skipping album (no info.json): ${folder}`);
                    continue;
               }

               let info = await infoRes.json();

               document.querySelector(".cardContainer").innerHTML += `
                <div class="card" data-folder="${folder}">
                    <div class="play">▶</div>
                    <img src="/songs/${folder}/cover.png">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>
            `;
          } catch (err) {
               console.error("Album load failed:", folder);
          }
     }
}


// Main
async function main() {

     // display all the albums on the page
     await displayAlbums();

     // Play / Pause
     play = document.getElementById("play");
     play.addEventListener("click", () => {
          if (cursong.paused) {
               cursong.play();
               play.src = "img/pause.svg";
          } else {
               cursong.pause();
               play.src = "img/play.svg";
          }
     });

     // Time update
     cursong.addEventListener("timeupdate", () => {
          if (!cursong.duration) return;

          document.querySelector(".songtime").innerHTML =
               `${secondsToMinutesSeconds(cursong.currentTime)} / ${secondsToMinutesSeconds(cursong.duration)}`;

          document.querySelector(".circle").style.left =
               (cursong.currentTime / cursong.duration) * 100 + "%";
     });

     // Seekbar
     const seekbar = document.querySelector(".seekbar");
     seekbar.addEventListener("click", (e) => {
          const rect = seekbar.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          if (!cursong.duration) return;
          cursong.currentTime = percent * cursong.duration;
     });

     // Hamburger menu
     document.querySelector(".hamburger").addEventListener("click", () => {
          document.querySelector(".left").style.left = "0%";
     });

     document.querySelector(".close").addEventListener("click", () => {
          document.querySelector(".left").style.left = "-100%";
     });

     // Previous
     const previous = document.getElementById("previous");
     const next = document.getElementById("next");

     previous.addEventListener("click", () => {
          if (!cursong.src) return;

          let current = decodeURIComponent(new URL(cursong.src).pathname);
          let idx = songs.indexOf(current);

          if (idx > 0) {
               playMusic(songs[idx - 1]);
          }
     });

     next.addEventListener("click", () => {
          if (!cursong.src) return;

          let current = decodeURIComponent(new URL(cursong.src).pathname);
          let idx = songs.indexOf(current);

          if (idx < songs.length - 1) {
               playMusic(songs[idx + 1]);
          }
     });


     // Volume
     document.querySelector(".volume-range").addEventListener("input", (e) => {
          cursong.volume = e.target.value / 100;
     });

     // CARD CLICK → LOAD PLAYLIST
     document.querySelector(".cardContainer").addEventListener("click", async (e) => {
          const card = e.target.closest(".card");
          if (!card) return;

          const folder = card.dataset.folder;

          // Click on play button
          if (e.target.closest(".play")) {
               await loadPlaylist(folder);
               cursong.play();
               play.src = "img/pause.svg";
               return;
          }

          // Click anywhere on card
          await loadPlaylist(folder);
     });


     // add the event listner to mute the volume button 
     const volumeRange = document.querySelector(".volume-range");
     const volumeIcon = document.querySelector(".volume img");

     volumeRange.addEventListener("input", (e) => {
          cursong.volume = e.target.value / 100;

          if (cursong.volume === 0) {
               volumeIcon.src = "img/mute.svg";
          } else {
               volumeIcon.src = "img/volume.svg";
               lastVolume = cursong.volume;
          }
     });

     volumeIcon.addEventListener("click", () => {
          if (cursong.volume > 0) {
               lastVolume = cursong.volume;
               cursong.volume = 0;
               volumeRange.value = 0;
               volumeIcon.src = "img/mute.svg";
          } else {
               cursong.volume = lastVolume || 0.5;
               volumeRange.value = cursong.volume * 100;
               volumeIcon.src = "img/volume.svg";
          }
     });

}


main();
