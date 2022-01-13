import { StockFishInstance } from "./utils/Stockfish";

const stockFishInstance = new StockFishInstance();

stockFishInstance.bestMoveRequest({
    FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    depth: 10,
    callback(bestmove: string) {
        console.log(bestmove);
    }
})

stockFishInstance.bestMoveRequest({
    FEN:  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    depth: 10,
    callback(bestmove: string) {
        console.log(bestmove);
    }
})

stockFishInstance.bestMoveRequest({
    FEN: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
    depth: 10,
    callback(bestmove: string) {
        console.log(bestmove);
    }
})

stockFishInstance.bestMoveRequest({
    FEN: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    depth: 10,
    callback(bestmove: string) {
        console.log(bestmove);
    }
})