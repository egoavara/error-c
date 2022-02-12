"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flattening_1 = require("./flattening");
function generator(define, mode, handler) {
    const result = (0, flattening_1.letflat)(define);
    return (k, c) => {
        const ik = (typeof k !== "string" ? `${k}` : k);
        return handler(result[ik][mode].build(c), k);
    };
}
exports.default = generator;
//# sourceMappingURL=lib.js.map