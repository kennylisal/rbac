import { InheritanceMapType, RulesType } from "./type";

export default abstract class RBACProvider {
  protected _rules: RulesType;

  constructor(rules: RulesType) {
    this._rules = rules;
  }

  compileInheritanceMap(rules: RulesType): InheritanceMapType {
    throw new Error("Not implemented");
  }

  //return the user role with the inherited ones
  getUserRoles(roles: string[]): InheritanceMapType {
    throw new Error("Not implemented");
  }

  //basicly return only the permissions granted to a role
  //withouth the inherited permissions

  getPermission(role: string): string[] {
    throw new Error("Not implemented");
  }

  getInheritedPermission(role: string): string[] {
    throw new Error("Not Implemented");
  }

  getAttributes(role: string): string[] {
    throw new Error("Not implemented");
  }
}
