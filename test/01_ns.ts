import { NamespaceGenerate } from "../cjs/lib"
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

const ns = NamespaceGenerate(Define, {
    defaultMode: "debug"
})


tap.same(
    ns.SIMPLE(),
    "message"
)
tap.same(
    ns.ARGS({ arg1: 1, arg2: 2 }),
    "1 - 2"
)
tap.same(
    ns.COND({ debug: "DEBUG", release : "RELEASE"}),
    "DEBUG"
)
tap.same(
    ns.COND({ debug: "DEBUG", release : "RELEASE"}, "debug"),
    "DEBUG"
)
tap.same(
    ns.COND({ debug: "DEBUG", release : "RELEASE"}, "release"),
    "RELEASE"
)
tap.same(
    ns.INNER.A({ a :"aa"}),
    "A aa"
)
tap.same(
    ns.INNER.B({ b :"bb"}),
    "B bb"
)

