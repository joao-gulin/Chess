import React from 'react';

interface StatusBoardProps {
    playerMoves: string[];
    computerMoves: string[];
}

const StatusBoard: React.FC<StatusBoardProps> = ({ playerMoves, computerMoves }) => {
    return (
        <div style={{ marginLeft: '20px', width: '200px' }}>
            <h3>Move History</h3>
            <h4>Player Moves:</h4>
            <ul>
                {playerMoves.map((move, index) => (
                    <li key={index}>{move}</li>
                ))}
            </ul>
            <h4>Computer Moves:</h4>
            <ul>
                {computerMoves.map((move, index) => (
                    <li key={index}>{move}</li>
                ))}
            </ul>
        </div>
    )
}

export default StatusBoard;