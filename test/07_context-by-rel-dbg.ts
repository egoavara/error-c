import errorc from "../cjs/lib"
import tap from "tap"
const Define = {
    Message: {
        release: "${releaseOnlyValue}",
        debug: "${debugOnlyValue}",
    }
} as const

const ns = errorc(
    "namespace",
    Define,
    {
        handler(msg, code, ctx) {
            return ctx
        }
    }
)
tap.same(
    ns.Message({ releaseOnlyValue: "rel", debugOnlyValue: "dbg" }, "release"),
    { releaseOnlyValue: "rel" }
)

tap.same(
    ns.Message({ releaseOnlyValue: "rel", debugOnlyValue: "dbg" }, "debug"),
    { debugOnlyValue: "dbg" }
)

