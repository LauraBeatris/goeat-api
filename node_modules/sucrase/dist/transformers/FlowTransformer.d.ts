import TokenProcessor from "../TokenProcessor";
import RootTransformer from "./RootTransformer";
import Transformer from "./Transformer";
export default class FlowTransformer extends Transformer {
    readonly rootTransformer: RootTransformer;
    readonly tokens: TokenProcessor;
    constructor(rootTransformer: RootTransformer, tokens: TokenProcessor);
    process(): boolean;
}
