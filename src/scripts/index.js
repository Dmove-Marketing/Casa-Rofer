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
document.querySelectorAll('.carousel:not(.fb-carousel)').forEach(c=>{
  const track=c.querySelector('.car-track');
  const step=()=>Math.min(track.clientWidth*.8, track.querySelector('.slide').offsetWidth+16);
  c.querySelector('.prev').addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  c.querySelector('.next').addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
});

/* lightbox — desativado */

/* form (visual only) */
document.getElementById('leadForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  if(!f.nome.value||!f.email.value){f.reportValidity?.();return;}
  f.style.display='none';
  document.getElementById('formSuccess').classList.add('show');
  document.getElementById('formSuccess').scrollIntoView({behavior:'smooth',block:'center'});
});

/* Salão Carousels */
document.querySelectorAll('.m-carousel').forEach(mCarousel => {
  const slides = [...mCarousel.querySelectorAll('.m-slide')];
  const prevBtn = mCarousel.querySelector('.m-carousel-btn.prev');
  const nextBtn = mCarousel.querySelector('.m-carousel-btn.next');
  const counter = mCarousel.querySelector('.m-carousel-counter');
  let currentIdx = 0;
  const total = slides.length;
  let timer = null;

  function showSlide(index) {
    currentIdx = (index + total) % total;
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      if (idx === currentIdx) {
        slide.classList.add('active');
      } else if (idx === (currentIdx - 1 + total) % total) {
        slide.classList.add('prev-slide');
      } else if (idx === (currentIdx + 1) % total) {
        slide.classList.add('next-slide');
      }
    });
    if (counter) {
      counter.textContent = `${String(currentIdx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => {
      showSlide(currentIdx + 1);
    }, 3500);
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentIdx - 1);
    startAutoPlay();
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentIdx + 1);
    startAutoPlay();
  });

  // Initialize
  showSlide(0);
  startAutoPlay();

  // Pause on hover
  mCarousel.addEventListener('mouseenter', stopAutoPlay);
  mCarousel.addEventListener('mouseleave', startAutoPlay);
});

/* Testimonials Infinite Carousel */
const fbCarousel = document.getElementById('feedback-carousel');
if (fbCarousel) {
  const track = fbCarousel.querySelector('.fb-track');
  const slides = [...track.querySelectorAll('.fb-card')];
  const prevBtn = fbCarousel.querySelector('.prev');
  const nextBtn = fbCarousel.querySelector('.next');
  
  const numVisible = 3; 
  const gap = 20; 
  
  // Clone slides
  const clonesBefore = slides.slice(-numVisible).map(s => s.cloneNode(true));
  const clonesAfter = slides.slice(0, numVisible).map(s => s.cloneNode(true));
  
  clonesBefore.forEach(clone => {
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  });
  
  clonesAfter.forEach(clone => {
    clone.classList.add('clone');
    track.appendChild(clone);
  });
  
  let currentIndex = numVisible;
  let isTransitioning = false;
  
  function getStepSize() {
    const slide = track.querySelector('.fb-card');
    return slide ? slide.offsetWidth + gap : 0;
  }
  
  function scrollToSlide(index, smooth = true) {
    currentIndex = index;
    const stepSize = getStepSize();
    track.scrollTo({
      left: stepSize * currentIndex,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
  
  // Initial position
  setTimeout(() => {
    scrollToSlide(numVisible, false);
  }, 100);
  
  // Seamless loop adjustment on scroll
  track.addEventListener('scroll', () => {
    const stepSize = getStepSize();
    if (!stepSize || isTransitioning) return;
    
    const scrollLeft = track.scrollLeft;
    
    // Scrolled into clones at the beginning
    if (scrollLeft <= (numVisible - 1) * stepSize) {
      isTransitioning = true;
      const offset = slides.length * stepSize;
      track.scrollLeft += offset;
      currentIndex += slides.length;
      setTimeout(() => { isTransitioning = false; }, 50);
    }
    // Scrolled into clones at the end
    else if (scrollLeft >= (numVisible + slides.length) * stepSize) {
      isTransitioning = true;
      const offset = slides.length * stepSize;
      track.scrollLeft -= offset;
      currentIndex -= slides.length;
      setTimeout(() => { isTransitioning = false; }, 50);
    }
  });
  
  prevBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex - 1);
  });
  
  nextBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex + 1);
  });
  
  window.addEventListener('resize', () => {
    scrollToSlide(currentIndex, false);
  });
}