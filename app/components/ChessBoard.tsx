'use client'
import React, { useEffect, useState } from "react";
import { Chessboard } from 'react-chessboard';
import { chessService } from "@/app/services/chessService";
import { Square } from 'chess.js'
import styles from '@/app/styles/ChessBoard.module.css'; // Import your CSS module

const ChessBoard: React.FC = () => {
    const [fen, setFen] = useState<string>('start');
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [availableMoves, setAvailableMoves] = useState<Square[]>([]);
    const [resetting, setResetting] = useState<boolean>(false);

    useEffect(() => {
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
        if (selectedSquare && availableMoves.includes(to)) {
            const newFen = chessService.move(selectedSquare, to);
            if (newFen) {
                setFen(newFen);
                setTimeout(() => {
                    makeRandomAIMove();
                }, 500);
            }
            return true;
        }
    };

    const makeRandomAIMove = () => {
        const possibleMoves = chessService.getGame().moves({ verbose: true });
        if (possibleMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const randomMove = possibleMoves[randomIndex];
            chessService.move(randomMove.from, randomMove.to);
            setFen(chessService.getBoard());
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
    };

    return (
        <div>
            <Chessboard
                position={fen}
                boardWidth={400}
                customSquareStyles={{
                    // Apply styles for available moves
                    ...(availableMoves.reduce((acc, move) => {
                        acc[move] = {
                            backgroundColor: 'transparent', // Make the background transparent
                            position: 'relative', // Ensure relative positioning for the dot
                            backgroundImage: 'radial-gradient(circle, rgba(105, 105, 105, 1) 30%, rgba(105, 105, 105, 0) 70%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        };
                        return acc;
                    }, {} as Record<string, React.CSSProperties>)),
                    ...(selectedSquare ? { [selectedSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.5)', position: 'relative' } } : {}), // Yellow highlight for selected piece
                }}
                onSquareClick={(square) => {
                    if (availableMoves.includes(square)) {
                        handleMove(square);
                    } else {
                        handlePieceClick(square);
                    }
                }}
            />
            <button onClick={resetGame}>Reset Game</button>
            {resetting && <div className="reset-animation">Resetting...</div>}
        </div>
    );
};

export default ChessBoard;