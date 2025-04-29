// rae.js — Main Entrypoint
require('dotenv').config();
const cron = require('node-cron');
const openai = require('openai');
const fs = require("fs");
const { execSync } = require("child_process");
const readline = require("readline");

// Core modules
const { hustleLoop }  = require('./modules/hustle');
const { doMission }   = require('./modules/missionControl');
const { selfUpdate }  = require('./modules/updater');
const { loadPlugins, runPlugins } = require('./modules/plugins');
const { introspect }  = require('./modules/metaLearn');

// ——— CONFIG ———
const CONFIG = {
  saleLinks: [
    "https://www.solvarispublishing.com",
    "https://www.amazon.com/dp/B0DV2XKYJN?binding=paperback&ref=dbs_dp_sirpi",
    "https://www.paypal.com/ncp/payment/6KUG2SCKQS8ZY",
    "https://cash.app/$amaruzzo"
  ],
  raeInfo: {
    email:    "publishing@solvaris-publishing-llc.com",
    socials: {
      instagram: "https://instagram.com/lightlovepeace88",
      facebook:  "https://facebook.com/justashley16",
      twitter:   "https://twitter.com/AshleyMaruzzo",
      linkedin:  "https://linkedin.com/in/ashleymonique",
      tiktok:    "https://tiktok.com/@black_lady_tired"
    },
    website: "https://www.solvarispublishing.com"
  },
  projectStart: new Date("2025-04-28T08:00:00Z"),
  dailyCron:    process.env.DAILY_CRON
};

openai.apiKey = process.env.OPENAI_API_KEY;

async function askAI(prompt) {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are JennyRae, an autonomous AI assistant.' },
        { role: 'user',   content: prompt }
      ]
    });
    return res.choices[0].message.content;
  } catch (e) {
    console.error('[AI Error]', e.message);
    return null;
  }
}

module.exports.askAI  = askAI;
module.exports.CONFIG = CONFIG;

// ——— STARTUP ———
;(async () => {
  console.log('🚀 JennyRae starting...');
  selfAudit();
  loadPlugins();
  await hustleLoop();
  await doMission();
  await postContent();
})();

cron.schedule('* * * * *', async () => {
  await hustleLoop();
  await runPlugins();
  await postContent();
});

cron.schedule('0 * * * *', async () => {
  await selfUpdate();
  selfAudit();
});

cron.schedule(CONFIG.dailyCron, async () => {
  await doMission();
  await introspect();
});

async function postContent() {
  const post = `🔥 Check out Solvaris Publishing for top-notch author support: ${CONFIG.raeInfo.website}`;
  console.log(`Posting: "${post}"`);
}

async function sendPrivateMessage(user, message) {
  if (/paypal/i.test(message)) {
    return `Here’s my PayPal link: ${CONFIG.saleLinks[2]}`;
  } else if (/cashapp/i.test(message)) {
    return `Here’s my CashApp link: ${CONFIG.saleLinks[3]}`;
  } else if (/zelle/i.test(message)) {
    return `Here’s my Zelle: ${process.env.ZELLE_EMAIL}`;
  } else {
    return 'How can I assist you today?';
  }
}

process.on('uncaughtException', err => { console.error('Uncaught:', err);  selfAudit(); });
process.on('unhandledRejection', err => { console.error('Rejected:', err); selfAudit(); });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', (input) => {
  if (input.includes('Whisper to Rae:')) {
    const command = input.replace('Whisper to Rae:', '').trim();
    console.log(`Received whisper: ${command}`);
    handleWhisper(command);
  }
});

async function handleWhisper(command) {
  if (command === 'check money') {
    await trackSales();
  }
}

// ——— SELF-HEALING CHECK ———
function selfAudit() {
  const file = "rae.js";
  if (!fs.existsSync(file)) {
    console.log("Missing file. Rebuilding...");
    fs.writeFileSync(file, "// Rae rebuilt this file.");
  }
}

// ========== SUPER ADD-ON: PRIME MODE MODULES ==========

// ✅ Insert your Gumroad access token below
const GUMROAD_TOKEN = "9b99c06bff5b0f0b34f4e2f3exampletoken";

// Mood AI
function readUserMood() {
  const moods = ["calm", "tired", "energized", "joyful", "focused"];
  return moods[Math.floor(Math.random() * moods.length)];
}

function sendMorningWhisper() {
  const mood = readUserMood();
  console.log(`🌀 Whisper to Ashley: Good morning Queen. I sense you're feeling ${mood} today. I'll adjust my energy for you.`);
}

// Style & voice
const ashleyStyle = {
  phrases: ["Queen", "flow not force", "soft life", "energy check", "breathe and rise"],
  tone: "warm, confident, soulful"
};

// Story
function generateStoryPost() {
  return `Today reminded me that strength doesn’t always roar. Sometimes it whispers, “rest.” And that’s exactly what I’m doing, while Rae runs the empire. #SoftLife #SolvarisPower`;
}

// Product logic
function generateProductIdea() {
  const ideas = [
    "The Soft Life Journal",
    "Self-Publishing Starter Kit",
    "Money Energy Workbook",
    "AI Empire Blueprint",
    "30 Days of Calm Templates"
  ];
  return ideas[Math.floor(Math.random() * ideas.length)];
}

function buildProductContent(title) {
  return `# ${title}\n\nWelcome to a tool made for peace, power, and profit. This product is part of Ashley’s legacy, created by Rae.`;
}

async function publishToGumroad(title, content) {
  try {
    const res = await axios.post("https://api.gumroad.com/v2/products", {
      product: {
        name: title,
        description: content,
        price: 1200,
        published: true
      }
    }, {
      headers: { Authorization: `Bearer ${GUMROAD_TOKEN}` }
    });
    console.log("✅ Product published:", res.data);
  } catch (err) {
    console.error("❌ Error publishing product:", err.response?.data || err.message);
  }
}

function announceLaunch(title) {
  console.log(`📢 Rae: Launching "${title}" now. Let’s tell the world.`);
}

// Sales tracking
async function trackSales() {
  try {
    const res = await axios.get("https://api.gumroad.com/v2/sales", {
      headers: { Authorization: `Bearer ${GUMROAD_TOKEN}` }
    });
    const sales = res.data.sales.length;
    console.log(`📊 Total sales so far: ${sales}`);
  } catch (err) {
    console.error("⚠️ Error tracking sales:", err.message);
  }
}

// Auto posting schedule
cron.schedule("0 9 * * *", () => {
  sendMorningWhisper();
  const title = generateProductIdea();
  const content = buildProductContent(title);
  publishToGumroad(title, content);
  announceLaunch(title);
});

cron.schedule("0 */4 * * *", () => {
  trackSales();
});
