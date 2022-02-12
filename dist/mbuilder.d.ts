export declare class MessageBuilder {
    base: (string | {
        key: string;
        isJSON: boolean;
    })[];
    constructor(message: string);
    build(context: Record<string, any>): string;
}
//# sourceMappingURL=mbuilder.d.ts.map