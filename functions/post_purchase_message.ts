import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const PostPurchaseMessage = DefineFunction({
  callback_id: "post_purchase_message",
  title: "Post a purchase to channel",
  description: "Create aa purchase message from submitted form",
  source_file: "functions/post_purchase_message.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      productType: {
        type: Schema.types.string,
        description:
          "Type of product (book, course, certification, trainning, etc.)",
      },
      productName: {
        type: Schema.types.string,
        description: "A brief description of the product",
      },
      productLink: {
        type: Schema.types.string,
        description: "Link to the product",
      },
      expectedDate: {
        type: Schema.types.string,
        description:
          "Usefull when the product hasn't been purchased yet by the user",
      },
      purchasedDate: {
        type: Schema.types.string,
        description: "Date of the purchase",
      },
      currency: {
        type: Schema.types.string,
        description: "Use USD dollars as the default currency for the product",
      },
      price: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
      exchangeRate: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
    },
    required: [
      "submitting_user",
      "productName",
      "productLink",
      "productType",
      "price",
      "exchangeRate",
      "currency",
      "channel",
    ],
  },
  output_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      productType: {
        type: Schema.types.string,
        description:
          "Type of product (book, course, certification, trainning, etc.)",
      },
      productName: {
        type: Schema.types.string,
        description: "A brief description of the product",
      },
      productLink: {
        type: Schema.types.string,
        description: "Link to the product",
      },
      expectedDate: {
        type: Schema.types.string,
        description:
          "Usefull when the product hasn't been purchased yet by the user",
      },
      purchasedDate: {
        type: Schema.types.string,
        description: "Date of the purchase",
      },
      currency: {
        type: Schema.types.string,
        description: "Use USD dollars as the default currency for the product",
      },
      price: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
      exchangeRate: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
    },
    required: [
      "submitting_user",
      "productName",
      "productLink",
      "productType",
      "price",
      "exchangeRate",
      "currency",
    ],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  PostPurchaseMessage,
  async ({ inputs, client }) => {
    const {
      channel,
      productType,
      productName,
      productLink,
      expectedDate,
      purchasedDate,
      currency,
      price,
      exchangeRate,
      submitting_user,
    } = inputs;

    // Invoke Clojure endpoint to register the Learning Budget Request.
    await fetch("http://localhost:3000/purchase-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user-email": "arturo.velarde@kzsoftworks.com",
        "product-name": productName,
        "product-link": productLink,
        "product-expected-date": expectedDate,
        "product-type": productType,
        price: price,
        "exchange-rate": exchangeRate,
        currency: currency,
        "purchase-date": purchasedDate,
      }),
    });

    // Send a message to channel using a nicely formatted
    // message using block elements from Block Kit.
    // https://api.slack.com/block-kit
    await client.chat.postMessage({
      channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Learning budget request submission from <@${submitting_user}>*`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Details:*\nItem: ${productName}\nLink: ${productLink}\nType: ${productType}\nCurrency: ${currency}\nPrice: ${price}\nExchange Rate: ${exchangeRate}\nExpected Date: ${expectedDate}\nPuchase Date: ${purchasedDate}\n\n`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Your request has been accepted and is now pending approval. You will be notified once the request has been approved or rejected.`,
          },
        },
      ],
    });

    // Return all inputs as outputs for consumption in subsequent functions
    return {
      outputs: {
        channel,
        productName,
        productLink,
        productType,
        expectedDate,
        purchasedDate,
        currency,
        price,
        exchangeRate,
        submitting_user,
      },
    };
  }
);
