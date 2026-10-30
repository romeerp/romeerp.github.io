(()=>{
  const controls={'\uE001':'TITLE','\uE002':'ALLCAPS','\uE003':'CAPNEXT','\uE004':'ESC'};
  const alpha=c=>/^[A-Za-z]$/.test(c);
  function encode(text){
    const out=[];const lit=text=>out.push({text});const op=op=>out.push({op});
    for(let i=0;i<text.length;){
      if(alpha(text[i])){
        let j=i+1;while(j<text.length&&alpha(text[j]))j++;
        const word=text.slice(i,j);i=j;
        if(word===word.toLowerCase())lit(word);
        else if(word.length>=2&&word===word.toUpperCase()){op('ALLCAPS');lit(word.toLowerCase());}
        else if(/^[A-Z][a-z]+$/.test(word)){op('TITLE');lit(word.toLowerCase());}
        else{
          if(/[A-Z]/.test(word[0]))op('TITLE');
          lit(word[0].toLowerCase());
          for(const c of word.slice(1)){if(/[A-Z]/.test(c))op('CAPNEXT');lit(c.toLowerCase());}
        }
      }else{const c=text[i++];if(controls[c])op('ESC');lit(c);}
    }return out;
  }
  function decode(tokens){
    let out='',title=false,all=false,cap=false,escaped=false;
    for(const t of tokens){
      if(t.op){if(t.op==='TITLE')title=true;else if(t.op==='ALLCAPS')all=true;else if(t.op==='CAPNEXT')cap=true;else if(t.op==='ESC')escaped=true;continue;}
      for(const c of t.text){
        if(escaped){out+=c;escaped=false;all=false;continue;}
        if(alpha(c)){out+=(title||all||cap)?c.toUpperCase():c;title=false;cap=false;}
        else{out+=c;title=false;all=false;cap=false;}
      }
    }return out;
  }
  if(typeof module!=='undefined')module.exports={encode,decode};
  if(typeof document==='undefined')return;
  const input=document.getElementById('case-input'),output=document.getElementById('case-output'),decoded=document.getElementById('case-decoded');
  if(!input)return;
  function update(){const tokens=encode(input.value);output.replaceChildren();for(const token of tokens){if(token.op){const span=document.createElement('span');span.className='operator';span.textContent=token.op;output.append(span);}else output.append(document.createTextNode(token.text));}decoded.textContent=decode(tokens);}
  input.addEventListener('input',update);
  document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.example;update();}));
  update();
})();

