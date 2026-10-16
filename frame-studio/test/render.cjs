const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const config=require('../config.cjs');
const {server}=require('../server.cjs');
async function main(){
  const errors=require('../doctor.cjs').check();assert.equal(errors.length,0,errors.join('\n'));
  const dir=path.join(__dirname,'../test-results');fs.mkdirSync(dir,{recursive:true});
  const fixture=path.join(dir,'synthetic.mp4');
  const run=args=>{const r=spawnSync(config.ffmpeg,args,{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr||r.error?.message);return r.stderr;};
  run(['-y','-f','lavfi','-i','testsrc2=size=320x180:rate=24','-f','lavfi','-i','sine=frequency=440','-t','1','-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac',fixture]);
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  try{
    let response=await fetch(base+'/api/upload',{method:'POST',headers:{'X-Filename':'synthetic.mp4'},body:fs.readFileSync(fixture)});assert.equal(response.status,200);const upload=await response.json();
    response=await fetch(base+'/api/generate',{method:'POST',body:JSON.stringify({uploadId:upload.id,handle:'@frame.test',format:'post',variants:[{template:'poster',title:'Criação com emoção: teste local.',color:'#ffffff'}]})});assert.equal(response.status,202);const job=await response.json();let result;
    for(let i=0;i<120;i++){result=await(await fetch(base+'/api/jobs/'+job.id)).json();if(['done','error'].includes(result.status))break;await new Promise(r=>setTimeout(r,500));}
    assert.equal(result.status,'done',JSON.stringify(result));const file=path.join(dir,'export.mp4');fs.writeFileSync(file,Buffer.from(await(await fetch(base+result.files[0].url)).arrayBuffer()));
    const log=run(['-hide_banner','-i',file,'-f','null','-']);assert.match(log,/1080x1350/);assert.match(log,/Audio: aac/);
    assert.equal(fs.readFileSync(path.join(__dirname,'../data',job.id,'handle.txt'),'utf8'),'@frame.test');
    console.log('PASS: upload, exportação 1080x1350, áudio AAC, @ e download.');
  }finally{server.close();server.closeAllConnections();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
