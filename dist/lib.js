"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generator(define, mode, handler) {
    return (k, c) => {
        const data = define[k];
        let message;
        if (typeof data !== "string") {
            if (mode === "release") {
                message = data.release;
            }
            else {
                message = data.debug;
            }
        }
        else {
            message = data;
        }
        for (const found of message.matchAll(/\$\{\s*([^}\s:]+)(\s*:\s*[^}]+)?\s*}/g)) {
            // @ts-expect-error
            message = message.replace(found[0], `${c[found[1]]}`);
        }
        return handler(message, k);
    };
}
exports.default = generator;
//# sourceMappingURL=lib.js.map