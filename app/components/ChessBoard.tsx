'use client'
import React, { useEffect, useState, useCallback } from "react";
import { Chessboard } from 'react-chessboard';
import { chessService } from "@/app/services/chessService";
import StatusBoard from './StatusBoard';
import GameControls from "@/app/components/GameControls";
import "@/app/styles/chessboard.css";
import { Square, PieceSymbol } from 'chess.js';

type ChessMove = `${Square}-${Square}`;

interface GameState {
    fen: string;
    selectedSquare: Square | null;
    availableMoves: Square[];
    playerMoves: ChessMove[];
    computerMoves: ChessMove[];
    isResetting: boolean;
    gameStatus: string;
    isPromoting: boolean;
    promotionSquare: Square | null;
}

const BOARD_WIDTH = 450;
const AI_MOVE_DELAY = 500;

const ChessBoard: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        fen: chessService.getBoard(),
        selectedSquare: null,
        availableMoves: [],
        playerMoves: [],
        computerMoves: [],
        isResetting: false,
        gameStatus: '',
        isPromoting: false,
        promotionSquare: null,
    });

    useEffect(() => {
        updateGameState({ gameStatus: chessService.getGameStatus() });
    }, [gameState.fen]);

    const updateGameState = useCallback((updates: Partial<GameState>) => {
        setGameState(prev => ({ ...prev, ...updates }));
    }, []);

    const handlePieceClick = useCallback((square: Square) => {
        const moves = chessService.getAvailableMoves(square);

        if (moves.length > 0) {
            // Valid piece selected
            if (gameState.selectedSquare === square) {
                // Deselect if the same square is clicked
                updateGameState({ selectedSquare: null, availableMoves: [] });
            } else {
                // Select new square and show available moves
                updateGameState({ selectedSquare: square, availableMoves: moves });
            }
        } else {
            // Invalid selection or empty square, clear any previous selection
            updateGameState({ selectedSquare: null, availableMoves: [] });
        }
    }, [gameState.selectedSquare, updateGameState]);


    const handleMove = useCallback((from: Square, to: Square) => {
        const isPromotion = chessService.isPromotion(from, to);

        if (isPromotion) {
            updateGameState({ isPromoting: true, promotionSquare: to });
            return false; // Don't make the move yet, wait for promotion
        }

        const newFen = chessService.move(from, to);
        if (newFen) {
            const newMove: ChessMove = `${from}-${to}`;
            updateGameState({
                fen: newFen,
                playerMoves: [...gameState.playerMoves, newMove],
                selectedSquare: null,
                availableMoves: []
            });
            setTimeout(makeRandomAIMove, AI_MOVE_DELAY);
            return true;
        }

        return false;
    }, [gameState, updateGameState]);

    const handlePromotion = useCallback((piece: PieceSymbol) => {
        if (gameState.promotionSquare && gameState.selectedSquare) {
            // Pass the promotion piece ('q', 'r', 'b', 'n') when making the move
            const newFen = chessService.move(gameState.selectedSquare, gameState.promotionSquare, piece);
            if (newFen) {
                const newMove: ChessMove = `${gameState.selectedSquare}-${gameState.promotionSquare}=${piece.toUpperCase()}`;
                updateGameState({
                    fen: newFen,
                    playerMoves: [...gameState.playerMoves, newMove],
                    selectedSquare: null,
                    availableMoves: [],
                    isPromoting: false,
                    promotionSquare: null
                });
                setTimeout(makeRandomAIMove, AI_MOVE_DELAY);
            }
        }
    }, [gameState, updateGameState]);


    const makeRandomAIMove = useCallback(() => {
        const move = chessService.makeRandomMove();
        if (move) {
            let newMove: ChessMove = `${move.from}-${move.to}`;
            if (move.promotion) {
                newMove += `=${move.promotion.toUpperCase()}`;
            }
            updateGameState({
                fen: chessService.getBoard(),
                computerMoves: [...gameState.computerMoves, newMove]
            });
        }
    }, [gameState.computerMoves, updateGameState]);

    const customSquareStyles = () => {
        const styles: { [key: string]: React.CSSProperties } = {};

        // Highlight the selected square
        if (gameState.selectedSquare) {
            styles[gameState.selectedSquare] = {
                backgroundColor: 'rgba(255, 255, 0, 0.4)' // yellowish background
            };
        }

        // Highlight available moves
        gameState.availableMoves.forEach((move) => {
            styles[move] = {
                backgroundColor: 'rgba(0, 255, 0, 0.4)' // greenish background for available moves
            };
        });

        // Optionally highlight squares for last move
        // styles["e2"] = { backgroundColor: 'rgba(255, 0, 0, 0.4)' }; // Example of a specific square

        return styles;
    };

    const resetGame = useCallback(() => {
        // Reset the game state to initial values
        chessService.resetGame();
        updateGameState({
            fen: chessService.getBoard(),  // Resets the chessboard to its starting position
            selectedSquare: null,
            availableMoves: [],
            playerMoves: [],
            computerMoves: [],
            isResetting: true,
            gameStatus: 'New Game',
            isPromoting: false,
            promotionSquare: null,
        });

        // Reset the resetting animation after a short delay
        setTimeout(() => {
            updateGameState({ isResetting: false });
        }, 1000); // Adjust delay as needed
    }, [updateGameState]);

    return (
        <div className="chessboard-container">
            <div className="chessboard-wrapper">
                <Chessboard
                    position={gameState.fen}
                    boardWidth={BOARD_WIDTH}
                    customSquareStyles={customSquareStyles()}
                    onSquareClick={(square: Square) => {
                        if (gameState.selectedSquare && gameState.availableMoves.includes(square)) {
                            handleMove(gameState.selectedSquare, square);
                        } else {
                            handlePieceClick(square);
                        }
                    }}
                />
                <div className="status-container">
                    <StatusBoard
                        playerMoves={gameState.playerMoves}
                        computerMoves={gameState.computerMoves}
                        isPromoting={gameState.isPromoting}
                        onPromote={handlePromotion}
                    />
                    <div className="button-container">
                        <GameControls onReset={resetGame} />
                        {gameState.isResetting && <div className="reset-animation"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;