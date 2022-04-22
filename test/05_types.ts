import errorc from "../cjs/lib"
import tap from "tap"
const Define = {
    s0: "${value:string}",
    s1: "${value:str}",
    n0: "${value:number}",
    n1: "${value:num}",
    o0: "${value:object}",
    o1: "${value:obj}",
    b0: "${value:boolean}",
    b1: "${value:bool}",
    f0: "${value:function}",
    f1: "${value:func}",
    f2: "${value:fn}",
    a0: "${value}",
} as const

const ns = errorc(
    "namespace",
    Define,
)
tap.same(ns.s0({ value: 's0' }), 's0')
tap.same(ns.s1({ value: 's1' }), 's1')
tap.same(ns.n0({ value: 123 }), '123')
tap.same(ns.n1({ value: 456n }), '456')
tap.same(JSON.parse(ns.o0({ value: { abc: 1 } })), { abc: 1 })
tap.same(JSON.parse(ns.o1({ value: { def: 2 } })), { def: 2 })
tap.same(ns.b0({ value: true }), 'true')
tap.same(ns.b1({ value: false }), 'false')
tap.same(ns.f0({ value: () => '1234567' }), '1234567')
tap.same(ns.f1({ value: () => '1234567' }), '1234567')
tap.same(ns.f2({ value: () => '1234567' }), '1234567')

tap.same(ns.a0({ value: () => '1234567' }), '1234567')
tap.same(ns.a0({ value: 'qwerty' }), 'qwerty')
tap.same(ns.a0({ value: 7654321 }), '7654321')
tap.same(ns.a0({ value: 12341234123412341234n }), '12341234123412341234')
tap.same(ns.a0({ value: true }), 'true')
tap.same(JSON.parse(ns.a0({ value: { a: { b: { c: { d: { e: 1 } } } } } })), { a: { b: { c: { d: { e: 1 } } } } })


