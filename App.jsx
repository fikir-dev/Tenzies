import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)
    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
            

    
    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }

    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 1) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    } 


    const [elapsedTime, setElapsedTime] = useState(0);
    const [bestTime, setBestTime] = useState(null)
    const timerRef = useRef(null);
        
     

useEffect(() => {
    if (gameWon) {
        setBestTime(prevBest => (prevBest === null || elapsedTime < prevBest ? elapsedTime : prevBest));
        buttonRef.current.focus();
        clearInterval(timerRef.current);   
    }
}, [gameWon]);



    const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000));
        return `${String(seconds).padStart(2, '0')}`;
    };

    const toggleStopwatch = () => {
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);}

    function newGame(){
        setDice(generateAllNewDice())
        setElapsedTime(0)
        toggleStopwatch()
    }
   
    window.onload = function() {
    toggleStopwatch()
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}  
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className='time'>
                <div className='timeInner'>
                    <p>Time</p>
                    <p>{formatTime(elapsedTime)}s</p>
                </div>
                <div className='timeInner'>
                    <p>Best time</p>
                    <p>{bestTime ? formatTime(bestTime)+'s' : 'N/A'}</p>
                </div>
                
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            {gameWon ? <button ref={buttonRef} className="roll-dice" onClick={newGame}>New game</button> :
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>Roll</button>}
        </main>
    )
}