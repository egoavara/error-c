export declare type DefaultType = number | string | object | boolean | (() => string);
export declare type LiteralToType<L extends string> = L extends "string" ? string : L extends "str" ? string : L extends "number" ? number : L extends "object" ? object : L extends "boolean" ? boolean : L extends "bool" ? boolean : L extends "function" ? () => string : L extends "func" ? () => string : L extends "fn" ? () => string : DefaultType;
export declare type ConditionMessage = {
    release: string;
    debug: string;
};
export declare type MessageType = string | ConditionMessage;
//# sourceMappingURL=types.d.ts.map