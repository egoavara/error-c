import tap from "tap";
import errorc from "../cjs/lib";

const fn = errorc({TEST : "TEST"} as const)

tap.throws(() => { errorc("WF" as any) })
tap.throws(() => { fn(undefined as any, {}) })
tap.throws(() => { fn("unknown" as any, {}) })