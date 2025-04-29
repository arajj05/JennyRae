// modules/support.js
const { askAI } = require('../rae');
exports.handleSupport = async (msg)=>{
  const reply = await askAI(`Customer says: "${msg}". Reply helpfully.`);
  console.log('[Support]',reply);
};
