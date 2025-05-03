import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import GoodAnswer from '../assets/goodAnswer.mp3';
import WrongAnswer from '../assets/badAnswer.mp3';

function Home({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);

    const [playGoodAnswer] = useSound(GoodAnswer, { volume: 0.5 });
    const [playWrongAnswer] = useSound(WrongAnswer, { volume: 0.5 });

    useEffect(() => {
        function onAppInit(state) {
            setState(state);
            setAppInitiated(true);
        }

        function onAnswerReveal(state) {
            setState(state);
            playGoodAnswer();
        }

        function onWrongGuess(state) {
            setState(state);
            playWrongAnswer();
        }

        function onStateUpdate(state) {
            setState(state);
        }

        socket.on('appInit', onAppInit);
        socket.on('answerReveal', onAnswerReveal);
        socket.on('wrongGuess', onWrongGuess);
        socket.on('stateUpdate', onStateUpdate);

        return () => {
            socket.off('appInit', onAppInit);
            socket.off('answerReveal', onAnswerReveal);
            socket.off('wrongGuess', onWrongGuess);
            socket.off('stateUpdate', onStateUpdate);
        };
    }, [playGoodAnswer, playWrongAnswer, socket]);

    return (
        <>
            {!appInitiated && (
                <div className="global-container">
                    <div className="loading-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                    </div>
                </div>
            )}
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
                        <button className="button mtopauto" onClick={() => {
                            Math.random() > 0.5 ? playGoodAnswer() : playWrongAnswer();
                        }}>Test audio</button>
                    </div>
                </div>
            )}
        </>
  );
}

export default Home;