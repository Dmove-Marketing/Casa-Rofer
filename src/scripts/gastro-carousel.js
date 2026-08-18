/* Carrossel de Gastronomia: passagem automática contínua + arraste com
   mouse/touch, com loop infinito (slides duplicados no markup). */
document.querySelectorAll('.gastro-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.car-track');
  const slides = [...track.children];
  const half = slides.length / 2;
  if (!half) return;

  const SPEED = 65; // px/s

  let setWidth = 0;
  let offset = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let paused = false;
  let lastTime = null;

  const measure = () => {
    const trackRect = track.getBoundingClientRect();
    const dupRect = slides[half].getBoundingClientRect();
    setWidth = dupRect.left - trackRect.left;
  };

  const wrap = (val) => {
    if (setWidth <= 0) return val;
    val %= setWidth;
    if (val > 0) val -= setWidth;
    return val;
  };

  const render = () => {
    track.style.transform = `translateX(${offset}px)`;
  };

  const tick = (time) => {
    if (lastTime === null) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    if (!isDragging && !paused) {
      offset = wrap(offset - SPEED * dt);
      render();
    }
    requestAnimationFrame(tick);
  };

  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  requestAnimationFrame(tick);

  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });

  const startDrag = (clientX) => {
    isDragging = true;
    paused = true;
    dragStartX = clientX;
    dragStartOffset = offset;
    carousel.classList.add('dragging');
  };
  const moveDrag = (clientX) => {
    if (!isDragging) return;
    offset = wrap(dragStartOffset + (clientX - dragStartX));
    render();
  };
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    paused = false;
    carousel.classList.remove('dragging');
  };

  carousel.addEventListener('mousedown', (e) => { startDrag(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', endDrag);

  carousel.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  carousel.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
  carousel.addEventListener('touchend', endDrag);

  track.querySelectorAll('img').forEach((img) => img.addEventListener('dragstart', (e) => e.preventDefault()));
});
