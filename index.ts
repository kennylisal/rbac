import * as RBAC from "./lib/rbac";
import * as RBACProvider from "./lib/provider";
import AttributesManager from "./lib/attribute-manager";
import JsonProvider from "./lib/providers/json";

// Import types from the type folder (adjust path as needed)
import {
  RoleDataType,
  InheritanceMapType,
  RulesType,
  DefaultContext,
} from "./lib/type";

// // Export RBAC as default and named export
export default RBAC;
export { RBAC };

export { RBACProvider, AttributesManager, JsonProvider };

export { RoleDataType, InheritanceMapType, RulesType, DefaultContext };
