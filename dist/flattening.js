"use strict";
// === begin:version1.2 ===
// version1.2 : Flattening feature
Object.defineProperty(exports, "__esModule", { value: true });
exports.letflat = void 0;
const mbuilder_1 = require("./mbuilder");
function isMessage(o) {
    return (typeof o === "string" ||
        (typeof o === "object" && "release" in o && "debug" in o));
}
function* flatkeys(o, base = "") {
    for (const k of Object.keys(o)) {
        const nbase = base === "" ? k : `${base}.${k}`;
        if (isMessage(o[k])) {
            yield [nbase, o[k]];
        }
        else {
            yield* flatkeys(o[k], nbase);
        }
    }
}
function letflat(o) {
    let result = {};
    for (const [fk, v] of flatkeys(o)) {
        if (typeof v === "string") {
            result[fk] = {
                release: new mbuilder_1.MessageBuilder(v),
                debug: new mbuilder_1.MessageBuilder(v),
            };
        }
        else {
            result[fk] = {
                release: new mbuilder_1.MessageBuilder(v["release"]),
                debug: new mbuilder_1.MessageBuilder(v["debug"]),
            };
        }
    }
    return result;
}
exports.letflat = letflat;
// === end:version1.2 ===
//# sourceMappingURL=flattening.js.map