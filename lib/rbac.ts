import { EventEmitter } from "stream";
import { AttributesManager } from "./attribute-manager";
import { DefaultContext } from "./type";
import { RBACProvider } from "./provider";

class RBAC<T extends DefaultContext = DefaultContext> extends EventEmitter {
  readonly _attributesManager: AttributesManager<T>;
  readonly _provider: RBACProvider;

  constructor(attrManager: AttributesManager<T>, provider: RBACProvider) {
    super();
    this._attributesManager = attrManager;
    this._provider = provider;
  }

  //check if user had permission
  check(userRole: string[], permission: string[]): boolean {
    const emitter = this;
    const provider = this._provider;
    const attributes = this._attributesManager;
  }
}
