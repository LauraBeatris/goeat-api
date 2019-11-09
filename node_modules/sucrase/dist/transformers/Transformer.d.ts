export default abstract class Transformer {
    abstract process(): boolean;
    getPrefixCode(): string;
    getSuffixCode(): string;
}
