import RBACProvider from "../provider";
import { InheritanceMapType, RoleDataType, RulesType } from "../type";

export default class JsonProvider extends RBACProvider {
  protected _inheritanceMap: InheritanceMapType;
  constructor(rules: RulesType) {
    super(rules);
    this._inheritanceMap = this.compileInheritanceMap();
  }

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

  //only collect permission from a role
  getPermission(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    return this._rules[role].permissions || [];
  }

  //get the whole permission with, his inherrited permission
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

  getAttributes(role: string): string[] {
    if (this._rules[role] === undefined) {
      return [];
    }
    return this._rules[role].attributes || [];
  }

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

  getUserRoles(roles: string[]): InheritanceMapType {
    const map: InheritanceMapType = {};
    for (const role of roles) {
      map[role] = [role, ...this._inheritanceMap[role]];
    }
    return map;
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
