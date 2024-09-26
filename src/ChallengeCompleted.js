import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const ChallengeCompleted = ({ score, onBackToSelection }) => {
    const canvasRef = useRef(null);
    const xpCounterRef = useRef(null);

    useEffect(() => {
        fireConfetti();
        animateXP();
    }, []);

    const fireConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        const fire = (particleRatio, opts) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
                disableForReducedMotion: true
            });
        };

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    const animateXP = () => {
        const finalXP = score || 0;
        let currentXP = 0;
        const startTime = performance.now();
        const duration = 2000;

        const easeOutExpo = (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const updateXP = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);

            currentXP = Math.floor(easedProgress * finalXP);
            if (xpCounterRef.current) {
                xpCounterRef.current.textContent = currentXP;
            }

            if (progress < 1) {
                requestAnimationFrame(updateXP);
            }
        };

        requestAnimationFrame(updateXP);
    };

    return (
        <div className="celebration-container">
            <canvas ref={canvasRef} id="confetti-canvas" />
            <h1>Congratulations!</h1>
            <div className="xp-container">You've earned <span ref={xpCounterRef} id="xpCounter">0</span> XP!</div>
            <button className="btn" onClick={onBackToSelection}>Back to Game Mode Selection</button>
        </div>
    );
};

export default ChallengeCompleted;