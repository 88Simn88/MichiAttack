import { useState, useEffect, useRef } from "react";

interface PlayerProps {
    position: { x: number; y: number };
    onPositionChange: (x: number, y: number) => void;
}

const Player:React.FC<PlayerProps> = ({ position, onPositionChange }) => {
    const [isMovingLeft, setIsMovingLeft] = useState(false);
    const [isMovingRight, setIsMovingRight] = useState(false);
    const [isMovingUp, setIsMovingUp] = useState(false);
    const [isMovingDown, setIsMovingDown] = useState(false);
    const positionRef = useRef(position); // Usar useRef para mantener la posición actualizada sin causar re-renderizados

    useEffect(() => {
        positionRef.current = position;
    }, [position]);



    //controls computer

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    setIsMovingLeft(true);
                    break;
                case "ArrowRight":
                    setIsMovingRight(true);
                    break;
                case "ArrowUp":
                    setIsMovingUp(true);
                    break;
                case "ArrowDown":
                    setIsMovingDown(true);
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    setIsMovingLeft(false);
                    break;
                case "ArrowRight":
                    setIsMovingRight(false);
                    break;
                case "ArrowUp":
                    setIsMovingUp(false);
                    break;
                case "ArrowDown":
                    setIsMovingDown(false);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

       useEffect(() => {
        const movePlayer = () => {
            let newX = positionRef.current.x;
            let newY = positionRef.current.y;
            const speed = .5;

            //tamaño de la nave
            const playerWidth: number = 80;
            const playerHeight: number = 80;

            //límites del area visible
            const maxX: number = window.innerWidth - playerWidth;
            const maxY: number = window.innerHeight - playerHeight;

            //Actualizar las coordenadas basadas en las teclas presionadas
            if (isMovingLeft) {
                newX = Math.max(0, newX - speed);
            }
            if (isMovingRight) {
                newX = Math.min(maxX, newX + speed);
            }
            if (isMovingUp) {
                newY = Math.max(0, newY - speed);
            }
            if (isMovingDown) {
                newY = Math.min(maxY, newY + speed);
            }

            //Si la posición cambio actualizarla. 
            if (newX !== positionRef.current.x || newY !== positionRef.current.y) {
                positionRef.current = { x: newX, y: newY };
                onPositionChange(newX, newY);
            }

            requestAnimationFrame(movePlayer);
        };

        requestAnimationFrame(movePlayer);

    }, [isMovingLeft, isMovingRight, isMovingUp, isMovingDown, onPositionChange]);

    return (
        <div
            
            className=" absolute w-[120px] h-[120px] "
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,

                backgroundImage: "url('/img/michisf2.png')",
                backgroundSize: "cover"
            }}
        />
    );
};

export default Player;
