import React, { useState, useEffect, useRef } from "react";

interface BulletProps {
    position: { x: number; y: number };
    onDestroy: () => void;
}

const Bullet: React.FC<BulletProps> = ({ position, onDestroy }) => {
    const [bulletPosition, setBulletPosition] = useState(position);
    const positionRef = useRef(position);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        positionRef.current = bulletPosition;
    }, [bulletPosition]);

    useEffect(() => {
        const moveBullet = () => {
            const newY = positionRef.current.y - 5;

            if (newY <= 0) {
                onDestroy();
            } else {
                positionRef.current = { ...positionRef.current, y: newY };
                setBulletPosition(positionRef.current);
                animationFrameId.current = requestAnimationFrame(moveBullet);
            }
        };

        animationFrameId.current = requestAnimationFrame(moveBullet);

        return () => {
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [onDestroy]);

    return (
        <div
            className="absolute w-5 h-5 "
            style={{ left: `${bulletPosition.x}px`, 
            top: `${bulletPosition.y}px`,
            backgroundImage: "url('/img/bulletmdsf.png')",
            backgroundSize: "cover" }} 
        />
    );
};

export default Bullet;
