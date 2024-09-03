const videoCardContainer = document.querySelector('.video-container');
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-btn');

const api_key = "AIzaSyAu16CvdVIHfUPKeY1oYiNGwe-jyzzuS9I";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const fetchVideos = () => {
    fetch(video_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 60,
        regionCode: 'IN'
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannelIcon(item);
        });
    })
    .catch(err => {
        console.error("Failed to fetch video data:", err);
        displayError("Failed to load videos. Please try again later.");
    });
}

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
    .catch(err => {
        console.error("Failed to fetch channel icon:", err);
        video_data.channelThumbnail = "default-thumbnail.jpg"; // Placeholder thumbnail
        makeVideoCard(video_data);
    });
}

const makeVideoCard = (data) => {
    const videoCard = document.createElement('div');
    videoCard.className = "video";
    videoCard.onclick = () => {
        window.location.href = `https://youtube.com/watch?v=${data.id}`;
    };

    videoCard.innerHTML = `
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="Video Thumbnail">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="Channel Icon">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    `;

    videoCardContainer.appendChild(videoCard);
}

const displayError = (message) => {
    videoCardContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

searchButton.addEventListener('click', () => {
    if (searchInput.value.trim().length) {
        window.location.href = `https://www.youtube.com/results?search_query=${searchInput.value}`;
    }
});

// Initial fetch when the page loads
fetchVideos();
