"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = void 0;
class MessageBuilder {
    constructor(message) {
        this.base = [];
        let start = 0;
        for (const found of message.matchAll(/\$\{\s*([^}\s:]+)(\s*:\s*[^}]+)?\s*}/g)) {
            this.base.push(message.slice(start, found.index));
            this.base.push({
                key: found[1],
                isJSON: (found[2] ?? "").search("json") !== -1,
            });
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
                const data = typeof rep === "function" ? rep() : rep;
                return v.isJSON ? JSON.stringify(data) : `${data}`;
            }
        })
            .join("");
    }
}
exports.MessageBuilder = MessageBuilder;
//# sourceMappingURL=mbuilder.js.map