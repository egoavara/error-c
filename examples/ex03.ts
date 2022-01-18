import errorc from "../lib";

const DEFINE_ERRORS = {
  NUMBER: "${value:number}",
  STRING: "${value:string}",
  OBJECT: "${value:object}",
  DEFAULT: "${value}",
} as const;

const fail = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);
fail("NUMBER", {
  value: 1,
});
