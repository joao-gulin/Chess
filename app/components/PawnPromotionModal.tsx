import React from 'react';
import { PieceSymbol } from 'chess.js';

interface PawnPromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPromote: (piece: PieceSymbol) => void;
}

const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({ isOpen, onClose, onPromote }) => {
    if (!isOpen) return null;

    const promotionPieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Choose promotion piece</h2>
                <div className="promotion-options">
                    {promotionPieces.map((piece) => (
                        <button key={piece} onClick={() => onPromote(piece)}>
                            {getPieceSymbol(piece)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

function getPieceSymbol(piece: PieceSymbol): string {
    const symbols: Record<PieceSymbol, string> = {
        'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔'
    };
    return symbols[piece];
}

export default PawnPromotionModal;