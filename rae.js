// rae.js — Main Entrypoint
require('dotenv').config();
const cron            = require('node-cron');
const openai          = require('openai');

// Core modules
const { hustleLoop }  = require('./modules/hustle');
const { doMission }   = require('./modules/missionControl');
const { selfUpdate }  = require('./modules/updater');
const { loadPlugins, runPlugins } = require('./modules/plugins');
const { introspect }  = require('./modules/metaLearn');
const { selfAudit }   = require('./modules/utils');

// ——— CONFIG (no placeholders!) ———
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
// ————————————————

openai.apiKey = process.env.OPENAI_API_KEY;

// AI helper
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

// Expose for modules if needed
module.exports.askAI  = askAI;
module.exports.CONFIG = CONFIG;

// ——— STARTUP BLAST ———
;(async ()=>{
  console.log('🚀 JennyRae starting...');
  selfAudit();
  loadPlugins();
  await hustleLoop();
  await doMission();
  await postContent(); // initial public post
})();

// ——— CRON JOBS ———
// Every minute
cron.schedule('* * * * *', async () => {
  await hustleLoop();
  await runPlugins();
  await postContent();
});

// Hourly on the hour
cron.schedule('0 * * * *', async () => {
  await selfUpdate();
  selfAudit();
});

// Daily mission & introspect
cron.schedule(CONFIG.dailyCron, async () => {
  await doMission();
  await introspect();
});

// ——— PUBLIC POST FUNCTION ———
async function postContent() {
  const post = `🔥 Check out Solvaris Publishing for top-notch author support: ${CONFIG.raeInfo.website}`;
  console.log(`Posting: "${post}"`);
  // integrate with your social APIs here
}

// ——— PRIVATE DM HANDLER ———
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

// Graceful error handling
process.on('uncaughtException',  err => { console.error('Uncaught:', err);  selfAudit(); });
process.on('unhandledRejection', err => { console.error('Rejected:', err); selfAudit(); });
