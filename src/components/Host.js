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
        <div>
            <h2>Host</h2>
            {appInitiated && (
                <>
                    <p>Points: {state.points}</p>
                    <h2>{state.questions[state.currentQuestion].text}</h2>
                    <ul>
                        {state.questions[state.currentQuestion].answers.map((answer, index) => (
                        <li key={index}>
                            <span>{answer.text} - {answer.points}</span>
                            {answer.revealed ? null : <button onClick={() => socket.emit('answerReveal', index)}>Révéler</button>}
                        </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Wrong Guesses</h3>
                        {Array.from({ length: state.questions[state.currentQuestion].wrongGuess }).map((_, index) => (
                            <p key={index}>X</p>
                        ))}
                    </div>
                    <button onClick={() => socket.emit('previousQuestion')} disabled={state.currentQuestion === 0}>Previous Question</button>
                    <button onClick={() => socket.emit('nextQuestion')} disabled={state.currentQuestion === state.questions.length - 1}>Next Question</button>
                    <button onClick={() => socket.emit('wrongGuess')}>X</button>
                    <button onClick={() => socket.emit('resetGame')}>Reset Game</button>
                </>
            )}
        </div>
    );
}

export default Host;