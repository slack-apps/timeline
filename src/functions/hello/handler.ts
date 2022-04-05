import { App, AwsLambdaReceiver } from '@slack/bolt';
import { AwsCallback, AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import { isFileShareEvent, isGenericMessageEvent } from '@libs/helper';
import { Channel } from '@guards/channel';
import { Permalink } from '@guards/permalink';

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env['SLACK_SIGNING_SECRET'] as string,
});

const app = new App({
  token: process.env['SLACK_BOT_TOKEN'] as string,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

app.event('message', async ({ message, event, client, logger }) => {
  if (!isGenericMessageEvent(message) && !isFileShareEvent(message)) {
    return;
  }

  if (!!message.thread_ts) {
    return;
  }

  let channel;
  try {
    const result = await client.conversations.info({
      channel: event.channel,
    });
    ({ channel } = result);
  } catch (error) {
    logger.error(error);

    return;
  }

  if (!Channel.guard(channel)) {
    logger.error(channel);

    return;
  }

  if (!(channel.name.startsWith('times-') && channel.name.endsWith('-public'))) {
    return;
  }

  let permalink;
  try {
    const result = await client.chat.getPermalink({
      channel: event.channel,
      message_ts: event.ts,
    });
    ({ permalink } = result);
  } catch (error) {
    logger.error(error);

    return;
  }

  if (!Permalink.guard(permalink)) {
    logger.error(permalink);

    return;
  }

  try {
    await client.chat.postMessage({
      channel: process.env['CHANNEL_TO_NOTIFY'] as string,
      text: permalink,
      unfurl_links: true,
      unfurl_media: true,
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports.main = async (event: AwsEvent, context: any, callback: AwsCallback) => {
  const handler = await awsLambdaReceiver.start();

  return handler(event, context, callback);
};
