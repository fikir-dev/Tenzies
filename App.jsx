import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import React, { memo } from "react";



export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)



    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
            
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

       

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
                    { ...die, value: Math.ceil(Math.random() * 6) }
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
    const timerRef = useRef(null);

    const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        return `${String(seconds).padStart(2, '0')}`;
    };

    const toggleStopwatch = () => {
        if (!gameWon) {
        const startTime = Date.now() - elapsedTime;
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);}
    };
   
    window.onload = function() {
    toggleStopwatch();
    };

    if(gameWon){
        clearInterval(timerRef.current);
    }
    

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}  
        />
    ))

    console.log('mew')
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
                    <p>{formatTime(elapsedTime)}</p>
                </div>
                <div className='timeInner'>
                    <p>Best time</p>
                    <p>24S</p>
                </div>
                
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}