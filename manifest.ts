import { Manifest } from "deno-slack-sdk/mod.ts";
import { PostPurchaseMessage } from "./functions/post_purchase_message.ts";
import SubmitPurchaseWorkflow from "./workflows/submit_purchase.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "kz-learningbudget-app",
  description:
    "A basic sample that demonstrates purchase submission to channel",
  icon: "assets/default_new_app_icon.png",
  workflows: [SubmitPurchaseWorkflow],
  functions: [PostPurchaseMessage],
  outgoingDomains: ["localhost"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
