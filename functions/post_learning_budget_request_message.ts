import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import channel_canvas_create from "deno-slack-sdk/schema/slack/functions/channel_canvas_create.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const PostLearningBudgetRequestMessage = DefineFunction({
  callback_id: "post_learning_budget_message",
  title: "Post a learning budget request message",
  description:
    "This function posts a message to a channel with a learning budget request and start the approval process.",
  source_file: "functions/post_learning_budget_request_message.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      submitting_user_email: {
        type: Schema.types.string,
        //TODO: This should come out of slack. Perhaps we need to get user info based on the user_id.
      },
      product_type: {
        type: Schema.types.string,
        description:
          "Type of product (book, course, certification, trainning, etc.)",
      },
      product_name: {
        type: Schema.types.string,
        description: "A brief description of the product",
      },
      product_link: {
        type: Schema.types.string,
        description: "Link to the product",
      },
      expected_date: {
        type: Schema.types.string,
        description:
          "Usefull when the product hasn't been purchased yet by the user",
      },
      purchased_date: {
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
      exchange_rate: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
    },
    required: [
      "submitting_user",
      "submitting_user_email",
      "product_name",
      "product_link",
      "product_type",
      "price",
      "exchange_rate",
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
      submitting_user_email: {
        type: Schema.types.string,
        //TODO: This should come out of slack. Perhaps we need to get user info based on the user_id.
      },
      product_type: {
        type: Schema.types.string,
        description:
          "Type of product (book, course, certification, trainning, etc.)",
      },
      product_name: {
        type: Schema.types.string,
        description: "A brief description of the product",
      },
      product_link: {
        type: Schema.types.string,
        description: "Link to the product",
      },
      expected_date: {
        type: Schema.types.string,
        description:
          "Usefull when the product hasn't been purchased yet by the user",
      },
      purchased_date: {
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
      exchange_rate: {
        type: Schema.types.number,
        description:
          "Full price of the product in the currency of the user's country",
      },
    },
    required: [
      "submitting_user",
      "submitting_user_email",
      "product_name",
      "product_link",
      "product_type",
      "price",
      "exchange_rate",
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
  PostLearningBudgetRequestMessage,
  async ({ inputs, client }) => {
    const {
      channel,
      submitting_user,
      submitting_user_email,
      product_type,
      product_name,
      product_link,
      expected_date,
      purchased_date,
      currency,
      price,
      exchange_rate,
    } = inputs;

    const productTypeEmoji: { [key: string]: string } = {
      book: ":white_circle:",
      course: ":large_green_circle:",
      subscription: ":large_blue_circle:",
      certification: ":large_yellow_circle:",
      other: ":red_circle:",
    };

    // Invoke Clojure endpoint to register the Learning Budget Request.
    await fetch("http://localhost:3000/purchase-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user-email": submitting_user_email,
        "product-name": product_name,
        "product-link": product_link,
        "product-expected-date": expected_date,
        "product-type": product_type,
        price: price,
        "exchange-rate": exchange_rate,
        currency: currency,
        "purchase-date": purchased_date,
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
            text: `${productTypeEmoji[product_type]} *Learning budget request submission from <@${submitting_user}>*`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Details:*\nItem: ${product_name}\nLink: ${product_link}\nType: ${product_type}\nCurrency: ${currency}\nPrice: ${price}\nExchange Rate: ${exchange_rate}\nExpected Date: ${expected_date}\nPuchase Date: ${purchased_date}\n\n`,
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
        submitting_user,
        submitting_user_email,
        product_name,
        product_link,
        product_type,
        expected_date,
        purchased_date,
        currency,
        price,
        exchange_rate,
      },
    };
  }
);
