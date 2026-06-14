const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/vendor/chess/pieces-pink');
const primary = '#db2777';
const dark = '#831843';
const soft = '#fdf2f8';

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  let svg = fs.readFileSync(path.join(dir, file), 'utf8');
  const isWhite = file.startsWith('w');

  if (isWhite) {
    svg = svg.replace(/stroke="#000"/g, `stroke="${primary}"`);
    svg = svg.replace(/stroke="#db2777"/g, `stroke="${primary}"`);
    svg = svg.replace(/fill="#fff"/g, `fill="#ffffff"`);
    svg = svg.replace(/fill="#fdf2f8"/g, `fill="#ffffff"`);
  } else {
    svg = svg.replace(/fill="#000"/g, `fill="${primary}"`);
    svg = svg.replace(/stroke="#000"/g, `stroke="${dark}"`);
    svg = svg.replace(/stroke="#ececec"/g, `stroke="${soft}"`);
  }

  fs.writeFileSync(path.join(dir, file), svg);
}
