(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  const art = document.querySelector('.hero-art');
  let pending = false;
  function renderScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--progress', max > 0 ? scrollY / max : 0);
    const y = reduced.matches || innerWidth < 601 ? 0 : Math.min(scrollY, 800);
    art.style.setProperty('--parallax', `${y * .065}px`);
    art.style.setProperty('--tilt', `${y * .002}deg`);
    pending = false;
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(renderScroll); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  renderScroll();
  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
      });
    }, {threshold:.08});
    document.querySelectorAll('.section-head,.card,.contact').forEach(element => {
      element.classList.add('reveal-ready');
      reveal.observe(element);
    });
    addEventListener('focusin', event => event.target.closest('.reveal-ready')?.classList.add('is-visible'));
  }
})();
