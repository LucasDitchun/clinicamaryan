'use strict';

/* ══════════════════════════════════════
   HEADER — scroll state
══════════════════════════════════════ */
const header = document.getElementById('header');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ══════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on any mobile menu link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});


/* ══════════════════════════════════════
   SMOOTH SCROLL — anchor links
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════
   HERO PARALLAX — subtle image shift
══════════════════════════════════════ */
const heroImg = document.getElementById('heroImg');

if (heroImg) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const limit   = window.innerHeight;
        if (scrollY <= limit) {
          heroImg.style.transform = `translateY(${scrollY * 0.25}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ══════════════════════════════════════
   SCROLL REVEAL — fade-in on viewport
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════
   ACCORDION
══════════════════════════════════════ */
const accordionItems = document.querySelectorAll('.accordion__item');
const treatmentsImg  = document.getElementById('treatmentsImg');

accordionItems.forEach(item => {
  const trigger = item.querySelector('.accordion__trigger');

  trigger.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all items
    accordionItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isActive) {
      item.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');

      // Swap treatments image with fade
      const nextSrc = item.dataset.img;
      if (treatmentsImg && nextSrc && treatmentsImg.src !== nextSrc) {
        treatmentsImg.style.opacity = '0';
        setTimeout(() => {
          treatmentsImg.src = nextSrc;
          treatmentsImg.style.opacity = '1';
        }, 350);
      }
    }
  });
});


/* ══════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const start    = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3); // cubic ease-out
  }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOut(progress) * target);

    el.textContent = value >= 1000
      ? value.toLocaleString('pt-BR')
      : String(value);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const numEl = entry.target.querySelector('.stat__n');
      if (numEl && numEl.dataset.target) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => animateCounter(numEl), delay);
      }

      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.stat').forEach(el => counterObserver.observe(el));


/* ══════════════════════════════════════
   TESTIMONIALS CAROUSEL
══════════════════════════════════════ */
(function initCarousel() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.tc-dot');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');

  if (!testimonials.length) return;

  let current  = 0;
  let autoPlay = null;

  function goTo(index) {
    testimonials[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + testimonials.length) % testimonials.length;

    testimonials[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAutoPlay() {
    if (autoPlay) clearInterval(autoPlay);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAutoPlay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAutoPlay();
    });
  });

  // Pause on hover
  const carousel = document.getElementById('carousel');
  carousel?.addEventListener('mouseenter', stopAutoPlay);
  carousel?.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
})();


/* ══════════════════════════════════════
   MARQUEE — pause on hover (CSS handles
   the rest via animation-play-state)
══════════════════════════════════════ */
// Already handled via CSS: .marquee-band:hover .marquee-track { animation-play-state: paused; }


/* ══════════════════════════════════════
   REDUCED MOTION — respect prefers
══════════════════════════════════════ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Make all fade-in elements immediately visible
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });

  // Stop marquee
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) marqueeTrack.style.animation = 'none';

  // Disable hero parallax
  if (heroImg) heroImg.style.transform = '';
}
