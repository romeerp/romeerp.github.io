export const sandwich = `<figure class="research-figure editorial-figure sandwich-figure" aria-labelledby="sandwich-title">
<figcaption id="sandwich-title"><span class="figure-number">The geometry</span><strong>Scale. Balance. Scale again.</strong></figcaption>
<div class="geometry-stages">${[['Scale','Stretch the two axes differently.',1,2.25],['Polar','Bring their lengths back together.',2.25,1],['Scale again','The same preference reappears.',1,2.25]].map(([title,description,start,end],i)=>`<div class="geometry-card" data-stage="${i}" style="--from:${start};--to:${end}"><span class="stage-kicker">0${i+1}</span><svg viewBox="0 0 180 160" role="img" aria-label="${description}"><path d="M20 80H160M90 12V148" class="plot-grid"/><circle cx="90" cy="80" r="26" class="reference-circle"/><g class="shape-motion"><ellipse cx="90" cy="80" rx="26" ry="26"/><path d="M90 54V106" class="shape-axis"/></g><path d="M64 80H116" class="shape-axis blue-axis"/><circle cx="90" cy="80" r="3" fill="#edf3ff"/></svg><strong>${title}</strong><span>${description}</span></div>`).join('')}</div>
<div class="motion-caption">Old momentum chooses the row and column multipliers. Apply them on both sides of polar, then normalize the update length.</div><p class="figure-foot">A diagonal example with ideal polar. Each ellipse shows how the matrix stretches a circle.</p></figure>`;

export const splitk = `<figure class="research-figure editorial-figure splitk-figure" aria-labelledby="splitk-title">
<figcaption id="splitk-title"><span class="figure-number">Inside the GPU</span><strong>One long sum. Several parallel workers.</strong></figcaption>
<div class="dot-product-label">A long dot product</div><div class="dot-ribbon" aria-label="One dot product divided into three illustrative chunks">${Array.from({length:18},(_,i)=>`<i style="--chunk:${Math.floor(i/6)}" class="chunk-${Math.floor(i/6)}"></i>`).join('')}</div>
<div class="worker-grid">${['A','B','C'].map((x,i)=>`<div class="worker worker-${i}"><span class="worker-wire" aria-hidden="true"></span><span class="stage-kicker">Worker ${x}</span><div class="partial-sum">Σ <span class="worker-dots">· · ·</span></div><span class="precision-tag">FP16 store</span></div>`).join('')}</div>
<svg class="merge-wires" viewBox="0 0 600 45" aria-hidden="true"><path d="M100 0V16Q100 23 108 23H292Q300 23 300 31V45M300 0V45M500 0V16Q500 23 492 23H308Q300 23 300 31"/></svg>
<div class="sum-result">Σ <span>Combine the rounded partial sums</span></div>
<div class="motion-caption">Parallel work keeps the GPU busy. Storing each partial sum adds a rounding boundary before the final sum.</div><p class="figure-foot">Split-K illustrated with three workers. The split count depends on the execution backend.</p></figure>`;

export const caseops = `<figure class="research-figure editorial-figure sharing-figure" aria-labelledby="sharing-title">
<figcaption id="sharing-title"><span class="figure-number">One spelling, three forms</span><strong>Spend the vocabulary on the word.</strong></figcaption>
<div class="case-branches">${[['apple','no operator'],['Apple','TITLE'],['APPLE','ALLCAPS']].map(([word,op],i)=>`<div data-stage="${i}"><span class="word-variant">${word}</span><span class="case-connector" aria-hidden="true">↓</span><span class="case-instruction ${i?'':'no-op'}">${op}</span></div>`).join('')}</div>
<svg class="sharing-wires" viewBox="0 0 600 70" aria-hidden="true"><path d="M100 0V20Q100 35 115 35H285Q300 35 300 50V70M300 0V70M500 0V20Q500 35 485 35H315Q300 35 300 50"/><circle class="travel-dot" r="4" cx="300" cy="64"/></svg>
<div class="shared-word"><span>Shared spelling</span><strong>apple</strong></div>
<div class="motion-caption">All three forms reuse the same lowercase pieces. Only the capitalization instruction changes.</div><p class="figure-foot">The lowercase spelling is shared before BPE; it can span several tokens.</p></figure>`;

