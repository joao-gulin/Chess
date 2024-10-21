import React from 'react';

interface GameControlsProps {
    onReset: () => void;
    onUndo: () => void;
    isUndoDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onUndo, isUndoDisabled }) => {
    return (
        <div>
            <button onClick={onReset}>Reset Game</button>
            <button onClick={onUndo} disabled={isUndoDisabled}>Undo</button>
        </div>
    )
}

export default GameControls;