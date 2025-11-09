const fs = require('fs');
const path = 'v:/VS_Repos/VS_Code/Shopify/Themes/WigShop/temp_product_egepicavg.html';
const html = fs.readFileSync(path, 'utf8');
const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) scripts.push({ attrs: match[1], content: match[2] });
console.log('Found', scripts.length, 'scripts');
const i = 48; // zero-based index for script 49
if (scripts[i]) {
  fs.writeFileSync('v:/VS_Repos/VS_Code/Shopify/Themes/WigShop/temp_script_49.js', scripts[i].content, 'utf8');
  console.log('Wrote temp_script_49.js length', scripts[i].content.length);
  console.log('Preview first 500 chars:\n', scripts[i].content.slice(0, 500));
} else console.log('No script at index', i);
