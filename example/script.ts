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

myAttrManager.set("hasSuperPrivilege", ({ message }: NewContext) => {
  return message === "super"; // Example: check if message is "super"
});

myAttrManager.set("dailySchedule", () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 18;
});

myAttrManager.set("asyncAttribute", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
});

const myProvider = new JsonProvider(rules);

const myRBAC = new RBAC.RBAC<NewContext>(myAttrManager, myProvider);

(async () => {
  const testContext: NewContext = { message: "super" };
  const result = await myRBAC.check(["writer"], "read", testContext);
  console.log(result);
})();