const paper = (x,y,n) => `<g class="buffer-paper" data-paper="${n}" transform="translate(${x} ${y})"><rect width="32" height="42" rx="2"/><path d="M7 12H25M7 18H25M7 24H20"/><text x="16" y="36">${n}</text></g>`;
export const ttt = `<figure class="ttt-scene" aria-labelledby="learning-title" data-ttt data-mode="ready">
<figcaption id="learning-title"><span class="figure-number">Read → remember → learn → repeat</span><strong>The next document gets a better starting point.</strong></figcaption>
<svg viewBox="0 0 660 370" role="img" aria-labelledby="ttt-scene-title ttt-scene-desc">
<title id="ttt-scene-title">Scored documents collect in a buffer, then train the shared model</title><desc id="ttt-scene-desc">Score documents using local LoRA. Only after scoring, move them into the completed-document buffer. At a phase boundary use completed documents for SGD, then resume scoring with the updated base. Earlier scores remain fixed.</desc>
<defs><marker id="ttt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs>
<text class="scene-label" x="92" y="30" text-anchor="middle">SCORE</text><text class="scene-label" x="331" y="30" text-anchor="middle">BUFFER</text><text class="scene-label" x="565" y="30" text-anchor="middle">SHARED BASE</text>
<g class="reading-paper" transform="translate(52 69)"><rect width="80" height="106" rx="3"/><text x="40" y="24" text-anchor="middle" data-current-doc>Doc 1</text><path class="reading-lines" d="M16 40H64M16 51H60M16 62H64M16 73H49"/><path class="scan-line" d="M9 40H71"/></g>
<text class="scene-note" x="92" y="211" text-anchor="middle">local LoRA</text><text class="scene-note" x="92" y="230" text-anchor="middle">score first</text>
<path class="delivery-rail" d="M145 120H240" marker-end="url(#ttt-arrow)"/>
<text class="rail-label" x="193" y="100" text-anchor="middle">then store</text>
<path class="buffer-tray" d="M253 67V201Q253 209 261 209H402Q410 209 410 201V67"/>
${[1,2,3,4,5,6].map((n)=>paper(271+((n-1)%3)*44,78+Math.floor((n-1)/3)*62,n)).join('')}
<text class="scene-note" x="331" y="239" text-anchor="middle" data-buffer-count>0 documents scored</text>
<path class="training-rail" d="M422 120H490" marker-end="url(#ttt-arrow)"/>
<text class="rail-label sgd-label" x="455" y="100" text-anchor="middle">SGD</text>
<g class="model-neurons">${Array.from({length:9},(_,i)=>`<circle cx="${529+i%3*34}" cy="${83+Math.floor(i/3)*34}" r="9" style="--i:${i}"/>`).join('')}</g>
<text class="model-version" x="563" y="211" text-anchor="middle" data-model-version>base v0</text>
<path class="return-rail" d="M563 246V286Q563 302 547 302H108Q92 302 92 286V251" marker-end="url(#ttt-arrow)"/>
<text class="return-label" x="330" y="331" text-anchor="middle">resume scoring with the updated base</text>
<g class="flying-paper" aria-hidden="true"><rect width="32" height="42" rx="2"/><path d="M7 12H25M7 18H25M7 24H20"/></g>
</svg>
<div class="ttt-status"><span class="phase-label" data-phase>Before the first phase</span><p data-ttt-caption aria-live="polite">Documents enter the buffer only after their scores are recorded. The shared model learns from that completed prefix.</p></div>
<div class="ttt-controls" hidden><button type="button" data-ttt-play>▶ Watch two rounds</button><button type="button" data-ttt-next>Step →</button><span data-ttt-count></span></div>
<p class="scene-foot">Three documents per phase here to make the flow visible. The first implementation used a 2,000-document prefix; later versions repeated the phases.</p></figure>`;
