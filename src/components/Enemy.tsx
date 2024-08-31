import React, { useEffect, useState } from "react";

interface EnemyProps {
    position: {x:number; y: number};
    url: string;
    speed: number;
    onDestroy: () => void;
}

const Enemy: React.FC<EnemyProps> = ({ position, url, speed, onDestroy}) => {
    const [y, setY] = useState(position.y);

    useEffect(() => {
        let animationFrameId: number;
    
        const updateEnemyPosition = () => {
            setY((prevY) => {
                const newY = prevY + speed;
                if (newY > window.innerHeight) {
                    onDestroy(); // Destruye el enemigo si llega al límite inferior
                }
                return newY;
            });
    
            animationFrameId = requestAnimationFrame(updateEnemyPosition);
        };
    
        animationFrameId = requestAnimationFrame(updateEnemyPosition);
    
        return () => cancelAnimationFrame(animationFrameId);
    }, [onDestroy]); // No incluyas `y` en las dependencias
    

    return (
        <div
      className="absolute w-10 h-10"
      style={{ left: `${position.x}px`, top: `${y}px`,
      backgroundImage: `url(${url})`,
      backgroundSize: "cover" }}
    />
    )
}

export default Enemy