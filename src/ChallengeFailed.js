import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const ChallengeFailed = ({ onBackToSelection }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        animationRef.current = anime.timeline({ loop: false })
            .add({
                targets: '.sad-face',
                scale: [4, 1],
                opacity: [0, 1],
                translateZ: 0,
                easing: "easeOutExpo",
                duration: 950,
                delay: 500
            }).add({
                targets: '.failed-title',
                opacity: [0, 1],
                duration: 800,
                easing: "easeOutExpo",
                delay: 500
            }).add({
                targets: '.failed-message',
                opacity: [0, 1],
                duration: 500,
                easing: "easeOutExpo",
                delay: 1000
            }).add({
                targets: '.back-button',
                opacity: [0, 1],
                duration: 500,
                easing: "easeOutExpo",
                delay: 1000
            });

        return () => {
            if (animationRef.current) animationRef.current.pause();
        };
    }, []);

    return (
        <div className="challenge-failed-container">
            <div className="sad-face">😢</div>
            <h1 className="failed-title">Challenge Failed</h1>
            <p className="failed-message">Don't give up! You can always try again.</p>
            <button className="btn back-button" onClick={onBackToSelection}>Back to Game Mode Selection</button>
        </div>
    );
};

export default ChallengeFailed;