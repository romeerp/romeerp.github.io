import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const posts=JSON.parse(fs.readFileSync('content/posts.json','utf8'));
const pages=['index.html','404.html',...posts.map(p=>p.slug+'/index.html'),...posts.filter(p=>p.notes).map(p=>p.slug+'/notes/index.html')];
for(const file of pages){
 const html=fs.readFileSync(path.join('docs',file),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' has one h1');
 assert(!/CASEOPS_DEMO|CASEOPS_SHARING|TTT_DIAGRAM|DIMUON_[A-Z]+|KL_[A-Z]+|katex-error/.test(html),file+' fully rendered');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const ref=m[1];if(!ref.startsWith('/')&&!ref.startsWith('#'))continue;
  const [pathname,hash]=ref.split('#');
  let target=pathname?path.join('docs',pathname):path.join('docs',file);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),file+' missing '+ref);
  if(hash)assert(fs.readFileSync(target,'utf8').includes('id="'+hash+'"'),file+' missing anchor '+ref);
 }
}
const context={module:{exports:{}}};vm.runInNewContext(fs.readFileSync('public/caseops.js','utf8'),context);
const {encode,decode}=context.module.exports;
for(const text of ['','a A AA Aa','The NASA Launch','iPhone OpenAI','Hello, café!','😄 中文 ÉCOLE','\uE001\uE002\uE003\uE004','A\tB\nC','ABcD eFGh']){
 assert.equal(decode(encode(text)),text,'roundtrip '+text);
}
assert.equal(encode('APPLE')[0].op,'ALLCAPS');
assert.equal(encode('Apple')[0].op,'TITLE');
assert.equal(encode('iPhone').filter(t=>t.op).map(t=>t.op).join(','),'CAPNEXT');
assert.equal(encode('\uE001')[0].op,'ESC');
console.log('Checked all page assets and anchors; CaseOps examples roundtrip exactly.');

