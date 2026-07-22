const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.js');
let c = fs.readFileSync(filePath, 'utf8');

// Replace literal \x3c/ with </
const lt = String.fromCharCode(60);
const slash = String.fromCharCode(47);

const search1 = '\x5c\x78\x33\x63' + slash; // \x3c/
const search2 = '\x5c\x78\x33\x63'; // \x3c

while (c.includes(search1)) {
  c = c.replace(search1, lt + slash);
}
while (c.includes(search2)) {
  c = c.replace(search2, lt);
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Fixed! Contains </div>:', c.includes(lt + slash + 'div' + lt));
