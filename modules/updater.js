// modules/updater.js
const { execSync } = require('child_process');
const { selfAudit } = require('./utils');

async function selfUpdate(){
  console.log('[Updater] Pulling latest code from git…');
  try{
    execSync('git pull origin main',{stdio:'inherit'});
    console.log('[Updater] Installing dependencies…');
    execSync('npm install',{stdio:'inherit'});
    console.log('[Updater] Update complete.');
  }catch(e){
    console.error('[Updater] Update failed:',e.message);
  }
  selfAudit();
}

module.exports={selfUpdate};
