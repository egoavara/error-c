import errorc from "../lib";

const DEFINE_ERRORS = {
  E0004: {
    release: "rel : I'm not ${notyou}, i'm ${whoareyou}!",
    debug: "dbg : I'm not ${notyou}, i'm ${whoareyou}!",
  },
} as const;

// If you wish, you can define a separate function for debugging releases.
// However, this is not highly recommended.
// This may require changes to the entire code
//  depending on the circumstances of the release debug.
const failRel = errorc(DEFINE_ERRORS, "release", (msg) => msg);
const failDbg = errorc(DEFINE_ERRORS, "debug", (msg) => msg);

// "rel : I'm not pizza, i'm potato!"
console.log(failRel("E0004", { notyou: "pizza", whoareyou: "potato" }));
// "dbg : I'm not pizza, i'm potato!"
console.log(failDbg("E0004", { notyou: "pizza", whoareyou: "potato" }));
