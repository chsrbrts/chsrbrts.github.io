import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cssVersion=createHash('sha256').update(readFileSync(path.join(root,'src/styles.css'))).digest('hex').slice(0,12);
const p=JSON.parse(readFileSync(path.join(root,'src/content.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const linkedRole=esc(p.role).replace('AI Infra','<a href="'+esc(p.publicLinks['AI Infra'])+'">AI Infra</a>').replace(/a16z\.$/,'<a href="'+esc(p.publicLinks.a16z)+'">a16z</a>.');
const linkedPersonal=esc(p.personal).replace('bike.','<a href="'+esc(p.publicLinks.bike)+'">bike</a>.');
const arrow='<img class="arrow" src="/assets/arrow-up-right.svg" alt="" width="17" height="17">';
const current=(name,active)=>name===active?' aria-current="page"':'';
const socialIcons={X:'<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3z"/>',LinkedIn:'<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z"/>'};
const headerSocial=['X','LinkedIn'].map(label=>{const c=p.contact.find(c=>c.label===label);return '<a class="social-icon" href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+label+' (opens in a new tab)"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">'+socialIcons[label]+'</svg></a>';}).join('');
const nav=active=>'<nav aria-label="Main navigation"><a href="/books/"'+current('Books',active)+'>Books</a><a href="/musings/"'+current('Musings',active)+'>Musings</a>'+headerSocial+'</nav>';
const schema={'@context':'https://schema.org','@type':'Person',name:p.name,jobTitle:p.jobTitle,worksFor:{'@type':'Organization',name:p.organization},description:p.intro,url:'https://chsrbrts.github.io/',sameAs:p.contact.map(c=>c.url)};
const socialLinks=()=>'<ul class="social-links">'+p.contact.map(c=>'<li><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer"><span>'+esc(c.label)+'</span>'+arrow+'</a></li>').join('')+'</ul>';
const dialog='<dialog id="contact-dialog" aria-labelledby="contact-title"><form method="dialog"><button class="close-dialog" aria-label="Close contact popup">Close</button></form><p class="eyebrow">SAY HELLO</p><h2 id="contact-title">Get in touch.</h2><p>Find me on LinkedIn or X.</p>'+socialLinks()+'</dialog>';
const shell=(title,body,active='')=>{
 const isHome=title==='Home';
 const route=isHome?'/':title==='Text & data'?'/text/':'/'+title.toLowerCase()+'/';
 const canonical='https://chsrbrts.github.io'+route;
 const header='<header class="masthead"><a class="identity" href="/">'+esc(p.name)+'<span>'+esc(p.location)+'</span></a>'+(isHome?'<nav aria-label="Social profiles">'+headerSocial+'</nav>':nav(active))+'</header>';
 return '<!doctype html>\n<html lang="en" data-preview-scale="70"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(isHome?p.name:title+' — '+p.name)+'</title><meta name="description" content="'+esc(p.name+' — '+p.jobTitle+' on the AI Infra investing team at a16z. '+p.intro)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:type" content="website"><meta property="og:title" content="'+esc(isHome?p.name:title+' — '+p.name)+'"><meta property="og:url" content="'+canonical+'"><meta name="theme-color" content="#f5f7f3"><link rel="stylesheet" href="/assets/site.css?v='+cssVersion+'"><link rel="alternate" type="text/markdown" href="/index.md" title="Read as Markdown"><link rel="alternate" type="application/json" href="/profile.json" title="Structured profile"><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body class="'+(isHome?'home':'inside')+'"><a class="skip" href="#main">Skip to content</a><div class="page">'+(isHome?'<picture aria-hidden="true"><source media="(max-width:760px)" srcset="/assets/circuit-mobile.png"><img class="circuit-art" src="/assets/circuit.png" alt="" decoding="async"></picture>':'')+header+body+'<footer><p class="footer-quote">'+esc(p.footerQuote)+'</p><a href="/text/">Text &amp; data for our agentic friends '+arrow+'</a></footer></div>'+dialog+'<script type="module" src="/assets/site.js"></script></body></html>';
};
const home='<main id="main"><div class="hero"><section class="bio" aria-labelledby="hello"><h1 id="hello">Hello, I’m Chase.</h1><p class="role">'+linkedRole+'</p><p class="intro">'+esc(p.intro)+'</p><a class="contact-link contact-target" href="/contact/">Get in touch '+arrow+'</a></section><nav class="destinations" aria-label="Explore"><a class="destination" href="/books/"><h2>Books '+arrow+'</h2><p>A mind deserves new ideas.</p></a><a class="destination" href="/musings/"><h2>Musings '+arrow+'</h2><p>A work in progress. More to come.</p></a></nav></div><section class="experience" aria-labelledby="previously"><h2 id="previously">Previously</h2><dl>'+p.experience.map(e=>'<div><dt>'+esc(e.organization)+'</dt><dd>'+esc(e.role)+'</dd></div>').join('')+'</dl></section><p class="personal">'+linkedPersonal+'</p></main>';
function subpage(title,intro,content){return '<main id="main" class="subpage"><a class="back" href="/">Back to home</a><h1>'+esc(title)+'</h1><p class="sub-intro">'+esc(intro)+'</p>'+content+'</main>';}
const pages={
 'index.html':shell('Home',home),
 'books/index.html':shell('Books',subpage('Books','A mind deserves new ideas.',p.books.length?'<ul class="reading-list">'+p.books.map(b=>'<li><h2>'+esc(b.title)+'</h2><p>'+esc(b.author)+'</p><p>'+esc(b.note)+'</p></li>').join('')+'</ul>':'<p class="empty">I’m putting this shelf together. Recommendations coming soon.</p>'),'Books'),
 'musings/index.html':shell('Musings',subpage('Musings','A work in progress. More to come.',p.musings.length?'<ul class="reading-list">'+p.musings.map(m=>'<li><h2>'+esc(m.title)+'</h2><p>'+esc(m.body)+'</p></li>').join('')+'</ul>':'<p class="empty">The first post is on its way.</p>'),'Musings'),
 'contact/index.html':shell('Contact',subpage('Get in touch.','Find me on LinkedIn or X.',socialLinks()),'Contact'),
 'text/index.html':shell('Text & data',subpage('Text & data','The same content, in a simpler format.','<dl class="formats"><div><dt><a href="/index.md">Markdown '+arrow+'</a></dt><dd>Bio, experience, and public contact details.</dd></div><div><dt><a href="/profile.json">JSON '+arrow+'</a></dt><dd>A structured profile, with books and musings.</dd></div><div><dt><a href="/books.md">Books in Markdown '+arrow+'</a></dt><dd>The reading list.</dd></div><div><dt><a href="/musings.md">Musings in Markdown '+arrow+'</a></dt><dd>The writing index.</dd></div></dl>'))
};
for(const [file,html]of Object.entries(pages)){mkdirSync(path.dirname(path.join(root,file)),{recursive:true});writeFileSync(path.join(root,file),html);}

const md='# '+p.name+'\n\n'+p.location+'\n\n'+p.role+'\n\n'+p.intro+'\n\n## Previously\n\n'+p.experience.map(e=>'- '+e.organization+': '+e.role).join('\n')+'\n\n'+p.personal+'\n\n'+p.footerQuote+'\n\n## Public links\n\n'+Object.entries(p.publicLinks).map(([label,url])=>'- ['+label+']('+url+')').join('\n')+'\n\n## Contact\n\n'+p.contact.map(c=>'- ['+c.label+']('+c.url+')').join('\n')+'\n\n## Elsewhere on this site\n\n- [Books](/books/)\n- [Musings](/musings/)\n- [Structured profile](/profile.json)\n';
writeFileSync(path.join(root,'index.md'),md);
writeFileSync(path.join(root,'profile.json'),JSON.stringify(p,null,2)+'\n');
writeFileSync(path.join(root,'books.md'),'# Books\n\nA mind deserves new ideas.\n\n'+(p.books.length?p.books.map(b=>'## '+b.title+'\n\n'+b.author+'\n\n'+b.note).join('\n\n'):'I’m putting this shelf together. Recommendations coming soon.')+'\n');
writeFileSync(path.join(root,'musings.md'),'# Musings\n\nA work in progress. More to come.\n\n'+(p.musings.length?p.musings.map(m=>'## '+m.title+'\n\n'+m.body).join('\n\n'):'The first post is on its way.')+'\n');
writeFileSync(path.join(root,'llms.txt'),'# Chase Roberts\n\nPersonal site. All public content is available without JavaScript.\n\n- [Profile and experience](/index.md)\n- [Structured data](/profile.json)\n- [Books](/books.md)\n- [Musings](/musings.md)\n');
writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://chsrbrts.github.io/sitemap.xml\n');
console.log('Rendered five HTML pages and matching Markdown / JSON from src/content.json.');


writeFileSync(path.join(root,'assets/site.css'),readFileSync(path.join(root,'src/styles.css')));
writeFileSync(path.join(root,'assets/site.js'),readFileSync(path.join(root,'src/main.js')));
writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/','/books/','/musings/','/contact/','/text/'].map(route=>'<url><loc>https://chsrbrts.github.io'+route+'</loc></url>').join('')+'</urlset>\n');
writeFileSync(path.join(root,'404.html'),shell('Not found',subpage('Page not found','This page isn’t here.','<p><a href="/">Return to home</a></p>')).replace('<link rel="canonical" href="https://chsrbrts.github.io/not found/">','<meta name="robots" content="noindex">').replace('<meta property="og:url" content="https://chsrbrts.github.io/not found/">',''));
