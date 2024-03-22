import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PostPurchaseMessage } from "../functions/post_purchase_message.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 */
const SubmitPurchaseWorkflow = DefineWorkflow({
  callback_id: "submit_purchase",
  title: "Submit Learning Budget request",
  description: "Submit a Learning Budget request to the channel",
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
const inputForm = SubmitPurchaseWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit a purchase",
    interactivity: SubmitPurchaseWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "productType",
          title: "Type",
          type: Schema.types.string,
          enum: [":white_circle:", ":large_blue_circle:", ":red_circle:"],
          choices: [
            {
              value: "BOOK",
              title: "Books",
              description: "Books, e-books, etc.",
            },
            {
              value: "COURSE",
              title: "Courses",
              description: "Online courses, trainings, etc.",
            },
            {
              value: "SUBSCRIPTION",
              title: "Subscriptions",
              description: "Magazines, newspapers, etc.",
            },
            {
              value: "CERTIFICATION",
              title: "Certification",
              description: "Certifications, exams, etc.",
            },
            {
              value: "OTHER",
              title: "Other",
              description: "Other types of learning items",
            },
          ],
        },
        {
          name: "productName",
          title: "Item name",
          type: Schema.types.string,
          long: false,
        },
        {
          name: "productLink",
          title: "Link to the item",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "currency",
          title: "Currency",
          type: Schema.types.string,
          enum: [":white_circle:", ":large_blue_circle:", ":red_circle:"],
          choices: [
            {
              value: "USD",
              title: "US Dollars",
            },
            {
              value: "EUR",
              title: "Euros",
            },
            {
              value: "ARG",
              title: "Argentinian Pesos",
            },
            {
              value: "REA",
              title: "Reals",
            },
          ],
        },
        {
          name: "price",
          title: "Full price",
          type: Schema.types.number,
        },
        {
          name: "exchangeRate",
          title: "Exchange rate",
          type: Schema.types.number,
          description: "1 USD = ?",
        },
        {
          name: "expectedDate",
          title: "Expected date of purchase",
          type: Schema.types.string,
        },
        {
          name: "purchaseDate",
          title: "Date of the actual purchase",
          type: Schema.types.string,
        },
      ],
      required: [
        "productType",
        "productName",
        "productLink",
        "currency",
        "price",
        "exchangeRate",
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
SubmitPurchaseWorkflow.addStep(PostPurchaseMessage, {
  channel: SubmitPurchaseWorkflow.inputs.channel,
  submitting_user: inputForm.outputs.interactivity.interactor.id,
  productType: inputForm.outputs.fields.productType,
  productName: inputForm.outputs.fields.productName,
  productLink: inputForm.outputs.fields.productLink,
  expectedDate: inputForm.outputs.fields.expectedDate,
  purchasedDate: inputForm.outputs.fields.purchaseDate,
  currency: inputForm.outputs.fields.currency,
  price: inputForm.outputs.fields.price,
  exchangeRate: inputForm.outputs.fields.exchangeRate,
});

export default SubmitPurchaseWorkflow;
