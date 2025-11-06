const track = document.getElementById('slideTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentIndex = 0;

function updateSlider() {
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

window.addEventListener('resize', updateSlider);
window.addEventListener('load', updateSlider);

/* ---------- Back-to-top behaviour (PATCH) ---------- */
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggleBtn = () => {
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  };

  // initial state + on scroll
  toggleBtn();
  window.addEventListener('scroll', toggleBtn, { passive: true });

  // smooth scroll to top
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();