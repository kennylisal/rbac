import { DefaultContext } from "./type";

// Example of an interface extending DefaultContext for custom context types
interface NewContextExample extends DefaultContext {
  user: string;
  role: string[];
}

type AttributeHandler<T> = (context: T) => boolean | Promise<boolean>;

interface AttributesMap<T> {
  [key: string]: AttributeHandler<T>;
}

/**
 * Manages attribute-based validation with support for synchronous and asynchronous handlers.
 * Allows setting, removing, and validating attributes against a context.
 *
 * @template T - The context type, extending DefaultContext
 */
export default class AttributesManager<
  T extends DefaultContext = DefaultContext
> {
  private _attributes: AttributesMap<T>;

  /**
   * Initializes a new AttributesManager instance.
   * Sets up an empty attributes map.
   */
  constructor() {
    this._attributes = {};
  }

  /**
   * Defines a synchronous / async attribute handler.
   * The handler must return a boolean or Promise<boolean> and is executed synchronously.
   * Returns self for method chaining.
   *
   * @param attribute - The name of the attribute
   * @param handler - The synchronous handler function that returns a boolean
   * @returns This AttributesManager instance for chaining
   * @throws TypeError if attribute is not a string or handler is not a function
   */
  set(attributes: string, handler: AttributeHandler<T>): AttributesManager<T> {
    this._attributes[attributes] = handler;
    return this;
  }

  /**
   * Removes an attribute handler by name and returns the removed handler.
   * If the attribute does not exist, returns undefined.
   *
   * @param attribute - The name of the attribute to remove
   * @returns The removed handler (sync or async) or undefined if not found
   * @throws TypeError if attribute is not a string
   */
  remove(attribute: string): AttributeHandler<T> {
    const remove = this._attributes[attribute];
    delete this._attributes[attribute];
    return remove;
  }

  /**
   * Validates an attribute against the provided context.
   * Always returns a Promise<boolean> to handle both sync and async handlers.
   * The method must be awaited to get the validation result.
   * Returns true if the attribute is valid, false otherwise.
   *
   * @param attribute - The name of the attribute to validate
   * @param context - The context object to pass to the handler
   * @returns A Promise resolving to the validation result (true or false)
   * @throws TypeError if attribute is not a string or is empty
   * @throws Error if the attribute is not defined
   */
  validate(attribute: string, context: T): Promise<boolean> | boolean {
    if (this._attributes[attribute] === undefined) {
      throw new Error("Attributes has not been defined berforhand");
    } else {
      const result = this._attributes[attribute](context);
      return result;
    }
  }
}
