const fs = require('fs');

const FILE = './.env';
let env;

try {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, JSON.stringify(process.env, null, 2), 'utf8');
    }
    env = fs.readFileSync(FILE, 'utf8');
} catch(err) {
    console.error(err)
}

module.exports = env;
