import errorc from "../cjs/lib"
import tap from "tap"
const Define = {
    vN: "${value:string}",
    vL: "${ value:string}",
    vLL: "${ \t\n value:string}",
    vR: "${value :string}",
    vRR: "${value \t\n :string}",
    vLR: "${ value :string}",
    vLRR: "${ value \t\n :string}",
    vLLR: "${ \t\n value :string}",
    vLLRR: "${ \t\n value \t\n :string}",

    tN: "${value:string}",
    tL: "${value: string}",
    tLL: "${value: \t\n string}",
    tR: "${value:string }",
    tRR: "${value:string \t\n }",
    tLR: "${value: string }",
    tLRR: "${value: string \t\n }",
    tLLR: "${value: \t\n string }",
    tLLRR: "${value: \t\n string \t\n }",

} as const

const ns = errorc(
    "namespace",
    Define,
)

ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
ns.tL({ value: 'a' })
tap.same(ns.vN({ value: 'a' }), 'a')
tap.same(ns.vL({ value: 'a' }), 'a')
tap.same(ns.vLL({ value: 'a' }), 'a')
tap.same(ns.vR({ value: 'a' }), 'a')
tap.same(ns.vRR({ value: 'a' }), 'a')
tap.same(ns.vLR({ value: 'a' }), 'a')
tap.same(ns.vLRR({ value: 'a' }), 'a')
tap.same(ns.vLLR({ value: 'a' }), 'a')
tap.same(ns.vLLRR({ value: 'a' }), 'a')
tap.same(ns.tN({ value: 'a' }), 'a')
tap.same(ns.tL({ value: 'a' }), 'a')
tap.same(ns.tLL({ value: 'a' }), 'a')
tap.same(ns.tR({ value: 'a' }), 'a')
tap.same(ns.tRR({ value: 'a' }), 'a')
tap.same(ns.tLR({ value: 'a' }), 'a')
tap.same(ns.tLRR({ value: 'a' }), 'a')
tap.same(ns.tLLR({ value: 'a' }), 'a')
tap.same(ns.tLLRR({ value: 'a' }), 'a')
