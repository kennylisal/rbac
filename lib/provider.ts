import { InheritanceMapType, RulesType } from "./type";

export abstract class RBACProvider {
  protected _rules: RulesType;

  constructor(rules: RulesType) {
    this._rules = rules;
  }

  compileInheritanceMap(rules: RulesType): InheritanceMapType {
    throw new Error("Not implemented");
  }

  getPermission(role: string): string[] {
    throw new Error("Not implemented");
  }

  getAttributes(role: string): string[] {
    throw new Error("Not implemented");
  }
}
