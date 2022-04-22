import { FunctionGenerator } from "../cjs/lib"
import tap from "tap"
const Define = {
    SIMPLE: "message",
    ARGS: "${arg1} - ${arg2}",
    COND: {
        debug: "${debug}",
        release: "${release}",
    },
    INNER: {
        A: "A ${a}",
        B: "B ${b}"
    }
} as const

const fn = FunctionGenerator(Define, {
    defaultMode: "debug"
})

tap.same(
    fn("SIMPLE", {}),
    "message"
)
tap.same(
    fn("ARGS", { arg1: 1, arg2: 2 }),
    "1 - 2"
)
tap.same(
    fn("COND", { debug: "DEBUG", release: "RELEASE" }),
    "DEBUG"
)
tap.same(
    fn("COND", { debug: "DEBUG", release: "RELEASE" }),
    "DEBUG"
)
tap.same(
    fn("COND", { debug: "DEBUG", release: "RELEASE" }, "release"),
    "RELEASE"
)
tap.same(
    fn("INNER.A", { a: "aa" }),
    "A aa"
)
tap.same(
    fn("INNER.B", { b: "bb" }),
    "B bb"
)

