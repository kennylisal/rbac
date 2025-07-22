import { DefaultContext } from "./type";

// interface Options {
//   ignoreMissingAttributes?: boolean;
// }

//example of an interface with inherited interface
interface NewContextExample extends DefaultContext {
  user: string;
  role: string[];
}

type AttributeHandler<T> = (context: T) => boolean;

interface AttributesMap<T> {
  [key: string]: AttributeHandler<T>;
}

export class AttributesManager<T extends DefaultContext = DefaultContext> {
  private _attributes: AttributesMap<T>;
  // private _options: Options;

  constructor() {
    this._attributes = {};
    // this._options = { ...(options || {}) };
  }

  //also work to replace
  set(attributes: string, handler: AttributeHandler<T>): AttributesManager<T> {
    this._attributes[attributes] = handler;
    return this;
  }

  remove(attribute: string): (context: T) => boolean {
    const remove = this._attributes[attribute];
    delete this._attributes[attribute];
    return remove;
  }

  validate(attribute: string, context: T): boolean {
    if (this._attributes[attribute] === undefined) {
      throw new Error("Attributes has not been defined berforhand");
    } else {
      return this._attributes[attribute](context);
    }
  }
}
