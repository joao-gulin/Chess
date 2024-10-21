import { Chess, Square, Move, Piece } from 'chess.js';

class ChessService {
    private game: Chess;

    constructor() {
        this.game = new Chess();
    }

    getGame(): Chess {
        return this.game;
    }

    getBoard(): string {
        return this.game.fen();
    }

    move(from: Square, to: Square, promotion?: string): string | null {
        const move = this.game.move({ from, to, promotion });
        return move ? this.game.fen() : null;
    }

    resetGame(): void {
        this.game.reset();
    }

    getGameStatus(): string {
        return this.game.isGameOver() ? 'Game Over' : 'In Progress';
    }

    getAvailableMoves(square: Square): Square[] {
        const moves = this.game.moves({ square, verbose: true }) as Move[];
        return moves.map(move => move.to as Square);
    }

    makeRandomMove(): Move | null {
        const moves = this.game.moves({ verbose: true }) as Move[];
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            this.game.move(randomMove);
            return randomMove;
        }
        return null;
    }

    isPromotion(from: Square, to: Square): boolean {
        const piece: Piece | null = this.game.get(from);
        const isPawn = piece?.type === 'p';

        if (isPawn) {
            const isWhite = piece.color === 'w';
            const promotionRank = isWhite ? '8' : '1';
            return to.endsWith(promotionRank);
        }

        return false;
    }
}

export const chessService = new ChessService();