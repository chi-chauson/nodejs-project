import React from 'react';
import './YouTubePlayer.css';

const YouTubePlayer = ({ videoId }) => {
    return (
        <div className="youtube-player">
            <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default YouTubePlayer;