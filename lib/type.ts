export interface RoleDataType {
  permissions?: string[];
  inherited?: string[];
  attributes?: string[];
}
export type InheritanceMapType = Record<string, string[]>;
export type RulesType = Record<string, RoleDataType>;

//for now its type any
//But the main assumption is each of them is just string
export interface DefaultContext {
  [key: string]: any;
}
