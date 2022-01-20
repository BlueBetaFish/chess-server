import express, { Request, Response, NextFunction } from 'express';
import { StockFishInstance } from "./utils/Stockfish";

const app = express();
const PORT = 4000;

const stockFishInstance = new StockFishInstance();

app.use(express.json()) // for parsing application/json

app.post('/bestmove' , getBestmove);

app.listen(PORT, () => {
    console.log(`Express app running on port ${PORT}`);
});


function getBestmove(request: Request, response: Response, next: NextFunction) {
    const body = request.body;
    console.log(request.body);
    stockFishInstance.bestMoveRequest({
        FEN: body.FEN,
        depth: 10,
        callback(bestmove: string) {
            response.send(bestmove);
        }
    });    
}



// stockFishInstance.bestMoveRequest({
//     FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
//     depth: 10,
//     callback(bestmove: string) {
//         console.log(bestmove);
//     }
// })

// stockFishInstance.bestMoveRequest({
//     FEN:  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
//     depth: 10,
//     callback(bestmove: string) {
//         console.log(bestmove);
//     }
// })

// stockFishInstance.bestMoveRequest({
//     FEN: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
//     depth: 10,
//     callback(bestmove: string) {
//         console.log(bestmove);
//     }
// })

// stockFishInstance.bestMoveRequest({
//     FEN: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
//     depth: 10,
//     callback(bestmove: string) {
//         console.log(bestmove);
//     }
// })