import { EventEmitter } from "stream";
import AttributesManager from "./attribute-manager";
import { DefaultContext, InheritanceMapType } from "./type";
import RBACProvider from "./provider";
import { permission } from "process";

export class RBAC<
  T extends DefaultContext = DefaultContext
> extends EventEmitter {
  readonly _attributesManager: AttributesManager<T>;
  readonly _provider: RBACProvider;

  constructor(attrManager: AttributesManager<T>, provider: RBACProvider) {
    super();
    this._attributesManager = attrManager;
    this._provider = provider;
  }

  //   check if user had permission
  async check(
    userRoles: string[],
    requestedPermission: string,
    context: T
  ): Promise<boolean> {
    try {
      const compiledRoles = this.compileUserRoles(
        userRoles,
        this,
        this._provider
      );
      const filteredRoles = await this.filterRoleByAttributes(
        compiledRoles,
        this,
        this._provider,
        context
      );
      const permissionList = this.preparePermissionList(
        filteredRoles,
        this,
        this._provider
      );
      return permissionList.includes(requestedPermission);
    } catch (err) {
      err = err || new Error("Error while checking with RBAC");
      this.emit("error", err);
      return false;
    }
  }

  //return all the permissions a user had
  //each must be unique
  preparePermissionList(
    roles: string[],
    emitter: EventEmitter,
    provider: RBACProvider
  ): string[] {
    try {
      const visited: Set<string> = new Set();
      for (const role of roles) {
        const permissions = provider.getPermission(role);
        permissions.forEach((permission) => {
          visited.add(permission);
        });
      }
      return [...visited];
    } catch (err) {
      err = err || new Error("Error while preparing permission");
      emitter.emit("error", err);
      return [];
    }
  }

  //return all the permission that eliigible with the attributes
  async filterRoleByAttributes(
    roles: string[],
    emitter: EventEmitter,
    provider: RBACProvider,
    context: T
  ): Promise<string[]> {
    try {
      let arrResult: string[] = [];
      for (const role of roles) {
        const roleAttributes = provider.getAttributes(role);
        let isAttributeElligible = true;
        for (const attribute of roleAttributes) {
          isAttributeElligible = await this._attributesManager.validate(
            attribute,
            context
          );
          if (!isAttributeElligible) break;
        }
        if (isAttributeElligible) arrResult.push(role);
      }
      return arrResult;
    } catch (err) {
      err = err || new Error("Error while filtering attribute");
      emitter.emit("error", err);
      return [];
    }
  }

  compileUserRoles(
    roles: string[],
    emitter: EventEmitter,
    provider: RBACProvider
  ): string[] {
    try {
      const visited: Set<string> = new Set();
      const map = provider.getUserRoles(roles);
      Object.keys(map).forEach((key) => {
        map[key].forEach((element) => {
          visited.add(element);
        });
      });
      return [...visited];
    } catch (err) {
      err = err || new Error("Error while getting user Roles");
      emitter.emit("error", err);
      return [];
    }
  }
}
