import NameManager from "../NameManager";
import TokenProcessor from "../TokenProcessor";
import Transformer from "./Transformer";
export default class OptionalCatchBindingTransformer extends Transformer {
    readonly tokens: TokenProcessor;
    readonly nameManager: NameManager;
    constructor(tokens: TokenProcessor, nameManager: NameManager);
    process(): boolean;
}
