import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import GoodAnswer from '../assets/goodAnswer.mp3';
import WrongAnswer from '../assets/badAnswer.mp3';
import CreditSong from '../assets/credits.mp3';
import StartFinal from '../assets/startFinale.mp3';
import GoodAnswerFinale from '../assets/goodAnswerFinale.mp3';

function Home({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);
    const [finalTimer, setFinalTimer] = useState(0);

    const [playGoodAnswer] = useSound(GoodAnswer);
    const [playWrongAnswer] = useSound(WrongAnswer);
    const [playCreditSong, { stop: stopCreditSong, sound: creditSongSound }] = useSound(CreditSong);
    const [playStartFinal] = useSound(StartFinal);
    const [playGoodAnswerFinale] = useSound(GoodAnswerFinale);

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

        function onStartFinalTimer(duration) {
            playStartFinal();
            setFinalTimer(duration);
        }

        function onFinalTimerUpdate(duration) {
            setFinalTimer(duration);
            if(duration == 0) {
                playWrongAnswer();
            }
        }

        function onRevealFinalAnswer(state) {
            setState(state);
            playGoodAnswerFinale();
        }

        function onPlayCredits() {
            if(!creditSongSound.playing()) {
                playCreditSong();
            }
        }

        function onStopCredits() {
            stopCreditSong();
        }

        socket.on('appInit', onAppInit);
        socket.on('answerReveal', onAnswerReveal);
        socket.on('wrongGuess', onWrongGuess);
        socket.on('stateUpdate', onStateUpdate);
        socket.on('startFinalTimer', onStartFinalTimer);
        socket.on('finalTimerUpdate', onFinalTimerUpdate);
        socket.on('revealFinalAnswer', onRevealFinalAnswer);
        socket.on('playCredits', onPlayCredits);
        socket.on('stopCredits', onStopCredits);

        return () => {
            socket.off('appInit', onAppInit);
            socket.off('answerReveal', onAnswerReveal);
            socket.off('wrongGuess', onWrongGuess);
            socket.off('stateUpdate', onStateUpdate);
            socket.off('startFinalTimer', onStartFinalTimer);
            socket.off('finalTimerUpdate', onFinalTimerUpdate);
            socket.off('revealFinalAnswer', onRevealFinalAnswer);
            socket.off('playCredits', onPlayCredits);
            socket.off('stopCredits', onStopCredits);
        };
    }, [playGoodAnswer, playWrongAnswer, playCreditSong, playStartFinal, creditSongSound, stopCreditSong, socket]);

    return (
        <>
            {!appInitiated && (
                <div className="loader-container">
                    <div className="loading-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                    </div>
                </div>
            )}
            {appInitiated && (
                <div className="global-container">
                    {!state.isFinal ? (
                        <div className="question-container">
                            <div className="left-circle-large">
                                <div className="left-circle-medium">
                                    <div className="left-circle-small"></div>
                                </div>
                            </div>
                            <div>
                                <h2 className={`question ${!state.questions[state.currentQuestion].revealed ? 'hidden-question' : ''}`}>{state.questions[state.currentQuestion].text}</h2>
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
                    ) : (
                        <div className="final-container">
                            <div className="final-timer">{finalTimer}</div>
                            <div className="final-answers">
                                {state.finalQuestions.map((question) => (
                                    <>
                                        <span>{question.revealedAnswerFirstRunIndex !== null ? question.answers[question.revealedAnswerFirstRunIndex].text : ''}&nbsp;{question.revealedAnswerFirstRunIndex !== null ? question.answers[question.revealedAnswerFirstRunIndex].points : ''}</span>
                                        <span>{question.revealedAnswerSecondRunIndex !== null ? question.answers[question.revealedAnswerSecondRunIndex].points : ''}&nbsp;{question.revealedAnswerSecondRunIndex !== null ? question.answers[question.revealedAnswerSecondRunIndex].text : ''}</span>
                                    </>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="game-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                        <p className="score">{state.isFinal ? state.finalPoints : state.points}</p>
                        <div className="audio-container mtopauto">
                            <button className="button" onClick={() => {
                                Math.random() > 0.5 ? playGoodAnswer() : playWrongAnswer();
                            }}>Test audio</button>
                        </div>
                    </div>
                </div>
            )}
        </>
  );
}

export default Home;