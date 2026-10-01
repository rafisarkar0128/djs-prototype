// clearing the console before initializing.
console.clear();

// Load environment variables from .env file
import 'dotenv/config';
import { BotClient } from '#structures/index.js';

// Initializing the client with necessary intents and partials
const client = new BotClient();
client.start();
