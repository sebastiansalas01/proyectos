(function(){
  const fab=document.getElementById('vFab'),panel=document.getElementById('vPanel');
  if(!fab||!panel)return;
  const mic=document.getElementById('vMic'),st=document.getElementById('vState'),txt=document.getElementById('vText');
  const msg=document.getElementById('vMsg'),wa=document.getElementById('vWa'),sec=document.getElementById('vSec');
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let rec=null,listening=false,base='';
  function toggle(open){panel.hidden=!open;fab.setAttribute('aria-expanded',String(open));}
  fab.addEventListener('click',()=>toggle(panel.hidden));
  document.getElementById('vClose').addEventListener('click',()=>toggle(false));
  function upWa(){wa.href='https://wa.me/?text='+encodeURIComponent('🎙️ Comentario Business Plan ('+sec.value+'): '+txt.value.trim());}
  txt.addEventListener('input',upWa);sec.addEventListener('change',upWa);
  wa.addEventListener('click',e=>{if(!txt.value.trim()){e.preventDefault();msg.textContent='Dicta o escribe algo antes de enviarlo.';}});
  function setState(on){listening=on;mic.setAttribute('aria-pressed',String(on));mic.textContent=on?'■ Parar':'● Grabar';fab.classList.toggle('rec',on);st.textContent=on?'Escuchando…':'';}
  if(SR){
    document.getElementById('vHint').innerHTML='Pulsa <b>Grabar</b>, habla y pulsa otra vez para terminar. Corrige el texto si hace falta y envíalo al grupo.';
    mic.addEventListener('click',()=>{
      if(listening&&rec){rec.stop();return;}
      rec=new SR();rec.lang='es-CO';rec.interimResults=true;rec.continuous=true;
      base=txt.value.trim();
      rec.onresult=e=>{let fin='',tmp='';for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i];if(r.isFinal)fin+=r[0].transcript;else tmp+=r[0].transcript;}if(fin)base=(base+' '+fin).trim();txt.value=(base+' '+tmp).trim();upWa();};
      rec.onerror=e=>{st.textContent=e.error==='not-allowed'?'Permiso de micrófono denegado: usa el micrófono del teclado.':'No se pudo usar el micrófono: usa el del teclado.';setState(false);};
      rec.onend=()=>setState(false);
      try{rec.start();setState(true);}catch(err){st.textContent='No se pudo iniciar: usa el micrófono del teclado.';}
    });
  } else {
    mic.parentElement.hidden=true;
  }
  upWa();
})();
