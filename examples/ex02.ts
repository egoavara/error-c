import errorc from "../lib";

const DEFINE_ERRORS = {
  E0004: "I'm not ${notyou}, i'm ${whoareyou}!",
} as const;

const failPrefix = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => `prefix : ${msg}`
);

const failType = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => ({ msg, type: "obj" })
);

// "prefix : I'm not pizza, i'm potato!"
console.log(failPrefix("E0004", { notyou: "pizza", whoareyou: "potato" }));
// { "msg" : "I'm not pizza, i'm potato!", "type" : "obj" }
console.log(failType("E0004", { notyou: "pizza", whoareyou: "potato" }));
