/**
 * Represents the data structure for a role's configuration.
 * Defines permissions, inherited roles, and attributes for a role.
 *
 * @example
 * ```typescript
 * const roleData: RoleDataType = {
 *   permissions: ["read", "write"],
 * `

    inherited: ["manager"],
 *   attributes: ["isActive"]
 * };
 * ```
 */
export interface RoleDataType {
  permissions?: string[];
  inherited?: string[];
  attributes?: string[];
}

/**
 * Represents a mapping of roles to their inherited roles.
 * Each key is a role, and its value is an array of roles it inherits.
 *
 * @example
 * ```typescript
 * const inheritanceMap: InheritanceMapType = {
  user: [],
  reader: [ 'user' ],
  writer: [ 'reader', 'user' ],
  editor: [ 'reader', 'user' ],
  director: [ 'reader', 'user', 'editor' ],
  admin: [ 'director', 'reader', 'user', 'editor' ]
}
 * ```
 */
export type InheritanceMapType = Record<string, string[]>;

/**
 * Represents the rules configuration for the RBAC system.
 * Maps role names to their RoleDataType configurations.
 *
 * @example
 * ```typescript
 * const rules: RulesType = {
 *   admin: { permissions: ["read", "write"], inherited: ["manager"], attributes: ["isActive"] },
 *   manager: { permissions: ["read"], attributes: ["hasAccess"] }
 * };
 * ```
 */
export type RulesType = Record<string, RoleDataType>;

/**
 * Default context interface for attribute validation.
 * A flexible key-value map to hold context data (e.g., user details).
 * Implementations should extend this interface for specific context needs.
 *
 * @example
 * ```typescript
 * interface CustomContext extends DefaultContext {
 *   user: string;
 *   role: string[];
 * }
 * const context: CustomContext = { user: "john", role: ["admin"] };
 * ```
 */
export interface DefaultContext {
  [key: string]: any;
}
