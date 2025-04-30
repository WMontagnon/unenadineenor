import { useState } from 'react';
import useSound from 'use-sound';
import GoodAnswer from '../good-answer.mp3';
import WrongAnswer from '../wrong-answer.mp3';

function Home({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);

    const [playGoodAnswer] = useSound(GoodAnswer, { volume: 0.05 });
    const [playWrongAnswer] = useSound(WrongAnswer, { volume: 0.05 });
    socket.on('appInit', (state) => {
        setState(state);
        setAppInitiated(true);
    });

    socket.on('answerReveal', (state) => {
        setState(state);
        playGoodAnswer();
    });

    socket.on('wrongGuess', (state) => {
        setState(state);
        playWrongAnswer();
    });

    socket.on('stateUpdate', (state) => {
        setState(state);
    });

    return (
        <div>
            <h2>Aurel</h2>
            {appInitiated && (
                <div className="flex flex-col items-center justify-center">
                    <p>Points: {state.points}</p>
                    <h2>{state.questions[state.currentQuestion].text}</h2>
                    <ul>
                        {state.questions[state.currentQuestion].answers.map((answer, index) => (
                            <li className={`tile ${answer.revealed ? 'rotateTile' : ''}`} key={index}>
                                <div className="tile-front">
                                    {index + 1}
                                </div>
                                <div className="tile-back">
                                    {answer.text} - {answer.points}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Wrong Guesses</h3>
                        {Array.from({ length: state.questions[state.currentQuestion].wrongGuess }).map((_, index) => (
                            <p key={index}>X</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
  );
}

export default Home;