import RBACProvider from "../provider";
import { InheritanceMapType, RoleDataType, RulesType } from "../type";

/**
 * A concrete RBACProvider implementation that stores RBAC rules in JSON format.
 * Precomputes an inheritance map for efficient role, permission, and attribute lookups.
 */
export default class JsonProvider extends RBACProvider {
  protected _inheritanceMap: InheritanceMapType;

  /**
   * Initializes the provider with JSON rules and builds the inheritance map.
   * @param rules - The JSON rules defining roles, permissions, and attributes
   */
  constructor(rules: RulesType) {
    super(rules);
    this._inheritanceMap = this.compileInheritanceMap();
  }
  /**
   * Returns a map of roles to their inherited roles for the given user roles.
   * @param roles - Array of role names
   * @returns A map where each role maps to an array of itself and its inherited roles
   */
  getUserRoles(roles: string[]): InheritanceMapType {
    const map: InheritanceMapType = {};
    for (const role of roles) {
      map[role] = [role, ...this._inheritanceMap[role]];
    }
    return map;
  }

  /**
   * Returns the permissions for a given role.
   * @param role - The role to query
   * @returns Array of permission strings, or empty if role is undefined
   */
  getPermission(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    return this._rules[role].permissions || [];
  }

  /**
   * Returns the attributes for a given role.
   * @param role - The role to query
   * @returns Array of attribute strings, or empty if role is undefined
   */
  getAttributes(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    return this._rules[role].attributes || [];
  }

  /**
   * Builds a map of roles to their inherited roles, handling recursive inheritance.
   * @returns A map where each role maps to an array of itself and its inherited roles
   * @throws Error if an inherited role is undefined
   */
  compileInheritanceMap(): InheritanceMapType {
    const inheritaceMap: InheritanceMapType = {};
    const rules = this._rules;
    function Helper(role: string) {
      let resFinal: string[] = [];
      function getInheritedRole(
        role: string,
        visited: Set<string> = new Set()
      ) {
        const currentRole = rules[role];

        if (currentRole === undefined) {
          throw new Error(
            `Role ${currentRole} has not been created when extended to ${
              [...visited][visited.size - 1]
            }`
          );
        }
        if (visited.has(role)) {
          return;
        }
        if (!currentRole.inherited || currentRole.inherited.length === 0) {
          resFinal.push(role);
          return;
        }
        resFinal.push(role);
        for (let index = 0; index < currentRole.inherited.length; index++) {
          const element = currentRole.inherited[index];
          getInheritedRole(element, new Set(resFinal));
        }
      }

      const keyword = role;
      for (let index = 0; index < rules[keyword].inherited!.length; index++) {
        const element = rules[keyword].inherited![index];
        getInheritedRole(element);
      }
      return resFinal;
    }
    Object.keys(rules).forEach((key) => {
      if (!rules[key]) {
        inheritaceMap[key] = [key];
        return;
      }

      if (rules[key].inherited === undefined) {
        inheritaceMap[key] = [key];
      } else {
        inheritaceMap[key] = Helper(key);
      }
    });
    return inheritaceMap;
  }

  /**
   * Returns all permissions for a role, including inherited permissions.
   * @param role - The role to query
   * @returns Array of unique permission strings, or empty if role is undefined
   */
  getInheritedPermission(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    if (this._inheritanceMap[role] === undefined) {
      return [];
    }
    const arrRole = this._inheritanceMap[role];
    let arrRes: string[] = [];
    arrRole.forEach((element) => {
      arrRes = [...arrRes, ...this.getPermission(element)];
    });
    return arrRes;
  }

  /**
   * Returns all attributes for a role, including inherited attributes.
   * @param role - The role to query
   * @returns Array of unique attribute strings, or empty if role is undefined
   */
  getAllAtributesWithMap(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    if (this._inheritanceMap[role] == undefined) {
      return [];
    }
    const arrRole = this._inheritanceMap[role];
    let arrRes: string[] = [];
    arrRole.forEach((e) => {
      arrRes = [...arrRes, ...this.getAttributes(e)];
    });
    return arrRes;
  }

  /**
   * Returns the precomputed inheritance map.
   * @returns The map of roles to their inherited roles
   */
  getInheritanceMap() {
    return this._inheritanceMap;
  }
}

// console.log(compileInheritanceMap(rules));
// const rules: RulesType = {
//   user: {
//     inherited: [],
//     permissions: ["exist"],
//   },
//   reader: {
//     permissions: ["read"],
//     inherited: ["user"],
//   },
//   writer: {
//     permissions: ["create"],
//     inherited: ["reader"],
//   },
//   editor: {
//     permissions: ["update"],
//     inherited: ["reader"],
//     attributes: ["dailySchedule"],
//   },
//   director: {
//     permissions: ["delete"],
//     inherited: ["reader", "editor"],
//   },
//   admin: {
//     permissions: ["manage"],
//     inherited: ["director"],
//     attributes: ["hasSuperPrivilege"],
//   },
// };

// function compileInheritanceMap(rules: RulesType): InheritanceMapType {
//   const inheritaceMap: InheritanceMapType = {};
//   function Helper(role: string) {
//     let resFinal: string[] = [];

//     function getInheritedRole(role: string, visited: Set<string> = new Set()) {
//       const currentRole = rules[role];

//       if (currentRole === undefined) {
//         throw new Error(
//           `Role ${currentRole} has not been created when extended to ${
//             [...visited][visited.size - 1]
//           }`
//         );
//       }
//       if (visited.has(role)) {
//         return;
//       }
//       if (!currentRole.inherited || currentRole.inherited.length === 0) {
//         resFinal.push(role);
//         return;
//       }
//       resFinal.push(role);
//       for (let index = 0; index < currentRole.inherited.length; index++) {
//         const element = currentRole.inherited[index];
//         getInheritedRole(element, new Set(resFinal));
//       }
//     }

//     const keyword = role;
//     for (let index = 0; index < rules[keyword].inherited!.length; index++) {
//       const element = rules[keyword].inherited![index];
//       getInheritedRole(element);
//     }
//     return resFinal;
//   }
//   Object.keys(rules).forEach((key) => {
//     if (!rules[key]) {
//       inheritaceMap[key] = [key];
//       return;
//     }

//     if (rules[key].inherited === undefined) {
//       inheritaceMap[key] = [key];
//     } else {
//       inheritaceMap[key] = Helper(key);
//     }
//   });
//   return inheritaceMap;
// }
