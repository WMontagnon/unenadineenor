import { useState } from 'react';

function Host({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);
    const [duration, setDuration] = useState(0);
    const [finalTimer, setFinalTimer] = useState(0);

    const [finalQuestionSelectedIndex, setFinalQuestionSelectedIndex] = useState(null);

    socket.on('appInit', (state) => {
        setState(state);
        setAppInitiated(true);
    });

    socket.on('stateUpdate', (state) => {
        setState(state);
    });

    socket.on('startFinalTimer', (duration) => {
        setFinalTimer(duration);
    });

    socket.on('finalTimerUpdate', (duration) => {
        setFinalTimer(duration);
    });

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
                    {state.isFinal ? (
                        <div className="final-host-container">
                            <div className="final-timer-container">
                                <div>
                                    <h2>Démarrer une manche</h2>
                                    <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Durée de la manche (en secondes)" />
                                    <div>
                                        <button className="button" onClick={() => socket.emit('startFinal', duration)} disabled={duration === 0}>Démarrer</button>
                                        <button className="button" onClick={() => socket.emit('pauseFinalTimer')}>Pause</button>
                                        <button className="button" onClick={() => socket.emit('resumeFinalTimer')}>Reprendre</button>
                                    </div>
                                </div>
                                <div className="final-timer">{finalTimer}</div>
                            </div>
                            <div className="final-questions-container">
                                <div>
                                    <h2>Questions</h2>
                                    <ul className="final-questions">
                                        {state.finalQuestions.map((question, questionIndex) => (
                                            <li className="final-question" key={questionIndex}>
                                                <p onClick={() => setFinalQuestionSelectedIndex(questionIndex)} className="final-question-text">{question.text}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h2>Réponses</h2>
                                    {finalQuestionSelectedIndex !== null && state.finalQuestions[finalQuestionSelectedIndex].answers.map((answer, answerIndex) => (
                                        <div className="final-answer" key={answerIndex}>
                                            {
                                                state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerFirstRunIndex === answerIndex
                                                    ? <button className="button" disabled>1</button>
                                                    : state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerFirstRunIndex !== null
                                                        ? <span></span>
                                                        : <button
                                                            className="button"
                                                            disabled={state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerFirstRunIndex !== null}
                                                            onClick={() => socket.emit('revealFinalQuestionFirstRun', { questionIndex: finalQuestionSelectedIndex, answerIndex })}
                                                        >1</button>
                                            }
                                            <span> {answer.text} - {answer.points} </span>
                                            {
                                                state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerSecondRunIndex === answerIndex
                                                    ? <button className="button" disabled>2</button>
                                                    : state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerSecondRunIndex !== null
                                                        ? <span></span>
                                                        : <button
                                                            className="button"
                                                            disabled={state.finalQuestions[finalQuestionSelectedIndex].revealedAnswerSecondRunIndex !== null}
                                                            onClick={() => socket.emit('revealFinalQuestionSecondRun', { questionIndex: finalQuestionSelectedIndex, answerIndex })}
                                                        >2</button>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="question">{state.questions[state.currentQuestion].text}</h2>
                            <button className="button show-question-button" disabled={state.questions[state.currentQuestion].revealed} onClick={() => socket.emit('showQuestion')}>Afficher la question</button>
                            <ul className="answers">
                                {state.questions[state.currentQuestion].answers.map((answer, index) => (
                                <li className="host-answer" key={index}>
                                    <span>{answer.text} - {answer.points}</span>
                                    {answer.revealed ? <span>Révélé</span> : <button className="button" onClick={() => socket.emit('answerReveal', index)}>Révéler</button>}
                                </li>
                                ))}
                            </ul>
                            <div className="wrong-guesses">
                                {Array.from({ length: state.questions[state.currentQuestion].wrongGuess }).map((_, index) => (
                                    <p className="wrong-guess" key={index}>X</p>
                                ))}
                            </div>
                            <div>
                                <p>Question {state.currentQuestion + 1} / {state.questions.length}</p>
                                <button className="button" onClick={() => socket.emit('previousQuestion')} disabled={state.currentQuestion === 0}>&lt;</button>
                                <button className="button" onClick={() => socket.emit('nextQuestion')} disabled={state.currentQuestion === state.questions.length - 1}>&gt;</button>
                                <button className="button" onClick={() => socket.emit('wrongGuess')} disabled={state.questions[state.currentQuestion].wrongGuess > 2}>X</button>
                            </div>
                        </div>
                    )}    
                    <div className="game-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                        {state.isFinal ? (
                            <p className="score">{state.finalPoints}</p>
                        ) : (
                            <p className="score score-host">{state.points}/{state.questions.reduce((acc, question, index) => {
                                if(index < 3){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0);
                                }else if(index === 3){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0) * 2;
                                }else if(index === 4){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0) * 3;
                                } else {
                                    return acc;
                                }
                            }, 0)}</p>
                        )}
                        <div className="buttons">
                            {state.isFinal ? (
                                <button className="button" onClick={() => socket.emit('deactivateFinal')}>Désactiver la finale</button>
                            ) : (
                                <button className="button" onClick={() => socket.emit('activateFinal')}>Activer la finale</button>
                            )}
                            <button className="button" onClick={() => socket.emit('startCredits')}>Jouer Générique</button>
                            <button className="button" onClick={() => socket.emit('stopCredits')}>Arrêter Générique</button>
                            <button className="button" onClick={() => socket.emit('resetGame')}>Réinitialiser le jeu</button>
                        </div>
                    </div>                 
                </div>
            )}
        </>
    );
}

export default Host;