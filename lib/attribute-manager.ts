interface Options {
  ignoreMissingAttributes?: boolean;
}

interface Context {
  [key: string]: any;
}
type AttributeHandler = (context: Context) => boolean | Promise<boolean>;

interface AttributesMap {
  [key: string]: AttributeHandler;
}

class AttributesManager {
  private _attributes: AttributesMap;
  private _options: Options;

  constructor(options?: Options) {
    this._attributes = {};
    this._options = { ...(options || {}) };
  }

  set(attributes: string, handler: AttributeHandler): AttributesManager {
    if (typeof handler !== "function") {
      throw new TypeError("Attribute handler should be a function");
    } else if (!attributes) {
      throw new TypeError("Attribute name cannot be empty");
    }
    this._attributes[attributes] = handler;
    return this;
  }
}
