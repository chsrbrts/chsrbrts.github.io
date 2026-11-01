const dialog=document.getElementById('contact-dialog');
document.querySelectorAll('.contact-target').forEach(link=>link.addEventListener('click',e=>{
 if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!dialog?.showModal)return;
 e.preventDefault();dialog.showModal();
}));
dialog?.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
