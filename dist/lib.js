"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageBuilder {
    constructor(message) {
        this.base = [];
        let start = 0;
        for (const found of message.matchAll(/\$\{\s*([^}\s:]+)(\s*:\s*[^}]+)?\s*}/g)) {
            this.base.push(message.slice(start, found.index));
            this.base.push({ key: found[1] });
            start = (found.index ?? start) + found[0].length;
        }
        if (start !== message.length) {
            this.base.push(message.slice(start));
        }
    }
    build(context) {
        return this.base
            .map((v) => {
            if (typeof v === "string") {
                return v;
            }
            else {
                const rep = context[v.key];
                if (typeof rep === "object") {
                    return JSON.stringify(rep);
                }
                else if (typeof rep === "function") {
                    return rep();
                }
                else {
                    return rep;
                }
            }
        })
            .join("");
    }
}
function generator(define, mode, handler) {
    const obj = Object.fromEntries(Object.entries(define).map(([k, v]) => [
        k,
        typeof v === "string"
            ? {
                debug: new MessageBuilder(v),
                release: new MessageBuilder(v),
            }
            : {
                debug: new MessageBuilder(v["debug"]),
                release: new MessageBuilder(v["release"]),
            },
    ]));
    return (k, c) => {
        return handler(obj[k][mode].build(c), k);
    };
}
exports.default = generator;
//# sourceMappingURL=lib.js.map