import React from 'react';
import { PieceSymbol } from 'chess.js';
import PawnPromotionModal from './PawnPromotionModal';

interface StatusBoardProps {
    playerMoves: string[];
    computerMoves: string[];
    isPromoting: boolean;
    onPromote: (piece: PieceSymbol) => void;
}

const StatusBoard: React.FC<StatusBoardProps> = ({ playerMoves, computerMoves, isPromoting, onPromote }) => {
    return (
        <div className="status-board">
            <div className="move-list">
                <h3>Player Moves</h3>
                <ul>
                    {playerMoves.map((move, index) => (
                        <li key={`player-${index}`}>{move}</li>
                    ))}
                </ul>
            </div>
            <div className="move-list">
                <h3>Computer Moves</h3>
                <ul>
                    {computerMoves.map((move, index) => (
                        <li key={`computer-${index}`}>{move}</li>
                    ))}
                </ul>
            </div>
            <PawnPromotionModal
                isOpen={isPromoting}
                onClose={() => {}} // This can be used to cancel the promotion if needed
                onPromote={onPromote}
            />
        </div>
    );
};

export default StatusBoard;