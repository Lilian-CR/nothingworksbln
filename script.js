const track = document.getElementById('slideTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentIndex = 0;

function updateSlider() {
  if (!track || !slides.length) return;
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  });
}

window.addEventListener('resize', updateSlider);
window.addEventListener('load', updateSlider);

/* Year in footer */
(function () {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

/* Back-to-top behaviour */
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleBtn = () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  };

  toggleBtn();
  window.addEventListener('scroll', toggleBtn, { passive: true });

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
