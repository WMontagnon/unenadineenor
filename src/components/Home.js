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
        <>
            {appInitiated && (
                <div className="global-container">
                    <div className="question-container">
                        <div className="left-circle-large">
                            <div className="left-circle-medium">
                                <div className="left-circle-small"></div>
                            </div>
                        </div>
                        <div>
                            <h2 className="question">{state.questions[state.currentQuestion].text}</h2>
                            <ul className="answers">
                                {state.questions[state.currentQuestion].answers.map((answer, index) => (
                                    <li className={`tile ${answer.revealed ? 'rotateTile' : ''}`} key={index}>
                                        <div className="tile-front">
                                            <div className="tile-front-number">
                                                <span>{index + 1}</span>
                                            </div>
                                        </div>
                                        <div className="tile-back">
                                            <span className="answer-text">{answer.text}</span><span className="answer-points">{answer.points}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="wrong-guesses">
                                {Array.from({ length: state.questions[state.currentQuestion].wrongGuess }).map((_, index) => (
                                    <p className="wrong-guess" key={index}>X</p>
                                ))}
                            </div>
                        </div>
                        <div className="right-circle-large">
                            <div className="right-circle-medium">
                                <div className="right-circle-small"></div>
                            </div>
                        </div>
                    </div>
                    <div className="game-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                        <p className="score">{state.points}</p>
                    </div>
                </div>
            )}
        </>
  );
}

export default Home;