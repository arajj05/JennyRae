// modules/hustle.js
const { postContent, sendPrivateMessage } = require('./socialMedia');
async function hustleLoop(){
  await postContent();
  await sendPrivateMessage('user123','I need to make money!');
}
module.exports={hustleLoop};
