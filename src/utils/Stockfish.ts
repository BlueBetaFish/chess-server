import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Queue } from "./Queue";
import  dotenv from "dotenv";
dotenv.config();

// path of stockfish executable for win_x64
// const STOCKFISH_EXECUTABLE_PATH_WIN: string = "stockfish/win_x64/stockfish_win_x64.exe";

// path of stockfish executable for linux_x64
// const STOCKFISH_EXECUTABLE_PATH_LINUX: string = "stockfish/linux_x64/stockfish_linux_x64";

const STOCKFISH_EXEC_PATH = process.env.STOCKFISH_EXEC_PATH;
// line seperator to split output of engine
const LINE_SEPERATOR = "\n";

/**
 * enum StockfishEngineStatus represents the status of
 * the Stockfish instance. 
 * CREATED impiles the process has been created but 
 * "readyok" as a reply to "isready" has not yet been read.
 * READY implies "readyok" as a reply to "isready" has been
 * read and engine is ready to process requests
 * CLOSED implies the engine process has been closed and
 * the engine cannot process any request  
 */
enum StockfishEngineStatus {
    CREATED,
    READY,
    CLOSED,
}


/**
 * BestMoveCallback is a callback function provided by the
 * client of the engine, which is called with the bestmove
 * as argument when the engine has decided on a bestmove
 */
type BestMoveCallback = (bestMove: string) => void;


/**
 * structure for a bestmove request
 * FEN represents the FEN string, depth is the search depth
 * and callback is called with the bestmove as arg once the
 * engine has decided on a bestmoce
 */
type BestMoveRequest = {
    FEN: string;
    depth: number;
    callback: BestMoveCallback;
}


/**
 * class StockFishInstance represents a single instance of 
 * Stockfish engine. Bestmove for a given FEN string can be
 * requested using bestMoveRequest method.
 * Assuming FEN string of request is correct
 * TODO: handle errors.
 */
export class StockFishInstance {
    private stockfishProcess: ChildProcessWithoutNullStreams;  
    private stockfishEngineStatus: StockfishEngineStatus;
    private bestMoveRequestQueue: Queue<BestMoveRequest>;
    private currentBestMoveRequest: BestMoveRequest;
    private bestMoveRequestOngoing: boolean;

    constructor() {
        // create a process from stockfish executable
        this.bestMoveRequestOngoing = false;
        this.bestMoveRequestQueue = new Queue<BestMoveRequest>();
        this.stockfishProcess = spawn(STOCKFISH_EXEC_PATH);
        console.log("path", STOCKFISH_EXEC_PATH);
        this.stockfishEngineStatus = StockfishEngineStatus.CREATED;

        console.log("called spawn");

        this.stockfishProcess.on("err", (err) => {
            console.log("error", err);
        })
 
        this.stockfishProcess.on("close", (code: number) => {
            this.stockfishEngineStatus = StockfishEngineStatus.CLOSED;
            console.log("Stockfish Exit code:", code);
        });

        this.stockfishProcess.stdout.on("data", (data) => {
            
            const lines = data.toString().replace("\r", "").split(LINE_SEPERATOR);
            console.log(lines);
            for (const line of lines) {
                const words = line.split(" ");
                if (words.length < 1) continue;
                switch (words[0]) {
                    case "readyok":
                        console.log("Stockfish instance ready");
                        this.stockfishEngineStatus = StockfishEngineStatus.READY;
                        this.consumeRequest();
                        break;
                    case "bestmove":
                        console.log("engine responded with bestmove");
                        this.currentBestMoveRequest.callback(words[1]);
                        this.bestMoveRequestOngoing = false;
                        this.consumeRequest();
                        break;
                    default: 
                        break;
                }
            }
        });

        this.stockfishProcess.stdin.write("isready\n");

    }

    bestMoveRequest(request: BestMoveRequest): void {
        console.log("received request", request);
        // TODO: check if "fen-like" or not
        // if not a fen-like string stockfish encounters a seg fault
        this.bestMoveRequestQueue.enqueue(request);
        this.consumeRequest();
    }

    private consumeRequest() {
        if (
            this.stockfishEngineStatus !== StockfishEngineStatus.READY ||
            this.bestMoveRequestOngoing ||
            this.bestMoveRequestQueue.isEmpty()
        ) return;

        this.bestMoveRequestOngoing = true;
        this.currentBestMoveRequest = this.bestMoveRequestQueue.dequeue();

        console.log("consuming request", this.currentBestMoveRequest);
        
        this.stockfishProcess.stdin.write(
            `ucinewgame\n`+
            `position fen ${this.currentBestMoveRequest.FEN}\n`
            + `go depth ${this.currentBestMoveRequest.depth}\n`
        );
    }

}