import { InheritanceMapType, RulesType } from "./type";

//this is an abtract class with function that are free to implemented based on your needs
export default abstract class RBACProvider {
  protected _rules: RulesType;

  /**
   * Initializes a new RBACProvider instance with the given rules.
   *
   * @param rules - The rules defining roles, permissions, inherited roles, and attributes
   */
  constructor(rules: RulesType) {
    this._rules = rules;
  }

  /**
   * Retrieves all roles available for the given user.
   * Returns an object mapping roles to their inherited roles (recursively).
   * Returns an empty object if the user has no roles.
   *
   * @example
   * ```typescript
   * // Returns: { "admin": ["manager"], "manager": [], "guest": [] }
   * provider.getUserRoles(["user1"]);
   * ```
   *
   * @param users - An array of user identifiers (e.g., user IDs or names)
   * @returns An object mapping roles to their inherited roles, or a Promise resolving to such an object
   * @throws Error if not implemented in a concrete class
   */
  getUserRoles(roles: string[]): InheritanceMapType {
    throw new Error("Not implemented");
  }

  /**
   * Retrieves all permissions for the specified role.
   * Returns an array of permission strings. Returns an empty array if the role is missing
   * or has no permissions.
   *
   * @example
   * ```typescript
   * // Returns: ["read", "write"]
   * provider.getPermission("admin");
   * ```
   *
   * @param role - The role to query permissions for
   * @returns An array of permission strings, or a Promise resolving to such an array
   * @throws Error if not implemented in a concrete class
   */
  getPermission(role: string): string[] {
    throw new Error("Not implemented");
  }

  /**
   * Retrieves all attributes for the specified role.
   * Returns an array of attribute strings. Returns an empty array if the role is missing
   * or has no attributes.
   *
   * @example
   * ```typescript
   * // Returns: ["isActive", "hasAccess"]
   * provider.getAttributes("admin");
   * ```
   *
   * @param role - The role to query attributes for
   * @returns An array of attribute strings, or a Promise resolving to such an array
   * @throws Error if not implemented in a concrete class
   */
  getAttributes(role: string): string[] {
    throw new Error("Not implemented");
  }
}

// getInheritedPermission(role: string): string[] {
//   throw new Error("Not Implemented");
// }

// compileInheritanceMap(rules: RulesType): InheritanceMapType {
//   throw new Error("Not implemented");
// }
