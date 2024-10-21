import { Chess, Square } from 'chess.js';

class ChessService {
    private game: Chess;
    private moveHistory: string[];
    private currentHistoryIndex: number;

    constructor() {
        this.game = new Chess();
        this.moveHistory = [];
        this.currentHistoryIndex = -1;
    }

    getBoard(): string {
        return this.game.fen();
    }

    move(from: Square, to: Square) {
        const move = this.game.move({ from, to});
        if (move) {
            this.updateHistory(this.game.fen());
            return this.game.fen();
        }
        return null;
    }

    resetGame() {
        this.game.reset();
        this.moveHistory = [];
        this.currentHistoryIndex = -1
    }

    getAvaibleMoves(square: Square): Square[] {
        const piece = this.game.get(square);
        if (!piece) return [];

        return this.game.moves({ square, verbose: true }).map(move => move.to as Square);
    }

    getAllAvaibleMoves(): { from: Square; to: Square }[] {
        return this.game.SQUARES.reduce((moves: { from: Square; to: Square }[], square: Square) => {
            const availableMoves = this.getAvaibleMoves(square);
            availableMoves.forEach(to => moves.push({ from: square, to }));
            return moves;
        }, []);
    }

    undoMove(): string | null {
        if ( this.currentHistoryIndex > 0 ) {
            this.currentHistoryIndex--;
            this.game.load(this.moveHistory[this.currentHistoryIndex]);
            return this.getBoard();
        }
        return null;
    }

    aiMove(): string | null {
        const possibleMoves = this.game.moves();

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const move = this.game.move(possibleMoves[randomIndex]);
        if (move) {
            this.updateHistory(this.game.fen());
            return this.game.fen();
        }
        return null
    }


    private updateHistory(fen: string) {
        this.moveHistory = this.moveHistory.slice(0, this.currentHistoryIndex + 1);
        this.moveHistory.push(fen);
        this.currentHistoryIndex++;
    }
}

export const chessService = new ChessService();