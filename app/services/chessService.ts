import { Chess, Square } from 'chess.js';

class ChessService {
    private game: Chess;

    constructor() {
        this.game = new Chess();
    }

    getBoard(): string {
        return this.game.fen();
    }

    move(from: string, to: string) {
        const move = this.game.move({ from, to });
        return move ? this.game.fen() : null;
    }

    resetGame() {

        return this.game.reset();
    }

    getGameStatus() {
        return this.game.isGameOver() ? 'Game Over' : 'In Progress';
    }

    getAvaibleMoves(square: string): string[] {
        const piece = this.game.get(square);
        if (!piece) return [];

        const moves = this.game.moves({
            square,
            verbose: true,
        });

        return moves.map(move => move.to);
    }
}

export const chessService = new ChessService();