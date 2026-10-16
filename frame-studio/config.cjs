const fs = require('node:fs');
const path = require('node:path');
const localFile = path.join(__dirname, 'config.local.json');
const local = fs.existsSync(localFile) ? JSON.parse(fs.readFileSync(localFile, 'utf8')) : {};
const candidates = [
  path.join(process.env.WINDIR || 'C:/Windows', 'Fonts', 'arialbd.ttf'),
  '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
];
const port = Number(process.env.PORT || local.port || 4318);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve estar entre 1 e 65535.');
module.exports = {
  ffmpeg: process.env.FFMPEG_PATH || local.ffmpegPath || 'ffmpeg',
  font: process.env.FONT_PATH || local.fontPath || candidates.find(p => fs.existsSync(p)),
  port,
};
