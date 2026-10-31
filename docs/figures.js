(() => {
  const figure = document.querySelector('[data-ttt]');
  if (!figure) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const play = figure.querySelector('[data-ttt-play]');
  const next = figure.querySelector('[data-ttt-next]');
  const phases = [];
  for (let round=0; round<2; round++) {
    for (let i=1; i<=3; i++) {
      const doc=round*3+i;
      phases.push({mode:'score',doc,count:doc-1,version:round,text:`Score document ${doc} with base v${round} and a fresh local adapter.`});
      phases.push({mode:'store',doc,count:doc,version:round,text:`Document ${doc}'s score is fixed. Move it into the completed-document buffer.`});
    }
    phases.push({mode:'sgd',doc:round*3+3,count:round*3+3,version:round,text:`Pause scoring. Run SGD on the completed prefix to update the shared base.`});
  }
  phases.push({mode:'done',doc:7,count:6,version:2,text:'Two global learning phases complete. The next document starts from base v2; earlier scores stay fixed.'});
  let index=-1, timer=null;
  figure.querySelector('.ttt-controls').hidden=false;
  function stop() {
    clearInterval(timer); timer=null;
    figure.classList.remove('is-playing');
    play.textContent=index===phases.length-1?'↻ Watch again':index<0?'▶ Watch two rounds':'▶ Continue';
  }
  function show(n) {
    index=n;
    const frame=phases[n];
    figure.dataset.mode=frame.mode;
    figure.dataset.version=String(frame.version);
    figure.querySelector('[data-current-doc]').textContent=`Doc ${frame.doc}`;
    figure.querySelector('[data-buffer-count]').textContent=`${frame.count} document${frame.count===1?'':'s'} scored`;
    figure.querySelector('[data-model-version]').textContent=`base v${frame.version}`;
    figure.querySelector('[data-phase]').textContent=frame.mode==='done'?'Ready for the next round':`Round ${frame.version+1} · ${frame.mode==='score'?'scoring':frame.mode==='store'?'buffering':'global SGD'}`;
    figure.querySelector('[data-ttt-caption]').textContent=frame.text;
    figure.querySelector('[data-ttt-count]').textContent=`${n+1} / ${phases.length}`;
    figure.querySelectorAll('[data-paper]').forEach(p=>{
      const number=Number(p.dataset.paper);
      p.classList.toggle('is-buffered',number<=frame.count);
      p.classList.toggle('just-arrived',frame.mode==='store'&&number===frame.doc);
    });
    const x=271+((frame.doc-1)%3)*44, y=78+Math.floor((frame.doc-1)/3)*62;
    figure.style.setProperty('--paper-x',`${x}px`);
    figure.style.setProperty('--paper-y',`${y}px`);
  }
  play.addEventListener('click',()=>{
    if(timer){stop();return;}
    if(reduced.matches){show((index+1)%phases.length);stop();return;}
    show(index===phases.length-1?0:index+1);
    if(index===phases.length-1){stop();return;}
    figure.classList.add('is-playing');play.textContent='Ⅱ Pause';
    timer=setInterval(()=>{show(index+1);if(index===phases.length-1)stop();},1500);
  });
  next.addEventListener('click',()=>{stop();show((index+1)%phases.length);stop();});
  reduced.addEventListener('change',stop);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(figure);
})();
