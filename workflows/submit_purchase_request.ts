import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PostLearningBudgetRequestMessage } from "../functions/post_learning_budget_request_message.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const SubmitPurchaseRequestWorkflow = DefineWorkflow({
  callback_id: "submit_purchase_request",
  title: "Submit a Learning Budget Request",
  description:
    "This workflow collects information about a learning budget request and posts a message to a channel with the request.",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel", "interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/automation/functions#open-a-form
 */
const inputForm = SubmitPurchaseRequestWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit a Learning Budget Request",
    interactivity: SubmitPurchaseRequestWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "product-type",
          title: "Type",
          type: Schema.types.string,
          enum: [
            ":white_circle:",
            ":large_blue_circle:",
            ":large_green_circle:",
            ":large_yellow_circle:",
            ":red_circle:",
          ],
          choices: [
            {
              value: "BOOK",
              title: ":large_green_circle:  Books",
            },
            {
              value: "COURSE",
              title: ":large_green_circle:  Courses",
            },
            {
              value: "SUBSCRIPTION",
              title: ":large_blue_circle:  Subscriptions",
            },
            {
              value: "CERTIFICATION",
              title: ":large_yellow_circle:  Certification",
            },
            {
              value: "OTHER",
              title: ":red_circle:  Other",
            },
          ],
        },
        {
          name: "product-name",
          title: "Item name",
          type: Schema.types.string,
          long: false,
        },
        {
          name: "product-link",
          title: "Link to the item",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "currency",
          title: "Currency",
          type: Schema.types.string,
          long: false,
        },
        {
          name: "price",
          title: "Full price",
          type: Schema.types.number,
        },
        {
          name: "exchange-rate",
          title: "Exchange rate",
          type: Schema.types.number,
          description: "1 USD = ?",
        },
        {
          name: "expected-date",
          title: "Expected date of purchase",
          type: Schema.types.string,
        },
        ,
        {
          name: "purchase-date",
          title: "Date of the actual purchase",
          type: Schema.types.string,
        },
        {
          name: "user-email",
          title: "Your email",
          type: Schema.types.string,
        },
      ],
      required: [
        "product-type",
        "product-name",
        "product-link",
        "currency",
        "price",
        "exchange-rate",
        "user-email",
      ],
    },
  }
);

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/automation/functions/custom
 */
SubmitPurchaseRequestWorkflow.addStep(PostLearningBudgetRequestMessage, {
  channel: SubmitPurchaseRequestWorkflow.inputs.channel,
  submitting_user: inputForm.outputs.interactivity.interactor.id,
  submitting_user_email: inputForm.outputs.fields.elements["email"],
  product_type: inputForm.outputs.fields.elements["product-type"],
  product_name: inputForm.outputs.fields.elements["product-name"],
  product_link: inputForm.outputs.fields.elements["product-link"],
  expected_date: inputForm.outputs.fields.elements["expected-date"],
  purchased_date: inputForm.outputs.fields.elements["purchase-date"],
  currency: inputForm.outputs.fields.elements["currency"],
  price: inputForm.outputs.fields.elements["price"],
  exchange_rate: inputForm.outputs.fields.elements["exchange-rate"],
});

export default SubmitPurchaseRequestWorkflow;
