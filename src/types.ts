export type DefaultType = number | string | object | boolean | (() => string);

export type LiteralToType<L extends string> = L extends "string"
  ? string
  : L extends "str"
  ? string
  : L extends "number"
  ? number
  : L extends "object"
  ? object
  : L extends "boolean"
  ? boolean
  : L extends "bool"
  ? boolean
  : L extends "function"
  ? () => string
  : L extends "func"
  ? () => string
  : L extends "fn"
  ? () => string
  : DefaultType;

  export type ConditionMessage = {
    release: string;
    debug: string;
  };
  
  export type MessageType = string | ConditionMessage;