import { InheritanceMapType, RulesType } from "../types";

const rules: RulesType = {
  user: {
    inherited: [],
    permissions: ["exist"],
  },
  reader: {
    permissions: ["read"],
    inherited: ["user"],
  },
  writer: {
    permissions: ["create"],
    inherited: ["reader"],
  },
  editor: {
    permissions: ["update"],
    inherited: ["reader"],
    attributes: ["dailySchedule"],
  },
  director: {
    permissions: ["delete"],
    inherited: ["reader", "editor"],
  },
  admin: {
    permissions: ["manage"],
    inherited: ["director"],
    attributes: ["hasSuperPrivilege"],
  },
};

function compileInheritanceMap(rules: RulesType): InheritanceMapType {
  const inheritaceMap: InheritanceMapType = {};
  function Helper(role: string) {
    let resFinal: string[] = [];

    function getInheritedRole(role: string, visited: Set<string> = new Set()) {
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

console.log(compileInheritanceMap(rules));

console.log("hello world");
