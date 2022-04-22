export class MessageBuilder {
  readonly args: Record<string, string | null>
  readonly base: (string | { key: string })[];

  constructor(message: string) {
    this.args = {};
    this.base = [];
    let start = 0;
    for (const found of message.matchAll(
      /\$\{\s*([^}\s:]+)(\s*:\s*([^}\s]+))?\s*}/g
    )) {
      found.index
      this.args[found[1]] = found[3] ?? null
      this.base.push(message.slice(start, found.index));
      this.base.push({ key: found[1], });
      start = found.index! + found[0].length;
    }
    if (start !== message.length) {
      this.base.push(message.slice(start));
    }
  }
  build(context: Record<string, any>): string {
    return this.base
      .map((v) => {
        if (typeof v === "string") {
          return v;
        } else {
          const data = context[v.key];
          if (this.args[v.key] != null) {
            switch (this.args[v.key]) {
              case "str":
              case "string":
                return data
              case "num":
              case "number":
                return data.toString()
              case "obj":
              case "object":
                return JSON.stringify(data)
              case "bool":
              case "boolean":
                return `${data}`
              case "fn":
              case "func":
              case "function":
                return data(context)
              default:
                throw new Error(`unknown type '${this.args[v.key]}'`)
            }
          } else {
            switch (typeof data) {
              case "bigint":
              case "number":
                return data.toString()
              case "string":
                return data
              case "boolean":
                return `${data}`
              case "object":
                return JSON.stringify(data)
              case "function":
                return data(context)
              default:
                throw new Error(`unexpected value '${data}'`)
            }
          }
        }
      })
      .join("");
  }
}
