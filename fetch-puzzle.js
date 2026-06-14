const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_JSON = path.join(__dirname, 'puzzle.json');
const OUTPUT_JS = path.join(__dirname, 'puzzle-data.js');

https
  .get('https://lichess.org/api/puzzle/daily', (res) => {
    if (res.statusCode !== 200) {
      process.stderr.write(`HTTP ${res.statusCode}\n`);
      process.exit(1);
    }

    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      const { game, puzzle } = JSON.parse(body);
      const payload = {
        id: puzzle.id,
        fen: game.fen ?? puzzle.fen,
        solution: puzzle.solution,
        rating: puzzle.rating,
      };

      fs.writeFileSync(OUTPUT_JSON, JSON.stringify(payload, null, 2) + '\n');
      fs.writeFileSync(OUTPUT_JS, `window.__PUZZLE__=${JSON.stringify(payload)};\n`);
      process.stdout.write(`puzzle.json / puzzle-data.js (${puzzle.id})\n`);
    });
  })
  .on('error', (err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
