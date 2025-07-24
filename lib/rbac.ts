import { EventEmitter } from "stream";
import AttributesManager from "./attribute-manager";
import { DefaultContext, InheritanceMapType } from "./type";
import RBACProvider from "./provider";
import { permission } from "process";

/**
 * Role-Based Access Control (RBAC) class for checking user permissions and managing roles.
 * Extends EventEmitter to emit errors during validation.
 * Uses an AttributesManager for attribute validation and an RBACProvider for role/permission data.
 * @remarks
 * This class checks if a user has specific permissions based on their roles and associated attributes.
 * Methods are asynchronous and return Promises to handle both sync and async provider/attribute operations.
 * @template T - The context type, extending DefaultContext
 */
export class RBAC<
  T extends DefaultContext = DefaultContext
> extends EventEmitter {
  readonly _attributesManager: AttributesManager<T>;
  readonly _provider: RBACProvider;

  /**
   * Initializes a new RBAC instance with an AttributesManager and RBACProvider.
   *
   * @param attributesManager - The manager for validating attributes
   * @param provider - The provider for retrieving roles, permissions, and attributes
   * @throws TypeError if attributesManager or provider is invalid
   */
  constructor(attributeManager: AttributesManager<T>, provider: RBACProvider) {
    super();
    this._attributesManager = attributeManager;
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

  /**
   * Prepares a unique list of permissions for the given roles.
   * Returns an array of unique permission strings.
   * Emits an 'error' event if permission retrieval fails.
   *
   * @param roles - Array of role names
   * @param emitter - EventEmitter to emit errors
   * @param provider - RBACProvider to retrieve permissions
   * @returns An array of unique permission strings
   * @throws TypeError if roles is not an array
   */
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

  /**
   * Filters roles based on their attributes using the AttributesManager.
   * Returns a Promise resolving to an array of roles that pass attribute validation.
   * Emits an 'error' event if validation fails.
   *
   * @param roles - Array of role names to filter
   * @param emitter - EventEmitter to emit errors
   * @param provider - RBACProvider to retrieve attributes
   * @param context - The context object for attribute validation
   * @returns A Promise resolving to an array of valid role names
   * @throws TypeError if roles is not an array
   */
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

  /**
   * Compiles a unique list of inherited roles for the given user roles.
   * Returns an array of unique role names, including inherited roles.
   * Emits an 'error' event if role retrieval fails.
   *
   * @param roles - Array of user role names
   * @param emitter - EventEmitter to emit errors
   * @param provider - RBACProvider to retrieve role inheritance
   * @returns An array of unique role names
   * @throws TypeError if roles is not an array
   */
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
