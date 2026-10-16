const {test}=require('node:test');
const assert=require('node:assert/strict');
const {layout,formats,wrap}=require('../public/layout.js');
test('todos os formatos mantêm vídeo e identidade dentro da composição',()=>{
  for(const format of Object.keys(formats))for(const template of ['editorial','poster','frame']){
    const title='Texto de teste com acentuação e várias palavras para conferir o espaço disponível';
    const l=layout(template,format,title),lines=wrap(title).split('\n').length;
    assert.equal(l.w,1080);assert.equal(l.h,formats[format].h);
    assert(l.videoY>=0);assert(l.videoY+l.videoH<=l.handleY);
    assert(l.titleY+lines*(l.size+l.line)<l.h);
    if(template==='frame')assert(l.videoY+l.videoH<=l.titleY);
    else assert(l.titleY+lines*(l.size+l.line)<l.videoY);
  }
});
test('quebra de linha preserva palavras e acentos',()=>{
  const value='Criação com emoção: ação, café e novas ideias!';
  assert.equal(wrap(value).replace(/\n/g,' '),value);
  assert(wrap(value).split('\n').every(line=>line.length<=25));
});
