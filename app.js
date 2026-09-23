const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

const packageCount = document.getElementById('packageCount');
const packageWeight = document.getElementById('packageWeight');
const pcrRange = document.getElementById('pcrRange');
const pcrOutput = document.getElementById('pcrOutput');
const recycledLbs = document.getElementById('recycledLbs');
const totalLbs = document.getElementById('totalLbs');

function formatLbs(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.max(0, value)) + ' lb';
}
function updateCalculator() {
  const count = Number(packageCount?.value || 0);
  const grams = Number(packageWeight?.value || 0);
  const pcr = Number(pcrRange?.value || 0);
  const total = count * grams / 453.59237;
  const recycled = total * (pcr / 100);
  if (pcrOutput) pcrOutput.textContent = `${pcr}%`;
  if (totalLbs) totalLbs.textContent = formatLbs(total);
  if (recycledLbs) recycledLbs.textContent = formatLbs(recycled);
}
[packageCount, packageWeight, pcrRange].forEach(el => el?.addEventListener('input', updateCalculator));
updateCalculator();

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const willOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('open');
      const btn = other.querySelector('button');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        const mark = btn.querySelector('b');
        if (mark) mark.textContent = '+';
      }
    });
    if (willOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      const mark = button.querySelector('b');
      if (mark) mark.textContent = '−';
    }
  });
});

const form = document.getElementById('projectForm');
const success = document.getElementById('formSuccess');

form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const first = data.get('firstName') || '';
  const last = data.get('lastName') || '';
  const company = data.get('company') || '';
  const email = data.get('email') || '';
  const market = data.get('market') || '';
  const details = data.get('details') || '';

  const subject = `Packaging Project Inquiry - ${company}`;
  const body = [
    'Hello Placon,',
    '',
    'I would like to discuss a packaging project.',
    '',
    `Name: ${first} ${last}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Market: ${market}`,
    '',
    'Project details:',
    details,
    '',
    'Thank you.'
  ].join('\n');

  if (success) success.style.display = 'block';
  setTimeout(() => {
    window.location.href = `mailto:info@placon.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, 220);
});
