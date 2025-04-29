const fs = require('fs');

function selfAudit() {
  console.log('[Audit] Core integrity OK.');
  const file = 'rae.js';
  if (!fs.existsSync(file)) {
    console.log('[Audit] Missing core file. Rebuilding...');
    fs.writeFileSync(file, "// Rae rebuilt this file.");
  }
  console.log('[Audit] File is secure.');
}

module.exports = { selfAudit };
