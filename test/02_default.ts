import errorc from "../cjs/lib"
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

const defaultErrorc = errorc(Define, { defaultMode: "debug" })
const functionErrorc = errorc("function", Define, { defaultMode: "debug" })
const namespaceErrorc = errorc("namespace", Define, { defaultMode: "debug" })


tap.same(defaultErrorc.SIMPLE(), functionErrorc("SIMPLE", {}))
tap.same(namespaceErrorc.SIMPLE(), functionErrorc("SIMPLE", {}))
tap.same(namespaceErrorc.SIMPLE(), "message")

tap.same(defaultErrorc.ARGS({ arg1: 1, arg2: 2 }), functionErrorc("ARGS", { arg1: 1, arg2: 2 }))
tap.same(namespaceErrorc.ARGS({ arg1: 1, arg2: 2 }), functionErrorc("ARGS", { arg1: 1, arg2: 2 }))
tap.same(namespaceErrorc.ARGS({ arg1: 1, arg2: 2 }), "1 - 2")

tap.same(defaultErrorc.COND({ debug: "DEBUG", release: "RELEASE" }), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }), "DEBUG")

tap.same(defaultErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "debug"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "debug"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "debug"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "debug"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "debug"), "DEBUG")

tap.same(defaultErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "release"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "release"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), "RELEASE")

tap.same(defaultErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "release"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), functionErrorc("COND", { debug: "DEBUG", release: "RELEASE" }, "release"))
tap.same(namespaceErrorc.COND({ debug: "DEBUG", release: "RELEASE" }, "release"), "RELEASE")

tap.same(defaultErrorc.INNER.A({ a: "aa" }, "release"), functionErrorc("INNER.A", { a: "aa" }, "release"))
tap.same(namespaceErrorc.INNER.A({ a: "aa" }, "release"), functionErrorc("INNER.A", { a: "aa" }, "release"))
tap.same(namespaceErrorc.INNER.A({ a: "aa" }, "release"), "A aa")

tap.same(defaultErrorc.INNER.B({ b: "bb" }, "release"), functionErrorc("INNER.B", { b: "bb" }, "release"))
tap.same(namespaceErrorc.INNER.B({ b: "bb" }, "release"), functionErrorc("INNER.B", { b: "bb" }, "release"))
tap.same(namespaceErrorc.INNER.B({ b: "bb" }, "release"), "B bb")