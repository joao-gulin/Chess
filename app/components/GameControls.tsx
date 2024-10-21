import React from 'react';

interface GameControlsProps {
    onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset }) => {
    return (
        <div>
            <button onClick={onReset}>Reset Game</button>
        </div>
    )
}

export default GameControls;