const { Subscription, LegacySubscription } = require('../models');
const {
  Subscribed,
  InvalidSubscribeArg,
  NotFound,
  AlreadySubscribed,
  NotSubscribed,
  UpdatedSettings,
} = require('../messages/flow');


const { getTemplateData }  = require('./../handlebar-converter')

/**
 * Subscribes a slack channel to activity from an Organization or Repository
 *
 * Usage:
 *   /github subscribe https://github.com/org/repo
 */
module.exports = async (req, res) => {
  const {
    resource, installation, gitHubUser, slackWorkspace, slackUser,
  } = res.locals;
  const { command } = res.locals;

  req.log.debug({ installation, resource }, `Lookup ${resource.type} to subscribe`);

  // look up the resource
  let from;
  try {
    if (resource.type === 'account') {
      from = (await gitHubUser.client.users.getByUsername({
        username: resource.owner,
      })).data;
    } else {
      from = (await gitHubUser.client.repos.get({
        owner: resource.owner,
        repo: resource.repo,
      })).data;
    }
  } catch (err) {
    req.log.debug({ err }, `Could not find ${resource.type}`);
    return command.respond(new NotFound(command.resource).toJSON());
  }
  const to = command.channel_id;

  let subscription = await Subscription.lookupOne(from.id, to, slackWorkspace.id, installation.id);

  // `Command` is invoking the parser
  const parsedSettings = command.args;

  if (parsedSettings.invalids.length) {
    const errors = parsedSettings.invalids.map(x => x.raw).join(', ');
    return command.respond(new InvalidSubscribeArg(errors));
  }

  if (command.subcommand === 'subscribe') {
    if (subscription) {
      if (parsedSettings.hasValues) {
        req.log.debug(
          { parsedSettings },
          'Subscription already exists, updating settings. New settings: ',
        );

        subscription.enable(parsedSettings);

        // TODO should be move the .save() into enable?
        await subscription.save();
        return command.respond(new UpdatedSettings({ subscription, resource: from }).toJSON());
	  }

      req.log.debug('Subscription already exists');
	  let respon = new AlreadySubscribed(command.resource).toJSON();
	  let text = respon.attachments[0].text

	  let adapter = req.adapter;
	  let conversationReferences = req.conversationReferences

	  let slackData = getTemplateData("slack", "subscribe", {text})
	  let msTeamsData = getTemplateData("msteams", "subscribe", {text})
	  console.log("SlackData"+JSON.stringify(slackData));
	  console.log("MSTeamsData"+JSON.stringify(msTeamsData));

	  for (const conversationReference of Object.values(conversationReferences)) {
	  	await adapter.continueConversation(conversationReference, async turnContext => {
	  		// If you encounter permission-related errors when sending this message, see
	  		// https://aka.ms/BotTrustServiceUrl
	  		await turnContext.sendActivity(msTeamsData);
	  	});
	  }

	  return command.respond(slackData);
	  //return command.respond(new AlreadySubscribed(command.resource).toJSON());
    }
    req.log.debug({ parsedSettings }, 'Subscription does not exist, creating. Settings are: ');

    const githubName = from.full_name || from.login;
    subscription = await Subscription.subscribe({
      channelId: to,
      creatorId: slackUser.id,
      githubId: from.id,
      githubName,
      installationId: installation.id,
      settings: parsedSettings,
      slackWorkspaceId: slackWorkspace.id,
      type: resource.type,
    });

    await LegacySubscription.migrate(subscription);

	let respon = new Subscribed({ resource: from }).toJSON();
	let text = respon.attachments[0].text;
	const bot = new TeamsConversationBot();

	return command.respond();

  } else if (command.subcommand === 'unsubscribe') {
    if (subscription) {
      if (parsedSettings.hasValues) {
        subscription.disable(parsedSettings);
        // TODO should be move the .save() into disable?
        await subscription.save();

        return command.respond(new UpdatedSettings({ subscription, resource: from }).toJSON());
      }
      await Subscription.unsubscribe(from.id, to, slackWorkspace.id);
      return command.respond(new Subscribed({
        resource: from,
        unsubscribed: true,
      }).toJSON());
    }
    return command.respond(new NotSubscribed(command.resource).toJSON());
  }
};
