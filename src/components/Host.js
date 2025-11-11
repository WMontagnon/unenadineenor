import { useState } from 'react';

function Host({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);
    const [duration, setDuration] = useState(0);
    const [finalTimer, setFinalTimer] = useState(0);

    const [finalQuestionExpandedIndex, setFinalQuestionExpandedIndex] = useState([]);

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
                        <div>
                            <div>
                                <h2>Démarrer une manche</h2>
                                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Durée de la manche (en secondes)" />
                                <button className="button" onClick={() => socket.emit('startFinal', duration)} disabled={duration === 0}>Démarrer</button>
                            </div>
                            <p>Temps restant : {finalTimer} secondes</p>
                            <button className="button" onClick={() => socket.emit('pauseFinalTimer')}>Pause</button>
                            <button className="button" onClick={() => socket.emit('resumeFinalTimer')}>Reprendre</button>
                            <div>
                                <h2>Questions <button className="button" onClick={() => setFinalQuestionExpandedIndex([])}>Tout replier</button></h2>
                                <ul className="">
                                    {state.finalQuestions.map((question, questionIndex) => (
                                        <li className="" key={questionIndex}>
                                            <p>{question.text} <button className="button" onClick={() => setFinalQuestionExpandedIndex(finalQuestionExpandedIndex.includes(questionIndex) ? finalQuestionExpandedIndex.filter((index) => index !== questionIndex) : [...finalQuestionExpandedIndex, questionIndex])}>{finalQuestionExpandedIndex.includes(questionIndex) ? 'Réduire' : 'Déplier'}</button></p>
                                            {finalQuestionExpandedIndex.includes(questionIndex) && ( 
                                                <ul>
                                                    {question.answers.map((answer, answerIndex) => (
                                                        <li key={answerIndex}>
                                                            <p>
                                                                {answer.text} - {answer.points} / 
                                                                &nbsp;{question.revealedAnswerFirstRunIndex === answerIndex ? 1 : <button className="button" disabled={question.revealedAnswerSecondRunIndex === answerIndex} onClick={() => socket.emit('revealFinalQuestionFirstRun', { questionIndex, answerIndex })}>1</button>}
                                                                &nbsp;{question.revealedAnswerSecondRunIndex === answerIndex ? 2 : <button className="button" disabled={question.revealedAnswerFirstRunIndex === answerIndex} onClick={() => socket.emit('revealFinalQuestionSecondRun', { questionIndex, answerIndex })}>2</button>}
                                                            </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="question">{state.questions[state.currentQuestion].text}</h2>
                            <button className="button" disabled={state.questions[state.currentQuestion].revealed} onClick={() => socket.emit('showQuestion')}>Afficher la question</button>
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
                            <p className="score">{state.points}/{state.questions.reduce((acc, question, index) => {
                                if(index < 3){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0);
                                }else if(index === 3){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0) * 2;
                                }else if(index === 4){
                                    return acc + question.answers.reduce((acc, answer) => acc + answer.points, 0) * 3;
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