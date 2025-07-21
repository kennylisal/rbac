export interface RoleDataType {
  permissions?: string[];
  inherited?: string[];
  attributes?: string[];
}
export type RulesType = Record<string, RoleDataType>;
export type InheritanceMapType = Record<string, string[]>;
