/**
 * Serendib Trails — Main JavaScript
 * Handles: sticky nav, mobile menu, scroll reveal, stats counter,
 *          package filter, gallery lightbox, testimonial slider,
 *          contact form validation, back-to-top, nav active link
 */

(function () {
  'use strict';

  /* ─── DOM REFERENCES ─────────────────────────────────── */
  const header        = document.getElementById('header');
  const navHamburger  = document.getElementById('navHamburger');
  const navMenu       = document.getElementById('navMenu');
  const navLinks      = navMenu ? navMenu.querySelectorAll('.nav__link') : [];
  const backToTopBtn  = document.getElementById('backToTop');
  const footerYear    = document.getElementById('footerYear');
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const packageCards  = document.querySelectorAll('.package-card');
  const statNumbers   = document.querySelectorAll('.hero__stat-number');
  const galleryGrid   = document.getElementById('galleryGrid');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const testimonialSlider = document.getElementById('testimonialsSlider');
  const testimonialDots   = document.getElementById('testimonialsDots');
  const prevTestBtn   = document.getElementById('prevTestimonial');
  const nextTestBtn   = document.getElementById('nextTestimonial');
  const bookingForm   = document.getElementById('bookingForm');
  const formSuccess   = document.getElementById('formSuccess');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  /* ─── FOOTER YEAR ────────────────────────────────────── */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ─── LOGO FALLBACK ──────────────────────────────────── */
  // If logo image fails to load, show the text fallback
  document.querySelectorAll('.nav__logo-img, .footer__logo').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
  });

  /* ─── STICKY HEADER ──────────────────────────────────── */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    // Active nav link based on section in view
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── BACK TO TOP ────────────────────────────────────── */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── MOBILE MENU ────────────────────────────────────── */
  if (navHamburger && navMenu) {
    navHamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navHamburger.classList.toggle('is-open', isOpen);
      navHamburger.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navHamburger.classList.remove('is-open');
        navHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('is-open') &&
          !navMenu.contains(e.target) &&
          !navHamburger.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navHamburger.classList.remove('is-open');
        navHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navHamburger.classList.remove('is-open');
        navHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navHamburger.focus();
      }
    });
  }

  /* ─── ACTIVE NAV LINK ────────────────────────────────── */
  function updateActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollY = window.scrollY + (window.innerHeight / 3);

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionH   = section.offsetHeight;
      var sectionId  = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
        navLinks.forEach(function (link) {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }

  /* ─── SCROLL REVEAL (IntersectionObserver) ───────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Stagger reveal for grids
  document.querySelectorAll('.services__grid .reveal, .packages__grid .reveal, .whyus__grid .reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ─── STATS COUNTER ──────────────────────────────────── */
  var statsAnimated = false;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000; // ms
    var startTime = null;
    var startVal = 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * (target - startVal) + startVal).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(function (el) {
        animateCounter(el);
      });
    }
  }, { threshold: 0.5 });

  if (statNumbers.length > 0) {
    statsObserver.observe(statNumbers[0].closest('.hero__stats'));
  }

  /* ─── PACKAGE FILTER ─────────────────────────────────── */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update button states
      filterBtns.forEach(function (b) {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-selected', 'true');

      // Show/hide cards
      packageCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          // Re-trigger reveal animation
          card.classList.remove('is-visible');
          setTimeout(function () {
            card.classList.add('is-visible');
          }, 50);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* ─── GALLERY LIGHTBOX ───────────────────────────────── */
  var galleryImages = [];
  var lightboxIndex = 0;

  function buildGalleryImages() {
    galleryImages = [];
    document.querySelectorAll('.gallery__item .gallery__img').forEach(function (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt,
        caption: img.closest('.gallery__item').querySelector('.gallery__location')
                   ? img.closest('.gallery__item').querySelector('.gallery__location').textContent
                   : ''
      });
    });
  }

  buildGalleryImages();

  function openLightbox(index) {
    lightboxIndex = index;
    showLightboxImage(lightboxIndex);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    if (!galleryImages[index]) return;
    lightboxImg.src     = galleryImages[index].src;
    lightboxImg.alt     = galleryImages[index].alt;
    lightboxCaption.textContent = galleryImages[index].caption;
  }

  // Attach zoom button clicks
  document.querySelectorAll('.gallery__zoom').forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  // Also allow clicking on the image directly
  document.querySelectorAll('.gallery__item').forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      if (!e.target.closest('.gallery__zoom')) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function () {
      lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
      showLightboxImage(lightboxIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function () {
      lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
      showLightboxImage(lightboxIndex);
    });
  }

  // Close lightbox on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  { lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length; showLightboxImage(lightboxIndex); }
      if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % galleryImages.length; showLightboxImage(lightboxIndex); }
    }
  });

  /* ─── TESTIMONIALS SLIDER ────────────────────────────── */
  var testimonials = testimonialSlider
    ? Array.from(testimonialSlider.querySelectorAll('.testimonial-card'))
    : [];
  var currentTestimonial = 0;
  var testimonialTimer   = null;
  var AUTOPLAY_DELAY     = 5000;

  function showTestimonial(index) {
    testimonials.forEach(function (card, i) {
      card.classList.toggle('is-active', i === index);
    });
    // Update dots
    if (testimonialDots) {
      Array.from(testimonialDots.querySelectorAll('.testimonials__dot')).forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });
    }
    currentTestimonial = index;
  }

  function buildTestimonialDots() {
    if (!testimonialDots || !testimonials.length) return;
    testimonialDots.innerHTML = '';
    testimonials.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'testimonials__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.setAttribute('aria-selected', String(i === 0));
      dot.addEventListener('click', function () {
        clearInterval(testimonialTimer);
        showTestimonial(i);
        startTestimonialAutoplay();
      });
      testimonialDots.appendChild(dot);
    });
  }

  function startTestimonialAutoplay() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(function () {
      var next = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(next);
    }, AUTOPLAY_DELAY);
  }

  if (testimonials.length > 0) {
    buildTestimonialDots();
    showTestimonial(0);
    startTestimonialAutoplay();
  }

  if (prevTestBtn) {
    prevTestBtn.addEventListener('click', function () {
      clearInterval(testimonialTimer);
      showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
      startTestimonialAutoplay();
    });
  }

  if (nextTestBtn) {
    nextTestBtn.addEventListener('click', function () {
      clearInterval(testimonialTimer);
      showTestimonial((currentTestimonial + 1) % testimonials.length);
      startTestimonialAutoplay();
    });
  }

  // Pause autoplay on hover
  if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', function () { clearInterval(testimonialTimer); });
    testimonialSlider.addEventListener('mouseleave', startTestimonialAutoplay);
  }

  /* ─── CONTACT FORM VALIDATION ────────────────────────── */
  function validateField(input) {
    var error  = input.closest('.form-group').querySelector('.form-error');
    var valid  = true;
    var value  = input.value.trim();

    // Clear previous
    input.classList.remove('is-error');
    if (error) error.textContent = '';

    if (input.required && !value) {
      if (error) error.textContent = 'This field is required.';
      input.classList.add('is-error');
      valid = false;
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      if (error) error.textContent = 'Please enter a valid email address.';
      input.classList.add('is-error');
      valid = false;
    } else if (input.type === 'date' && value) {
      var selected = new Date(value);
      var today    = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) {
        if (error) error.textContent = 'Please select a future date.';
        input.classList.add('is-error');
        valid = false;
      }
    }

    return valid;
  }

  if (bookingForm) {
    // Live validation on blur
    bookingForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        if (field.classList.contains('is-error')) {
          validateField(field);
        }
      });
    });

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredFields = bookingForm.querySelectorAll('[required]');
      var allValid = true;

      requiredFields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) return;

      // Show loading state
      formSubmitBtn.classList.add('is-loading');
      formSubmitBtn.disabled = true;

      // Simulate async submission (replace with real API call)
      setTimeout(function () {
        bookingForm.hidden = true;
        formSuccess.hidden = false;
        formSubmitBtn.classList.remove('is-loading');
        formSubmitBtn.disabled = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1800);
    });
  }

  /* ─── SMOOTH SCROLL OFFSET FOR STICKY HEADER ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 80;
      var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  /* ─── HERO STATS: handle suffix display inline ───────── */
  // The suffix spans sit outside the number spans in HTML, so merge them visually
  // (they are styled as inline elements already, this is just a confirm)

  /* ─── TOUCH SWIPE FOR TESTIMONIALS ──────────────────── */
  (function () {
    var startX = 0;
    var threshold = 50;

    if (!testimonialSlider) return;

    testimonialSlider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    testimonialSlider.addEventListener('touchend', function (e) {
      var diffX = startX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) < threshold) return;

      clearInterval(testimonialTimer);
      if (diffX > 0) {
        // Swipe left → next
        showTestimonial((currentTestimonial + 1) % testimonials.length);
      } else {
        // Swipe right → prev
        showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
      }
      startTestimonialAutoplay();
    }, { passive: true });
  })();

  /* ─── PERFORMANCE: Lazy load images fallback ─────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported — no action needed
  } else {
    // Fallback: IntersectionObserver for older browsers
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    var lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src || img.src;
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function (img) { lazyObserver.observe(img); });
  }

})(); // end IIFE
