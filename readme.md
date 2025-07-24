# RABC

A lightweight and flexible Role-Based Access Control (RBAC) library for Node.js, written in TypeScript. This library enables developers to manage user permissions and roles with support for role inheritance and dynamic attribute-based constraints. It provides a clean API for checking permissions, validating attributes, and integrating with custom data sources through an abstract Provider class.

This is a simple RABC implementation built with typescript with inention to be made as a library for other projects. This module is not dependent on an authentication, a user session, or a datastore system.

## Features

- **Role-Based Access Control**: Assign permissions to roles with support for role inheritance.
- **Attribute Validation**: Enforce dynamic conditions (sync or async) for role eligibility.
- **JSON Provider**: Store and manage RBAC rules in a JSON format with precomputed inheritance maps.
- **TypeScript Support**: Strong typing with generic context for flexible attribute validation.
- **Event Emission**: Emit errors for robust error handling during validation.

## Project Structure

- **`RBACProvider`**: An abstract class defining the interface for retrieving roles, permissions, and attributes.
- **`JsonProvider`**: A concrete implementation of `RBACProvider` that uses JSON rules and precomputes role inheritance.
- **`AttributesManager`**: Manages attribute validation which can handle syncronous and asyncronous methods.
- **`RBAC`**: The core class that integrates `AttributesManager` and `RBACProvider` to check user permissions.

## Example Usage

Below is an example demonstrating how to use the RBAC system to check permissions with role inheritance and attribute validation.

```typescript
import RBAC, {
  AttributesManager,
  DefaultContext,
  JsonProvider,
  RulesType,
} from "..";

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
    attributes: ["asyncAttribute"],
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

interface NewContext extends DefaultContext {
  message: string;
}

const myAttrManager = new AttributesManager<NewContext>();

myAttrManager.setSync("hasSuperPrivilege", ({ message }: NewContext) => {
  return message === "super"; // Check if message is 'super'
});

myAttrManager.setSync("dailySchedule", () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 18; // Allow between 9 AM and 6 PM
});

myAttrManager.setAsync("asyncAttribute", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async check
  return true;
});

const myProvider = new JsonProvider(rules);
const myRBAC = new RBAC<NewContext>(myAttrManager, myProvider);

(async () => {
  const testContext: NewContext = { message: "super" };
  const result = await myRBAC.check(["writer"], "read", testContext);
  console.log(result); // true (writer inherits 'read' from reader)
})();
```

## Testing

To test the RBAC system:

1. Create a test file (e.g., `test.ts`) with the example usage above.
2. Compile and run:
   ```bash
   npx tsc && node dist/test.js
   ```
3. Verify the output matches expected permission checks.
4. Use a testing framework like Jest for unit tests:
   ```bash
   npm install jest @types/jest ts-jest --save-dev
   npx ts-jest config:init
   ```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## Acknowledgement

This project is inspired by https://github.com/yanickrochon/rbac-a

### Contact me

Email : kennylisal5@gmail.com <br>
Linkedin : https://www.linkedin.com/in/kenny-handy-lisal/
