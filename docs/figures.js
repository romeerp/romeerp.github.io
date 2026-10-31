(() => {
  const descriptions = {
    sandwich: ['Pre-scale: the old momentum gives one axis a larger multiplier.', 'Polar: for this diagonal example, both singular values become 1.', 'Post-scale: apply those multipliers again. Normalize the length afterward.'],
    caseops: ['apple → apple. No capitalization operator is needed.', 'Apple → TITLE + apple. Reuse the spelling; capitalize the first letter.', 'APPLE → ALLCAPS + apple. Reuse the spelling; capitalize the whole run.'],
    splitk: ['Split the long dot product into chunks that can run in parallel.', 'Each worker computes a partial sum independently.', 'Store the partial sums in FP16. Each store can round the result.', 'Combine the rounded partial sums. The same algebra can now give different final bits.'],
    ttt: ['Score the prefix. Each document gets its own local LoRA adaptation.', 'Pause scoring. Train the shared base on documents whose scores are already fixed.', 'Resume with the updated base. New documents start with fresh local adapters.']
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-animation]').forEach(figure => {
    const steps = descriptions[figure.dataset.animation];
    if (!steps) return;
    let step = -1, timer = null;
    const play = figure.querySelector('[data-play]');
    const next = figure.querySelector('[data-next]');
    const caption = figure.querySelector('[data-caption]');
    const counter = figure.querySelector('[data-counter]');
    figure.querySelector('.motion-controls').hidden = false;
    function stop() {
      clearInterval(timer); timer = null;
      play.textContent = step === steps.length-1 ? '↻ Replay' : '▶ Play';
      play.setAttribute('aria-label',step === steps.length-1 ? 'Replay animation' : 'Play animation');
    }
    function show(n) {
      step = n; figure.dataset.frame = String(n);
      figure.querySelectorAll('[data-stage]').forEach(node=>node.classList.toggle('is-current',Number(node.dataset.stage)===n));
      caption.textContent = steps[n]; counter.textContent = `${n+1} / ${steps.length}`;
    }
    play.addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (reduced.matches) { show((step+1)%steps.length); stop(); return; }
      show(step >= steps.length-1 ? 0 : step+1);
      if (step === steps.length-1) { stop(); return; }
      play.textContent = 'Ⅱ Pause'; play.setAttribute('aria-label','Pause animation');
      timer = setInterval(()=>{show(step+1);if(step===steps.length-1)stop();},1800);
    });
    next.addEventListener('click',()=>{stop();show((step+1)%steps.length);stop();});
    reduced.addEventListener('change',stop);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(figure);
  });
})();
