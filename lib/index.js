const session = require('cookie-session');
const helmet = require('helmet');
const sslify = require('express-sslify');

const setupSlack = require('./slack');
const setupGitHub = require('./github');
const setupApi = require('./api');
const frontend = require('./frontend');
const errorHandler = require('./error-handler');
const { BotFrameworkAdapter } = require('botbuilder');
const { TeamsConversationBot } = require('./teams/teamsConversationBot');

require('./debugger');

const { SESSION_SECRET } = process.env;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined.');
}

module.exports = (robot) => {
  	const app = robot.route();
	errorHandler.setup(app);

	if (process.env.FORCE_HTTPS) {
		app.use(helmet());
		app.use(sslify.HTTPS({ trustProtoHeader: true }));
		app.use(sslify.HTTPS({ trustProtoHeader: true }));
	}

	const adapter = new BotFrameworkAdapter({
		appId: '13da8773-7da9-4fa4-bb27-68a012905095',
		appPassword: 'q9vGaGGu8HRVPHwAy6eXdD6-H=uAwi=@'
	});

	adapter.onTurnError = async (context, error) => {
		// This check writes out errors to console log .vs. app insights.
		// NOTE: In production environment, you should consider logging this to Azure
		//       application insights.
		console.error(`\n [onTurnError] unhandled error: ${ error }`);

		// Send a trace activity, which will be displayed in Bot Framework Emulator
		await context.sendTraceActivity(
			'OnTurnError Trace',
			`${ error }`,
			'https://www.botframework.com/schemas/error',
			'TurnError'
		);

		// Send a message to the user
		await context.sendActivity('The bot encountered an error or bug.');
		await context.sendActivity('To continue to run this bot, please fix the bot source code.');
	};

	// Create the main dialog.
	const conversationReferences = {};
	const bot = new TeamsConversationBot(conversationReferences);

	app.use((req, res, next)=>{
		console.log("Am I inside middleware?")
		req.adapter = adapter;
		req.conversationReferences = conversationReferences
		next();
	});

	// Listen for incoming requests.
	app.post('/api/messages', (req, res) => {
		console.log("Am I here?")
		adapter.processActivity(req, res, async (context) => {
			await bot.run(context);
		});
	});

	app.get('/api/notify', async (req, res) => {
		console.log('Something here inside notify');
		for (const conversationReference of Object.values(conversationReferences)) {
			await adapter.continueConversation(conversationReference, async turnContext => {
				// If you encounter permission-related errors when sending this message, see
				// https://aka.ms/BotTrustServiceUrl
				await turnContext.sendActivity('proactive hello');
			});
		}
	});

  setupApi(robot);

  app.use(session({
    // See https://github.com/expressjs/cookie-session#keys
    // Remove GITHUB_CLIENT_SECRET in a future PR
    // Since GITHUB_CLIENT_SECRET is not keys[0] it is not used for signing new cookies,
    // just for validating old ones
    keys: [SESSION_SECRET, process.env.GITHUB_CLIENT_SECRET],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // FIXME: bug in superagent/cookiejar that prevents it from saving this
    signed: process.env.NODE_ENV !== 'test',
  }));

  app.use(frontend);

  setupSlack(robot);
  setupGitHub(robot);

  errorHandler.teardown(app);

  // Fetch and cache info about the GitHub App
  robot.info = async function info() { // eslint-disable-line no-param-reassign
    const github = await this.auth();
    const res = await github.apps.getAuthenticated({});

    // Override info method with cached data
    this.info = async () => res.data;

    return res.data;
  };
};
