/* Scripts extraídos de index.html */

/* reveal on scroll */
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));

/* parallax */
const px=[...document.querySelectorAll('[data-parallax]')];
let ticking=false;
function parallax(){
  px.forEach(el=>{
    const r=el.getBoundingClientRect();
    const speed=parseFloat(el.dataset.parallax);
    const img=el.querySelector('img');
    if(img){const off=(r.top+r.height/2-window.innerHeight/2)*-speed;img.style.transform=`translateY(${off}px) scale(1.12)`;}
  });
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true}},{passive:true});
parallax();

/* carousels */
document.querySelectorAll('.carousel').forEach(c=>{
  const track=c.querySelector('.car-track');
  const step=()=>Math.min(track.clientWidth*.8, track.querySelector('.slide').offsetWidth+16);
  c.querySelector('.prev').addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  c.querySelector('.next').addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
});

/* lightbox — galeria + gastronomia + espaços */
const galImgs=[...document.querySelectorAll('#galeria img, #gastronomia .slide img, #espacos .space-figure img')];
const lb=document.getElementById('lb'),lbImg=document.getElementById('lbImg');
let lbI=0;
function openLb(i){lbI=(i+galImgs.length)%galImgs.length;lbImg.src=galImgs[lbI].src;lbImg.alt=galImgs[lbI].alt||'';lb.classList.add('open')}
galImgs.forEach((img,i)=>{
  img.style.cursor='zoom-in';
  img.addEventListener('click',()=>openLb(i));
  if (img.parentElement) {
    img.parentElement.style.cursor='zoom-in';
    img.parentElement.addEventListener('click',()=>openLb(i));
  }
});
document.getElementById('lbClose').addEventListener('click',()=>lb.classList.remove('open'));
document.getElementById('lbPrev').addEventListener('click',e=>{e.stopPropagation();openLb(lbI-1)});
document.getElementById('lbNext').addEventListener('click',e=>{e.stopPropagation();openLb(lbI+1)});
lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowRight')openLb(lbI+1);if(e.key==='ArrowLeft')openLb(lbI-1)});

/* form (visual only) */
document.getElementById('leadForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  if(!f.nome.value||!f.email.value){f.reportValidity?.();return;}
  f.style.display='none';
  document.getElementById('formSuccess').classList.add('show');
  document.getElementById('formSuccess').scrollIntoView({behavior:'smooth',block:'center'});
});