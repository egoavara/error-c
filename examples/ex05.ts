import errorc, { MessageType } from "../lib";

const DEFINE_ERRORS = {
  a: "a",
  b: {
    aa: "b.aa",
    bb: "b.bb",
  },
  c: {
    aa: {
      aaa: "c.aa.aaa",
      bbb: "c.aa.bbb",
      ccc: "c.aa.ccc",
    },
    bb: {
      aaa: "c.bb.aaa",
      bbb: "c.bb.bbb",
      ccc: "c.bb.ccc",
      [-1]: "c.bb.-1 ${b}",
    },
  },
  d: {
    release: "d[release]",
    debug: "d[debug]",
  },
} as const;
const fail = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);

console.log(fail("c.bb.-1", {
  b : "ff"
}));
