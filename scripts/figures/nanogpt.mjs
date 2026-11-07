// Each square represents a block of query/key pairs. Only causal pairs are drawn.
function heatmap(backward) {
  const cells = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col <= row; col++) {
      const distance = row - col;
      const skip = backward && distance > 2;
      cells.push(`<rect x="${col*10}" y="${row*10}" width="9" height="9" rx="1" fill="${skip ? 'url(#skipped-tiles)' : '#a5d8be'}" opacity="${skip ? 1 : [0.98,0.72,0.45,0.21,0.13][Math.min(distance,4)]}"/>`);
    }
  }
  return `<div><span>${backward ? 'Backward' : 'Forward'}</span><svg viewBox="0 0 120 120" aria-hidden="true">${backward ? '<defs><pattern id="skipped-tiles" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1L1 -1M0 5L5 0M4 6L6 4" stroke="#697480" stroke-width=".8"/></pattern></defs>' : ''}${cells.join('')}</svg><small>${backward ? 'Skip distant tiles' : 'Read the full window'}</small></div>`;
}

export const attention = `<figure class="research-figure editorial-figure nano-figure" aria-labelledby="nano-attention-title">
<figcaption id="nano-attention-title"><span class="figure-number">Attention · one example head</span><strong>Where the backward pass can skip work</strong></figcaption>
<div class="nano-matrices">${heatmap(false)}${heatmap(true)}</div>
<p class="figure-foot">Read across a row from older tokens to newer ones. Brighter tiles show stronger attention in this sketch. Hatched tiles still counted in the forward softmax; the backward kernel skips them.</p></figure>`;

export const vote = `<figure class="research-figure editorial-figure nano-figure nano-vote" aria-labelledby="nano-vote-title" data-nano-vote>
<figcaption id="nano-vote-title"><span class="figure-number">Table vote · worked example</span><strong>How much should three matches count?</strong></figcaption>
<p>Going into the 20-token lookup, a particular next token has a 20% chance. In this example every matching passage continues with that token.</p>
<div class="nano-bar"><span>Before the lookup</span><b>20%</b><i><em style="width:20%"></em></i></div>
<div class="nano-bar nano-after"><span>After the vote</span><b data-prob>62.1%</b><i><em data-fill style="width:62.1%"></em></i></div>
<label class="nano-slider" hidden>Matching passages <output for="nano-count">3</output><input type="range" id="nano-count" min="0" max="16" value="3"></label>
<p class="figure-foot">With three matches and k = 2.694, the probability is (3 + 2.694 × 0.20) / (3 + 2.694) ≈ 62.1%.</p></figure>`;
