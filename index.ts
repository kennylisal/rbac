import * as RBAC from "./lib/rbac";
import * as RBACProvider from "./lib/provider";
import * as AttributesManager from "./lib/attribute-manager";
import * as JsonProvider from "./lib/providers/json";

// // Export RBAC as default and named export
export default RBAC;
export { RBAC };

export { RBACProvider, AttributesManager };

export const providers = {
  JsonProvider,
};
