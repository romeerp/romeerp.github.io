import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';
import katex from 'katex';
import * as dimuonFigures from './figures/dimuon.mjs';

const origin = 'https://romeerp.github.io';
const posts = JSON.parse(fs.readFileSync('content/posts.json', 'utf8')).sort((a,b)=>b.date.localeCompare(a.date));
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const minutes = p => Math.ceil(p.markdown.split(/\s+/).length / 220);
const date = p => new Date(p.date+'T12:00:00Z').toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
fs.mkdirSync('docs', {recursive:true});
fs.cpSync('public', 'docs', {recursive:true});
fs.mkdirSync('docs/assets', {recursive:true});
fs.copyFileSync('node_modules/katex/dist/katex.min.css', 'docs/assets/katex.min.css');
fs.cpSync('node_modules/katex/dist/fonts', 'docs/assets/fonts', {recursive:true});
fs.copyFileSync('node_modules/katex/LICENSE', 'docs/assets/KATEX-LICENSE.txt');

const header = `<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><a class="wordmark" href="/"><span class="monogram" aria-hidden="true">rp</span><span>Romeer Pillay</span></a>
<nav aria-label="Main navigation"><a href="/#writing">Writing</a><a href="https://github.com/romeerp">GitHub <span aria-hidden="true">↗</span></a><a href="/feed.xml">RSS</a></nav></header>`;
const footer = `<footer class="site-footer"><span>Romeer Pillay</span><a href="#top">Back to top ↑</a></footer>`;

