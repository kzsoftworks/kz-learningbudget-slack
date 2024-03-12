import { Manifest } from "deno-slack-sdk/mod.ts";
import { PostLearningBudgetRequestMessage } from "./functions/post_learning_budget_request_message.ts";
import SubmitPurchaseRequestWorkflow from "./workflows/submit_purchase_request.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "kz-learningbudget-app",
  description:
    "Submit a learning budget request and start the approval process.",
  icon: "assets/default_new_app_icon.png",
  workflows: [SubmitPurchaseRequestWorkflow],
  functions: [PostLearningBudgetRequestMessage],
  outgoingDomains: ["localhost"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
