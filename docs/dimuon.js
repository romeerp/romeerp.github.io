(() => {
  const d0 = (1 + 1e-4) ** (-.25);
  const d1 = (1 / 16 + 1e-4) ** (-.25);
  const u = [d0*d0, d1*d1];
  const norm = Math.hypot(...u);
  const stages = [
    {v:[1,1], text:'Momentum: both axes have value 1. With beta set to zero, the current gradient determines this matrix; the old momentum still determines the scaling.'},
    {v:u, text:'Pre-scale: multiply by the row and column factors. Axis 2 had less old momentum, so it receives the larger multiplier.'},
    {v:[1,1], text:'Polar: for this positive diagonal matrix, the ideal transform replaces both singular values with 1. The two axes are equal again.'},
    {v:u, text:'Post-scale: apply the same row and column factors again. Their effect survives the polar transform, favoring axis 2.'},
    {v:u.map(x=>x/norm), text:'Normalize: set the total update length. This changes the size, while preserving the direction chosen by the sandwich.'}
  ];
  const buttons = [...document.querySelectorAll('[data-dimuon-step]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const stage = stages[Number(button.dataset.dimuonStep)];
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    ['one','two'].forEach((name,i)=>{
      document.getElementById('axis-'+name).style.width = (stage.v[i]/4*100)+'%';
      document.getElementById('axis-'+name+'-value').textContent = stage.v[i].toFixed(3);
    });
    document.getElementById('dimuon-stage-text').textContent = stage.text+' Values: axis 1 = '+stage.v[0].toFixed(3)+', axis 2 = '+stage.v[1].toFixed(3)+'.';
  }));
})();
