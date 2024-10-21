'use client'
import React, { useEffect, useState } from "react";
import { Chessboard } from 'react-chessboard';
import { chessService } from "@/app/services/chessService";
import { Square } from "chess.js";

const ChessBoard: React.FC = () => {
    const [fen, setFen] = useState<string>('start');
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [avaibleMoves, setAvailableMoves] = useState<Square[]>([]);
    const [resetting, setResetting] = useState<boolean>(false);

    useEffect(() => {
        // Set the initial board state using FEN
        setFen(chessService.getBoard());
    }, []);

    const handlePieceClick = (square: Square) => {
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setAvailableMoves([]);
        } else {
            const moves: string[] = chessService.getAvaibleMoves(square);
            const squareMoves: Square[] = moves.map(move => move as Square);

            setSelectedSquare(square);
            setAvailableMoves(squareMoves);
        }
    };

    const handleMove = (to: Square) => {
        if (selectedSquare && avaibleMoves.includes(to)) {
            // Move the piece and get the new FEN
            const newFen = chessService.move(selectedSquare, to);
            if (newFen) {
                setFen(newFen); // Update the board with the new FEN
                setTimeout(() => {
                    const aiFen = chessService.aiMove();
                    if (aiFen) {
                        setFen(aiFen);
                    }
                }, 1000)
            }
            return true; // Return true to indicate the move was successful
        }
    };

    const resetGame = () => {
        setResetting(true);
        setTimeout(() => {
            chessService.resetGame();
            setFen('start');
            setSelectedSquare(null);
            setAvailableMoves([]);
            setResetting(false);
        }, 300);
    }

    return (
        <div>
            <Chessboard
                position={fen}
                boardWidth={400}
                customSquareStyles={{
                    // Highlight available moves
                    ...(avaibleMoves.reduce((acc, move) => {
                        acc[move] = { backgroundColor: 'rgba(0, 255, 0, 0.3)' }; // Green highlight for available moves
                        return acc;
                    }, {} as Record<string, React.CSSProperties>)),
                    ...(selectedSquare ? { [selectedSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.5)' } } : {}), // Yellow highlight for selected piece
                }}
                onSquareClick={(square) => {
                    if (avaibleMoves.includes(square)) {
                        handleMove(square);
                    } else {
                        handlePieceClick(square);
                    }
                }} // Handle clicks on squares
            />
            <button onClick={resetGame}>Reset Game</button>
            {resetting && <div className="reset-animation">Resetting...</div> }
        </div>
    );
};

export default ChessBoard;