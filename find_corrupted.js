const fs = require('fs');
const path = require('path');

const storageDir = 'C:\\Users\\Dmitry\\AppData\\Roaming\\Code\\User\\globalStorage\\saoudrizwan.claude-dev';
const logFile = 'c:\\cline-build\\corrupted_files.txt';

fs.writeFileSync(logFile, '', 'utf8');

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file.endsWith('.json')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.trim()) {
                    JSON.parse(content);
                }
            } catch (err) {
                const msg = `Corrupted: ${fullPath} (Size: ${stat.size} bytes) - Error: ${err.message}\n`;
                fs.appendFileSync(logFile, msg, 'utf8');
            }
        }
    }
}

scanDir(storageDir);
console.log('Done scanning.');
