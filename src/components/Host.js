import { useState } from 'react';

function Host({ socket }) {
    const [appInitiated, setAppInitiated] = useState(false);
    const [state, setState] = useState(null);

    socket.on('appInit', (state) => {
        setState(state);
        setAppInitiated(true);
    });

    socket.on('stateUpdate', (state) => {
        setState(state);
    });

    return (
        <>
            {appInitiated && (
                <div className="global-container">
                    <div>
                        <h2 className="question">{state.questions[state.currentQuestion].text}</h2>
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
                        <button className="button" onClick={() => socket.emit('wrongGuess')} disabled={state.questions[state.currentQuestion].wrongGuess > 2}>X</button>
                    </div>
                    <div className="game-container">
                        <h1 className="title">UNE<br/><span className="title-span">NADINE</span><br/>EN OR</h1>
                        <p className="score">{state.points}</p>
                        <div className="buttons">
                            <button className="button" onClick={() => socket.emit('previousQuestion')} disabled={state.currentQuestion === 0}>Question précédente</button>
                            <button className="button" onClick={() => socket.emit('nextQuestion')} disabled={state.currentQuestion === state.questions.length - 1}>Question suivante</button>
                            <button className="button" onClick={() => socket.emit('resetGame')}>Réinitialiser le jeu</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Host;