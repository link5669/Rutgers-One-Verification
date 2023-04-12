const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

CAMDEN_ROLE_ID = '1079187979098148975'
NEW_BRUNSWICK_ROLE_ID = '1079187896147390576'
NEWARK_ROLE_ID = '1079187951541563504'
RUTGERS_ROLE_ID = '1073280027111731230'
COMMUNITY_ROLE_ID = '1073279680435732590'
VERIFIED_ROLE_ID = '1082840558076186687'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	hasRoles = 0
	hasCampus = false
	hasAffiliation = false
	try {
		for(let i = 0; i < interaction.member._roles.length; i++) {	
			role = interaction.member._roles[i]
			if (role == VERIFIED_ROLE_ID) {
				console.log("already verified")
				hasRoles = 2
				break
			}
			if (role == CAMDEN_ROLE_ID || role == NEW_BRUNSWICK_ROLE_ID || role == NEWARK_ROLE_ID) {
				console.log("has campus")
				hasCampus = true
			}
			if (role == RUTGERS_ROLE_ID || role == COMMUNITY_ROLE_ID) {
				console.log("has affiliation")
				hasAffiliation = true
			}
		}
		if (hasCampus && hasAffiliation && hasRoles == 0) {
			hasRoles = 1
		}
		await command.execute(interaction, hasRoles, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token	);
