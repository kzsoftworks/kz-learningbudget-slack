import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SubmitPurchaseWorkflow from "../workflows/submit_purchase.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const submitPurchase: Trigger<typeof SubmitPurchaseWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Submit Learning Budget request",
  description: "Submit a purchase to the channel",
  workflow: "#/workflows/submit_purchase",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default submitPurchase;
