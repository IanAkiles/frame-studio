const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const config = require('./config.cjs');
function check() {
  const errors = [];
  if (Number(process.versions.node.split('.')[0]) < 22) errors.push('Instale Node.js 22 ou superior.');
  if (!config.font || !fs.existsSync(config.font)) errors.push('Fonte não encontrada. Configure fontPath em config.local.json.');
  const result = spawnSync(config.ffmpeg, ['-hide_banner', '-filters'], { encoding:'utf8', windowsHide:true });
  if (result.error || result.status !== 0) errors.push('FFmpeg não encontrado. Instale-o no PATH ou configure ffmpegPath em config.local.json.');
  else if (!result.stdout.includes('drawtext')) errors.push('Seu FFmpeg precisa incluir o filtro drawtext (libfreetype).');
  const encoders = spawnSync(config.ffmpeg, ['-hide_banner', '-encoders'], { encoding:'utf8', windowsHide:true });
  if (encoders.status === 0 && !encoders.stdout.includes('libx264')) errors.push('Seu FFmpeg precisa incluir o encoder libx264.');
  return errors;
}
if (require.main === module) {
  const errors = check();
  console.log(errors.length ? errors.join('\n') : 'Tudo pronto: Node.js, FFmpeg, libx264, drawtext e fonte disponíveis.');
  process.exitCode = errors.length ? 1 : 0;
}
module.exports = { check };
