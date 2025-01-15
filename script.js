const playPauseButton = document.getElementById('playPauseButton');
        const audioPlayer = document.getElementById('audioPlayer');
        const progressBar = document.getElementById('progress');
        const progressContainer = document.querySelector('.progress-bar');
        const currentTimeDisplay = document.getElementById('currentTime');
        const totalTimeDisplay = document.getElementById('totalTime');

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${minutes}:${secs}`;
        }
        audioPlayer.addEventListener('loadedmetadata', () => {
            console.log("hello world")
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        });

        playPauseButton.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseButton.innerHTML = '&#10074;&#10074;'; 
            } else {
                audioPlayer.pause();
                playPauseButton.innerHTML = '&#9654;'; 
            }
        });

        audioPlayer.addEventListener('timeupdate', () => {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        });

        audioPlayer.addEventListener('ended', () => {
            playPauseButton.innerHTML = '&#9654;'; 
            progressBar.style.width = '0%'; 
            currentTimeDisplay.textContent = '0:00';
        });


        progressContainer.addEventListener('click', (e) => {
            const containerLargeur = progressContainer.offsetWidth;
            const clickPosition = e.offsetX; 
            const nouveauTime = (clickPosition / containerLargeur) * audioPlayer.duration;
            audioPlayer.currentTime = nouveauTime; 
        });
        



        