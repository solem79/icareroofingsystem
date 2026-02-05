(function () {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const overlay = slider.querySelector('.overlay');
  const dotsContainer = slider.querySelector('.slider-dots');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');

  let slides = [], current = 0, timer;

  // Load slider images (Netlify CMS JSON or local fallback)
  async function loadSlider() {
    let images = [];
    try {
      const res = await fetch("/assets/data/slider/slider.json");
      const data = await res.json();
      images = data.map(item => item.url);
    } catch (err) {
      console.warn("CMS JSON not found, using local fallback");
      // fallback images for local testing
      images = [
        "/assets/images/uploads/slide1.jpg",
        "/assets/images/uploads/slide2.jpg",
        "/assets/images/uploads/slide3.jpg"
      ];
    }
    buildSlides(images);
  }

  function buildSlides(images) {
    slides = [];
    slider.querySelectorAll('img.slider-img').forEach(img => img.remove());
    dotsContainer.innerHTML = '';

    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'slider-img' + (i === 0 ? ' active' : '');
      img.alt = `Slide ${i + 1}`;
      img.onerror = () => console.warn(`Slider image not found: ${src}`);

      if (overlay) slider.insertBefore(img, overlay.nextSibling);
      else slider.insertBefore(img, dotsContainer);

      slides.push(img);
    });

    buildDots();
    startAuto();
  }

  function buildDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = i === 0 ? 'dot active' : 'dot';
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function startAuto() { timer = setInterval(nextSlide, 5000); }
  function resetTimer() { clearInterval(timer); startAuto(); }

  function goToSlide(i) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function nextSlide() { goToSlide((current + 1) % slides.length); }
  function prevSlide() { goToSlide((current - 1 + slides.length) % slides.length); }

  prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

  // Touch support
  let startX = 0, endX = 0;
  slider.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
  slider.addEventListener('touchmove', e => endX = e.touches[0].clientX, {passive:true});
  slider.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });

  loadSlider();
  window.refreshSlider = loadSlider;
})();