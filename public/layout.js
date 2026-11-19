(function(root){
const formats={reels:{w:1080,h:1920,label:'Reels · 9:16'},story:{w:1080,h:1920,label:'Story · 9:16'},post:{w:1080,h:1350,label:'Post · 4:5'},square:{w:1080,h:1080,label:'Post · 1:1'}};
function wrap(text){return text.trim().split(/\s+/).reduce((a,w)=>{let i=a.length-1;if(a[i].length+w.length+1>25)a.push(w);else a[i]+=(a[i]?' ':'')+w;return a},['']).join('\n');}
function layout(template,format,title=''){const f=formats[format],tall=f.h===1920;const size=Math.min(template==='frame'?46:48,Math.floor(210/wrap(title).split('\n').length)-12);const header=tall?380:300;const footer=tall?300:160;
return {...f,size,line:12,titleY:template==='frame'?f.h-(tall?560:370):(tall?150:70),videoY:template==='frame'?(tall?220:60):header,videoH:template==='frame'?f.h-(tall?850:490):f.h-header-footer,handleY:f.h-(tall?180:85),handleSize:32,boxed:template==='poster'};}
const api={formats,wrap,layout};if(typeof module!=='undefined')module.exports=api;else root.FrameLayout=api;
})(typeof window!=='undefined'?window:this);
