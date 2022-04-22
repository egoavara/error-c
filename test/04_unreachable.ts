import tap from "tap";
import errorc from "../cjs/lib";

const fn = errorc(
    "function",
    {
        TEST: "TEST",
        VALUE: "${value}",
    } as const
)

tap.throws(() => { errorc("WF" as any) })
tap.throws(() => { fn(undefined as any, {}) })
tap.throws(() => { fn("unknown" as any, {}) })
tap.throws(() => { fn("VALUE", { value: undefined as any }) })
tap.throws(() => { errorc("function", { INVALID_TYPE: "${aaa:invalidtype}" })("INVALID_TYPE", {}) })