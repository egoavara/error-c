import errorc from "../cjs/lib"
import tap from "tap"
const Define = {
    TEST: {
        release: "RELEASE",
        debug: "DEBUG",
    }
} as const

tap.same(errorc("namespace", Define).TEST(), "RELEASE")
tap.same(errorc("namespace", Define, { defaultMode: 'release' }).TEST(), "RELEASE")
tap.same(errorc("namespace", Define, { defaultMode: 'debug' }).TEST(), "DEBUG")