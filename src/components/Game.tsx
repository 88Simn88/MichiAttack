import React, { useState, useEffect, useCallback, } from "react";
import Player from "./Player";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"

interface EnemyPosition {
    id: string;
    x: number;
    y: number;
    url: string;
    speed: number;
}

interface BulletPosition {
    id: string;
    x: number;
    y: number;
}

const Game: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState(() => {
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        return {

            x: screenWidth / 2 - 25,
            y: screenHeight - 250
        }
    })

    const [enemies, setEnemies] = useState<EnemyPosition[]>([]);
    const [bullets, setBullets] = useState<BulletPosition[]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    //Level Logic
    const [enemyCount, setEnemyCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [levelFinished, setLevelFinished] = useState(false);

 /*    const generateEnemy = () => {
        const xPosition = Math.floor(Math.random() * (window.innerWidth - 50));
        const { url, speed } = getEnemyProperties(); // Obtenemos propiedades basadas en el nivel
        return {
            id: `enemy-${Date.now()}`,
            x: xPosition,
            y: 0,
            url: url,
            speed: speed,
        };
        
    }; */
    

    /*  useEffect(() => {
        if (!levelFinished && !isGameOver){
            //Generar enemigos iniciales
            const newEnemies = Array.from({ length: 10 }, () => generateEnemy());
            setEnemies(newEnemies);
        // Generar enemigos periódicamente
        const interval = setInterval(generateEnemy, 2000);
        console.log(enemyCount)
        return () => clearInterval(interval);
    }
}, [level, levelFinished, isGameOver]);  */

   /*  useEffect(() => {
        if (enemyCount >= 30 && level === 1) {
            setLevelFinished(true);  // Marca el nivel como terminado
        }
    }, [enemyCount, level]); */
    
    const handleNextLevel = () => {
        ;          // Incrementa el nivel
        setEnemyCount(0);             // Resetea el contador de enemigos
        setLevelFinished(false);      // Oculta la pantalla de finalización de nivel
        setEnemies([]);               // Limpia los enemigos del nivel anterior
    };
    
    const levelThresholds = [5, 5, 5, 5, 5, 5, 5];

     const handleEnemyDestroyed = () => {
        setEnemyCount(prevCount => {
            const newCount = prevCount + 1;
            console.log(`Enemy Count: ${newCount}, Level: ${level}`);
            if(newCount >= levelThresholds[level - 1]) {
                console.log(`Level ${level} finished, moving to Level ${level + 1}`);
                //Cambiar al segundo nivel
                setLevelFinished(true)
                setTimeout(() => {
                    setLevel(level + 1);
                    console.log(`New Level: ${level + 1}`);
                }, 0);
            }
            

            return newCount
        })
    } 

    const getEnemyProperties = () => {
        if(level === 1 ) {
            return {
                url: '/img/octo1sf.png',
                speed: 1,
            }
        } else if (level === 2 ){
            return{
                url: '/img/cyclops.png',
                speed: 2,
            }
        } else if(level === 3 ) {
            return{
                url: '/img/slime.png',
                speed: 3,
            }
         } else if(level === 4 ){
         return{
         url: "/img/firesf.png",
         speed: 4,
     } 
    } else if (level === 5 ){
        return{
            url: "/img/monstersf.png",
            speed: 5,
        }
    } else {
        return{
            url: "/img/octo3sf.png",
            speed:7
        }
    }
}
     useEffect(() => {
        if (!levelFinished && !isGameOver) {
            const { url, speed } = getEnemyProperties()
            const spawnEnemy = () => {
                const xPosition = Math.floor(Math.random() * (window.innerWidth - 50));
            
                const newEnemy = {
                    id: `enemy-${Date.now()}`,
                    x: xPosition,
                    y: 0,
                    url: url,
                    speed: speed,
                }
                setEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
            };

            const interval = setInterval(spawnEnemy, 1000);
            return () => clearInterval(interval);
        }
    }, [levelFinished, enemyCount, isGameOver]); 


    const handleEnemyDestroy = useCallback((enemyId: string, destroyedByBullet: boolean) => {
        setEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.id !== enemyId));
        if (destroyedByBullet) {
            setScore((prevScore) => prevScore + 1);
        }
    }, []);

    const handleBulletDestroy = useCallback((bulletId: string) => {
        setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.id !== bulletId));
    }, []);

    const checkCollisions = useCallback(() => {
        const bulletsToRemove = new Set<string>();
        const enemiesToRemove = new Set<string>();

        bullets.forEach((bullet) => {
            enemies.forEach((enemy) => {
                const isColliding =
                    bullet.x <= enemy.x + 40 &&
                    bullet.x + 5 >= enemy.x &&
                    bullet.y >= enemy.y &&
                    bullet.y <= enemy.y + 40;

                if (isColliding) {
                    bulletsToRemove.add(bullet.id);
                    enemiesToRemove.add(enemy.id);
                    handleEnemyDestroyed();
                }
            });
        });

        setBullets((prevBullets) =>
            prevBullets.filter((bullet) => !bulletsToRemove.has(bullet.id))
        );

        setEnemies((prevEnemies) =>
            prevEnemies.filter((enemy) => {
                const isDestroyed = enemiesToRemove.has(enemy.id);
                if (isDestroyed) {
                    handleEnemyDestroy(enemy.id, true);
                }
                return !isDestroyed;
            })
        );
    }, [bullets, enemies, handleEnemyDestroy]);



    const checkPlayerCollision = useCallback(() => {
        enemies.forEach((enemy) => {
            const isCollidingWithPlayer =

                playerPosition.x <= enemy.x + 40 &&
                playerPosition.x + 50 >= enemy.x &&
                playerPosition.y <= enemy.y + 40 &&
                playerPosition.y + 50 >= enemy.y;

            if (isCollidingWithPlayer) {
                setIsGameOver(true);
            }

        })
    }, [enemies, playerPosition])


    useEffect(() => {
        let animationFrameId: number;

        const updateGame = () => {
            const { speed } = getEnemyProperties()//obtenemos velocidad del enemigo
           
            setBullets((prevBullets) =>
                prevBullets.map((bullet) => ({
                    ...bullet,
                    y: bullet.y - 5, // Ajustar la velocidad según sea necesario
                }))
            );

            setEnemies((prevEnemies) =>
                prevEnemies.map((enemy) => {
                    const newY = enemy.y + speed; // Ajustar la velocidad de los enemigos según sea necesario

                    if (newY >= window.innerHeight - 40) {
                        handleEnemyDestroy(enemy.id, false);
                    }

                    return { ...enemy, y: newY };
                })
            );

            checkCollisions(); // Chequear colisiones en cada frame
            checkPlayerCollision()
            animationFrameId = requestAnimationFrame(updateGame);
        };
        animationFrameId = requestAnimationFrame(updateGame);

        return () => cancelAnimationFrame(animationFrameId);
    }, [checkCollisions, checkPlayerCollision, level]);


    const handleShoot = useCallback(() => {
        setBullets((prevBullets) => [
            ...prevBullets,
            { id: `bullet-${Date.now()}`, x: playerPosition.x + 50, y: playerPosition.y },
        ]);
    }, [playerPosition]);

    useEffect(() => {
        const shootListener = (e: KeyboardEvent) => {
            if (e.key === " " && !isGameOver) {
                handleShoot();
            }
        };

        window.addEventListener("keydown", shootListener);
        return () => window.removeEventListener("keydown", shootListener);
    }, [handleShoot, isGameOver]);

    // Mobile controls

    const handleTouchMoveLeft = () => {
        setPlayerPosition((prevPosition) => ({
            ...prevPosition,
            x: Math.max(prevPosition.x - 10, 0),
        }));
    };

    const handleTouchMoveRight = () => {
        setPlayerPosition((prevPosition) => ({
            ...prevPosition,
            x: Math.min(prevPosition.x + 10, window.innerWidth - 50),
        }));
    };

    const playerHeight = 80;
    const handleTouchMoveUp = () => {
        setPlayerPosition((prevPosition) => ({
            ...prevPosition,
            y: Math.max(prevPosition.y - 10, 0),
        }));
    };

    const handleTouchMoveDown = () => {
        const containerHeight = window.innerHeight;
        setPlayerPosition((prevPosition) => ({
            ...prevPosition,
            y: Math.min(prevPosition.y + 10, containerHeight - playerHeight),
        }));
    };


    const handleTouchShoot = useCallback(() => {
        setBullets((prevBullets) => [
            ...prevBullets,
            { id: `bullet-${Date.now()}`, x: playerPosition.x + 50, y: playerPosition.y },
        ]);
    }, [playerPosition]);


    return (
        <div className="relative h-[524px] w-full md:h-screen md:w-screen bg-black overflow-hidden">
            <div className="flex-grow relative h-full">

                <div className="background">

                    {levelFinished ? (
                   /*  !isGameOver ? ( 
                                     */
                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-4xl">
                   <div>
                       <div>Level {level -1 } Finished</div>
                       <button
                           className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                           onClick={handleNextLevel}
                       >
                           Next
                       </button>
                   </div>
               </div>
           ) : !isGameOver ? (                  
                  <>
                            <Player
                                position={playerPosition}
                                onPositionChange={(x, y) => setPlayerPosition({ x, y })}
                            />
                            {bullets.map((bullet) => (
                                <Bullet
                                    key={bullet.id}
                                    position={bullet}
                                    onDestroy={() => handleBulletDestroy(bullet.id)}
                                />
                            ))}

                            {enemies.map((enemy) => (
                                <Enemy
                                    key={enemy.id}
                                    position={enemy}
                                    url={enemy.url}
                                    speed={enemy.speed}
                                    onDestroy={() => handleEnemyDestroy(enemy.id, true)}
                                    
                                />
                            ))}
                            <div className="absolute top-[10px] left-[10px] bg-white py-1 px-3 rounded">
                                Score: {score}
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-4xl">
                            Game Over
                        </div>
                    )}
                </div>

            </div>

            <div className="md:hidden h-[150px] w-full flex justify-around  py-4 bg-gray-800 fixed bottom-0">
                <div className="w-1/3 flex flex-col">

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto"
                        onTouchStart={() => handleTouchMoveUp()}

                    >
                        <FontAwesomeIcon icon={faArrowUp} />
                    </button>

                    <div className="w-full flex justify-between ">

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onTouchStart={() => handleTouchMoveLeft()}


                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onTouchStart={() => handleTouchMoveRight()}

                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto"
                        onTouchStart={() => handleTouchMoveDown()}

                    >
                        <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                </div>

                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold my-5 px-4 rounded-full"
                    onTouchStart={() => handleTouchShoot()}
                >
                    Shoot!
                </button>
            </div>
        </div>

    );
};

export default Game;
