import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const p=JSON.parse(readFileSync(path.join(root,'src/content.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const linkedRole=esc(p.role).replace('AI Infra','<a href="'+esc(p.publicLinks['AI Infra'])+'">AI Infra</a>').replace(/a16z\.$/,'<a href="'+esc(p.publicLinks.a16z)+'">a16z</a>.');
const linkedPersonal=esc(p.personal).replace('bike.','<a href="'+esc(p.publicLinks.bike)+'">bike</a>.');
const arrow='<img class="arrow" src="/assets/arrow-up-right.svg" alt="" width="17" height="17">';
const current=(name,active)=>name===active?' aria-current="page"':'';
const nav=active=>'<nav aria-label="Main navigation"><a href="/books/"'+current('Books',active)+'>Books</a><a href="/musings/"'+current('Musings',active)+'>Musings</a><a href="/contact/" class="contact-target"'+current('Contact',active)+'>Contact</a></nav>';
const schema={'@context':'https://schema.org','@type':'Person',name:p.name,jobTitle:p.jobTitle,worksFor:{'@type':'Organization',name:p.organization},description:p.intro,url:'https://chsrbrts.github.io/',sameAs:p.contact.map(c=>c.url)};
const socialLinks=()=>'<ul class="social-links">'+p.contact.map(c=>'<li><a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer"><span>'+esc(c.label)+'</span>'+arrow+'</a></li>').join('')+'</ul>';
const dialog='<dialog id="contact-dialog" aria-labelledby="contact-title"><form method="dialog"><button class="close-dialog" aria-label="Close contact popup">Close</button></form><p class="eyebrow">SAY HELLO</p><h2 id="contact-title">Get in touch.</h2><p>Find me on LinkedIn or X.</p>'+socialLinks()+'</dialog>';
const shell=(title,body,active='')=>{
 const isHome=title==='Home';
 const route=isHome?'/':title==='Text & data'?'/text/':'/'+title.toLowerCase()+'/';
 const canonical='https://chsrbrts.github.io'+route;
 const header='<header class="masthead"><a class="identity" href="/">'+esc(p.name)+'<span>'+esc(p.location)+'</span></a>'+(isHome?'<nav aria-label="Main navigation"><a class="contact-target" href="/contact/">Contact</a></nav>':nav(active))+'</header>';
 return '<!doctype html>\n<html lang="en" data-preview-scale="70"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(isHome?p.name:title+' — '+p.name)+'</title><meta name="description" content="'+esc(p.name+' — '+p.jobTitle+' on the AI Infra team at a16z. '+p.intro)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:type" content="website"><meta property="og:title" content="'+esc(isHome?p.name:title+' — '+p.name)+'"><meta property="og:url" content="'+canonical+'"><meta name="theme-color" content="#f5f7f3"><link rel="stylesheet" href="/assets/site.css"><link rel="alternate" type="text/markdown" href="/index.md" title="Read as Markdown"><link rel="alternate" type="application/json" href="/profile.json" title="Structured profile"><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body class="'+(isHome?'home':'inside')+'"><a class="skip" href="#main">Skip to content</a><div class="page">'+(isHome?'<picture aria-hidden="true"><source media="(max-width:760px)" srcset="/assets/circuit-mobile.png"><img class="circuit-art" src="/assets/circuit.png" alt="" decoding="async"></picture>':'')+header+body+'<footer><p class="footer-quote">'+esc(p.footerQuote)+'</p><a href="/text/">Text &amp; data for our agentic friends '+arrow+'</a></footer></div>'+dialog+'<script type="module" src="/assets/site.js"></script></body></html>';
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
