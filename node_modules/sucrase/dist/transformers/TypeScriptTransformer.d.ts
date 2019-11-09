import TokenProcessor from "../TokenProcessor";
import RootTransformer from "./RootTransformer";
import Transformer from "./Transformer";
export default class TypeScriptTransformer extends Transformer {
    readonly rootTransformer: RootTransformer;
    readonly tokens: TokenProcessor;
    readonly isImportsTransformEnabled: boolean;
    constructor(rootTransformer: RootTransformer, tokens: TokenProcessor, isImportsTransformEnabled: boolean);
    process(): boolean;
    processEnum(isExport?: boolean): void;
    /**
     * Rather than try to compute the actual enum values at compile time, we just create variables for
     * each one and let everything evaluate at runtime. There's some additional complexity due to
     * handling string literal names, including ones that happen to be valid identifiers.
     */
    processEnumBody(enumName: string): void;
}
