'use client'
import React, { useEffect, useState } from "react";
import { Chessboard } from 'react-chessboard';
import { chessService } from "@/app/services/chessService";
import StatusBoard from './StatusBoard';
import GameControls from "@/app/components/GameControls";
import "@/app/styles/chessboard.css"

type Square = string; // Ensure that Square is defined as a string

const ChessBoard: React.FC = () => {
    const [fen, setFen] = useState<string>('start');
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [availableMoves, setAvailableMoves] = useState<Square[]>([]);
    const [resetting, setResetting] = useState<boolean>(false);
    const [playerMoves, setPlayerMoves] = useState<string[]>([]);
    const [computerMoves, setComputerMoves] = useState<string[]>([]);

    useEffect(() => {
        setFen(chessService.getBoard());
    }, []);

   const handlePieceClick = (square: Square) => {
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setAvailableMoves([]);
        } else {
            const moves: string[] = chessService.getAvaibleMoves(square);
            const squareMoves: Square[] = moves.map(move => move as Square); // Ensure moves are treated as Square

            setSelectedSquare(square);
            setAvailableMoves(squareMoves);
        }
    };

    const handleMove = (to: Square) => {
        if (selectedSquare && availableMoves.includes(to)) {
            const newFen = chessService.move(selectedSquare, to);
            if (newFen) {
                setFen(newFen);
                setPlayerMoves(prev => [...prev, `${selectedSquare}-${to}`]); // Log player move
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
            setComputerMoves(prev => [...prev, `${randomMove.from}-${randomMove.to}`]); // Log computer move
        }
    };

    const resetGame = () => {
        setResetting(true);
        setTimeout(() => {
            chessService.resetGame();
            setFen('start');
            setSelectedSquare(null);
            setAvailableMoves([]);
            setPlayerMoves([]);
            setComputerMoves([]);
            setResetting(false);
        }, 300);
    };

    return (
        <div className="chessboard-container">
            <div className="chessboard-wrapper">
                <Chessboard
                    position={fen}
                    boardWidth={450}
                    customSquareStyles={{
                        ...(availableMoves.reduce((acc, move) => {
                            acc[move] = {
                                backgroundColor: 'transparent',
                                position: 'relative',
                                backgroundImage: 'radial-gradient(circle, rgba(105, 105, 105, 0.8) 50%, rgba(105, 105, 105, 0) 50%)',
                                backgroundSize: '100%',
                            };
                            return acc;
                        }, {} as { [key: string]: React.CSSProperties })),
                        ...(selectedSquare) ? { [selectedSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.5)', position: 'relative' } } : {},
                    }}
                    onSquareClick={(square) => {
                        if (availableMoves.includes(square)) {
                        handleMove(square);
                        } else {
                        handlePieceClick(square);
                        }
                    }}
                />
                <div className="status-container">
                    <StatusBoard playerMoves={playerMoves} computerMoves={computerMoves} />
                    <div className="button-container">
                        <GameControls onReset={resetGame} />
                        {resetting && <div className="reset-animation"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;