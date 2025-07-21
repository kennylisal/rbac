import { RulesType } from "./types";

class Provider {
  compileInheritanceMap(rules: RulesType) {
    throw new Error("Not implemented");
  }

  getPermission(role: string): string[] {
    throw new Error("Not implemented");
  }

  getAttributes(role: string): string[] {
    throw new Error("Not implemented");
  }
}
