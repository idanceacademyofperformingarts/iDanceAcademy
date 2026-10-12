// ===================== Mobile nav toggle =====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===================== Active link on scroll =====================
const sections = document.querySelectorAll('section, header[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const setActiveLink = () => {
  let current = '';
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ===================== Navbar shrink + back-to-top =====================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== Reveal on scroll =====================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ===================== Registration form (front-end only) =====================
const registerForm = document.getElementById('registerForm');
const formSuccess = document.getElementById('formSuccess');

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.add('show');
    registerForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ===================== Footer year =====================
document.getElementById('year').textContent = new Date().getFullYear();
