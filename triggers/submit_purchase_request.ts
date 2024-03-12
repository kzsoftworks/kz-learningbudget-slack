import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SubmitPurchaseRequestWorkflow from "../workflows/submit_purchase_request.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const submitPurchaseRequest: Trigger<
  typeof SubmitPurchaseRequestWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "Submit a Learning Budget Request",
  description:
    "Submit a learning budget request and start the approval process.",
  workflow: "#/workflows/submit_purchase_request",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default submitPurchaseRequest;