function shell({title,description,url='/',body,kind='website',math=false,script=false,dimuon=false}){
  const canonical = origin + url;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark">
<title>${escape(title)}${title === 'Romeer Pillay' ? '' : ' — Romeer Pillay'}</title>
<meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}">
<meta property="og:type" content="${kind}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Romeer Pillay">
<meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="alternate" type="application/rss+xml" title="Romeer Pillay" href="/feed.xml">
<link rel="stylesheet" href="/style.css">${math ? '<link rel="stylesheet" href="/assets/katex.min.css">' : ''}${script ? '<script defer src="/caseops.js"></script>' : ''}${dimuon ? '<script defer src="/dimuon.js"></script>' : ''}</head><body id="top">${header}${body}${footer}</body></html>`;
}
const index = `<main id="main" class="home"><section class="intro"><h1>I'm Romeer<span class="title-dot">.</span></h1><p class="intro-copy">I'm a junior at UT Austin, interested in a variety of topics across deep learning and language modeling.</p></section>
<section class="writing" id="writing" aria-labelledby="writing-title"><div class="section-label"><h2 id="writing-title">Writing</h2><span class="section-rule" aria-hidden="true"></span></div>
${posts.map(p=>`<article class="post-row"><div class="post-meta"><time datetime="${p.date}">${date(p)}</time><span>${minutes(p)} min read</span></div><div class="post-copy"><h3><a href="/${p.slug}/">${escape(p.title)}<span class="row-arrow" aria-hidden="true">↗</span></a></h3><p>${escape(p.description)}</p></div></article>`).join('')}
</section></main>`;
fs.writeFileSync('docs/index.html', shell({title:'Romeer Pillay',description:'Romeer Pillay, a junior at UT Austin interested in deep learning and language modeling.',body:index}));

const demo = `<figure class="case-demo" aria-labelledby="case-demo-title"><figcaption id="case-demo-title"><span class="eyebrow">Try the case transform</span><span class="demo-note">Before BPE tokenization</span></figcaption>
<label for="case-input">Original text</label><input id="case-input" type="text" value="The NASA Launch" maxlength="200" autocomplete="off" spellcheck="false">
<div class="example-buttons" aria-label="Example text"><button type="button" data-example="The NASA Launch">Title & all caps</button><button type="button" data-example="iPhone OpenAI">Mixed case</button><button type="button" data-example="Hello, café!">With punctuation</button></div>
<p class="demo-label">CaseOps representation</p><output id="case-output" aria-live="polite"></output><p class="demo-label">Decoded back</p><output id="case-decoded"></output><p class="demo-foot">Same text. Shared lowercase pieces. Capitalization travels as operators.</p></figure>`;
const ttt = `<figure class="ttt-diagram"><figcaption>One global update between two stretches of scoring</figcaption><ol><li><span class="step">01</span><strong>Score the prefix</strong><span>Local LoRA adapts within each document.</span></li><li><span class="step">02</span><strong>Update the base</strong><span>Global SGD uses only completed, already-scored documents.</span></li><li><span class="step">03</span><strong>Keep scoring</strong><span>Later documents start with the updated base.</span></li></ol><p>Earlier scores stay fixed throughout.</p></figure>`;

for (const post of posts) {
  const toc=[];const used=new Map();
  const md = new Marked({gfm:true,renderer:{
    code({text,lang}) {
      if(lang==='math')return `<div class="math-block" tabindex="0" aria-label="Equation">${katex.renderToString(text,{displayMode:true,throwOnError:true,output:'htmlAndMathml',strict:'error'})}</div>`;
      return `<pre><code${lang ? ` class="language-${escape(lang)}"` : ''}>${escape(text)}</code></pre>`;
    },
    heading({tokens,depth}) {
      const inner=this.parser.parseInline(tokens);
      const label=inner.replace(/<[^>]*>/g,'');
      const base=label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const n=used.get(base)||0;used.set(base,n+1);const id=base+(n?'-'+n:'');
      if(depth===2)toc.push({id,label});
      return `<h${depth} id="${id}">${inner}<a class="heading-link" href="#${id}" aria-label="Link to ${escape(label)}">#</a></h${depth}>`;
    }
  }});
  let content=md.parse(post.markdown).replace('<!--CASEOPS_DEMO-->',demo).replace('<!--TTT_DIAGRAM-->',ttt);
  for (const [name, figure] of Object.entries(dimuonFigures)) content=content.replace('<!--DIMUON_'+name.toUpperCase()+'-->',figure);
  const next=posts.find(x=>x.slug!==post.slug);
  const body=`<main id="main" class="article-main"><a class="back-link" href="/#writing">← All writing</a><article>
<header class="article-header"><p class="eyebrow">${escape(post.category)}</p><h1>${escape(post.title)}</h1><p class="dek">${escape(post.description)}</p><div class="article-meta"><span>Romeer Pillay</span><span aria-hidden="true">·</span><time datetime="${post.date}">${date(post)}</time><span aria-hidden="true">·</span><span>${minutes(post)} min read</span></div></header>
<details class="contents"><summary>On this page</summary><nav aria-label="Article contents"><ol>${toc.map(t=>`<li><a href="#${t.id}">${t.label}</a></li>`).join('')}</ol></nav></details>
<div class="prose">${content}</div></article>
${next ? `<aside class="next-post" aria-label="More writing"><p class="eyebrow">More writing</p><a href="/${next.slug}/">${escape(next.title)} <span aria-hidden="true">→</span></a></aside>` : ''}</main>`;
  fs.mkdirSync(path.join('docs',post.slug),{recursive:true});
  fs.writeFileSync(path.join('docs',post.slug,'index.html'),shell({title:post.title,description:post.description,url:`/${post.slug}/`,body,kind:'article',math:true,script:post.slug==='parameter-golf',dimuon:post.slug==='reverse-engineering-dimuon'}));
}
fs.writeFileSync('docs/404.html',shell({title:'Page not found',description:'This page has wandered off.',body:'<main id="main" class="home"><section class="intro"><p class="eyebrow">404</p><h1>Nothing here.</h1><p>Head back to the posts.</p><a href="/">← Back to the writing</a></section></main>'}));
fs.writeFileSync('docs/feed.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Romeer Pillay</title><link>${origin}/</link><description>Writing on deep learning and language modeling.</description><language>en</language>${posts.map(p=>`<item><title>${escape(p.title)}</title><link>${origin}/${p.slug}/</link><guid>${origin}/${p.slug}/</guid><description>${escape(p.description)}</description><pubDate>${new Date(p.date+'T12:00:00Z').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`);
fs.writeFileSync('docs/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...posts.map(p=>'/'+p.slug+'/')].map(u=>`<url><loc>${origin}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync('docs/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${posts.length} posts, index, RSS, sitemap, and 404.`);

fs.writeFileSync('docs/.nojekyll', '');
