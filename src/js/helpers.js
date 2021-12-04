// Reusable functions
import { TIMEOUT_SECONDS } from "./config";
import { state } from "./model";

export const timeout = function(fn, seconds = 1) {
    return new Promise((resolve, _) => {
        setTimeout(function() {
            resolve(fn());
        }, seconds * 1000);
        // setTimeout(fn, seconds * 1000);
    });
};

export const getActivePlayer = function() {
    return state.cpu.isActivePlayer ? 'cpu' : 'player1';
};

export const getOpponent = function() {
    return state.cpu.isActivePlayer ? 'player1' : 'cpu';
};