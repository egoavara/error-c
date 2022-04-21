export class MessageBuilder {
  readonly args: Record<string, string | null>
  readonly base: (string | { key: string })[];

  constructor(message: string) {
    this.args = {};
    this.base = [];
    let start = 0;
    for (const found of message.matchAll(
      /\$\{\s*([^}\s:]+)(\s*:\s*([^}]+))?\s*}/g
    )) {
      this.args[found[1]] = found[3] ?? null
      this.base.push(message.slice(start, found.index));
      this.base.push({ key: found[1], });
      start = (found.index ?? start) + found[0].length;
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
          const rep = context[v.key];
          const data = typeof rep === "function" ? rep(context) : rep;
          return `${data}`;
        }
      })
      .join("");
  }
}
