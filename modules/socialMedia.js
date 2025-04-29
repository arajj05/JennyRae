// modules/socialMedia.js 
require('dotenv').config();
const WEBSITE_URL   = process.env.WEBSITE_URL || "https://www.solvarispublishing.com";
const PAYPAL_LINK   = process.env.PAYPAL_LINK || "https://www.paypal.com/ncp/payment/6KUG2SCKQS8ZY";
const CASHAPP_LINK  = process.env.CASHAPP_LINK || "https://cash.app/$amaruzzo";
const ZELLE_EMAIL   = process.env.ZELLE_EMAIL || "arajj05@gmail.com";

// Posting content on social media
async function postContent(){
  const msg = `🔥 Check out Solvaris Publishing for top-notch author support: ${WEBSITE_URL}`;
  console.log(`[Social] Public Post: ${msg}`);
  // You can replace this with actual code to post on social media APIs like Twitter, Facebook, Instagram, etc.
}

// Sending private messages (DMs)
async function sendPrivateMessage(userId,text){
  let reply;
  if(/paypal/i.test(text))   reply = `PayPal: ${PAYPAL_LINK}`;
  else if(/cashapp/i.test(text)) reply = `CashApp: ${CASHAPP_LINK}`;
  else if(/zelle/i.test(text))   reply = `Zelle: ${ZELLE_EMAIL}`;
  else reply = `How can I assist you?`;
  console.log(`[Social] DM to ${userId}: ${reply}`);
  // Replace this with actual code to send messages via DM on platforms like Instagram, Twitter, etc.
  return reply;
}

module.exports = { postContent, sendPrivateMessage };
