const pages=[...document.querySelectorAll(".page")];
const nav=[...document.querySelectorAll(".nav-links a")];
const pageNo=document.getElementById("pageNo");
const progress=document.querySelector(".progress");
const prev=document.getElementById("prev"),next=document.getElementById("next"),dots=document.getElementById("dots");
let current=0,locked=false,wheelTimer=0;
for(let i=0;i<pages.length;i++){const d=document.createElement("button");d.className="dot";d.title=`Página ${i+1}`;d.onclick=()=>go(i);dots.appendChild(d)}
const dotEls=[...dots.children];
function go(n){
 n=Math.max(0,Math.min(pages.length-1,n));
 if(n===current && pages[n].classList.contains("active")) return;
 pages.forEach((p,i)=>p.classList.toggle("active",i===n));
 current=n;
 location.hash=n;
 pageNo.textContent=String(n+1).padStart(2,"0");
 progress.style.setProperty("--prog",`${((n+1)/pages.length)*100}%`);
 prev.disabled=n===0; next.disabled=n===pages.length-1;
 dotEls.forEach((d,i)=>d.classList.toggle("active",i===n));
 nav.forEach((a,i)=>a.classList.toggle("active",a.getAttribute("href")==="#"+n));
 pages[n].scrollTop=0;
}
function fromHash(){const h=location.hash.slice(1);const n=/^\d+$/.test(h)?Number(h):0;go(n)}
nav.forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go(Number(a.getAttribute("href").slice(1)));document.getElementById("nav").classList.remove("open")}));
document.querySelector(".menu-btn")?.addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
prev.onclick=()=>go(current-1);next.onclick=()=>go(current+1);
window.addEventListener("hashchange",fromHash);
window.addEventListener("wheel",e=>{
 if(Date.now()<wheelTimer)return;
 const p=pages[current], atTop=p.scrollTop<=2, atBottom=p.scrollTop+p.clientHeight>=p.scrollHeight-2;
 if(e.deltaY>0 && (atBottom||p.scrollHeight<=p.clientHeight)){wheelTimer=Date.now()+650;go(current+1)}
 else if(e.deltaY<0 && (atTop||p.scrollHeight<=p.clientHeight)){wheelTimer=Date.now()+650;go(current-1)}
},{passive:true});
let touchY=0;
window.addEventListener("touchstart",e=>touchY=e.touches[0].clientY,{passive:true});
window.addEventListener("touchend",e=>{const dy=touchY-e.changedTouches[0].clientY;if(Math.abs(dy)>55){const p=pages[current],atTop=p.scrollTop<=2,atBottom=p.scrollTop+p.clientHeight>=p.scrollHeight-2;if(dy>0&&(atBottom||p.scrollHeight<=p.clientHeight))go(current+1);else if(dy<0&&(atTop||p.scrollHeight<=p.clientHeight))go(current-1)}},{passive:true});
fromHash();

const aiLauncher=document.getElementById("aiLauncher");
const aiPanel=document.getElementById("aiPanel");
const aiClose=document.getElementById("aiClose");
const aiForm=document.getElementById("aiForm");
const aiInput=document.getElementById("aiInput");
const aiMessages=document.getElementById("aiMessages");
const aiSuggestions=[...document.querySelectorAll("[data-question]")];

function toggleAssistant(open){
	aiPanel.classList.toggle("open",open);
	aiPanel.setAttribute("aria-hidden",String(!open));
	aiLauncher.setAttribute("aria-expanded",String(open));
	if(open) aiInput.focus();
}
function addAiMessage(text,role="assistant"){
	const message=document.createElement("div");
	message.className=`ai-message ${role}`;
	message.innerHTML=role==="assistant"?`<span class="ai-avatar">✦</span><p>${text}</p>`:`<p>${text}</p>`;
	aiMessages.appendChild(message);
	aiMessages.scrollTop=aiMessages.scrollHeight;
}
function answerStudent(question){
	const q=question.toLowerCase();
	if(/horario|hora|ingreso|salida|primaria|secundaria/.test(q)) return "Primaria ingresa a las 7:00 a. m. y sale a las 12:10 p. m. Secundaria ingresa a la 1:00 p. m. y sale a las 6:35 p. m.";
	if(/evaluaci|ad\b|\ba\b|\bb\b|\bc\b|logro/.test(q)) return "AD es logro destacado, A es logro esperado, B significa en proceso y C indica en inicio. Puedes consultar el detalle en la sección Sistema de evaluación.";
	if(/valor|principio|respeto|responsabilidad|fe|disciplina/.test(q)) return "Los valores institucionales son amor, respeto, justicia, responsabilidad, trabajo, fe y disciplina.";
	if(/misi[oó]n/.test(q)) return "La misión busca brindar un servicio educativo público de calidad en primaria y secundaria, con aprendizajes significativos, inclusión y valores.";
	if(/visi[oó]n|2027/.test(q)) return "La visión al 2027 proyecta una institución eficiente, innovadora, inclusiva, ecológica, emprendedora e intercultural.";
	if(/calendario|calendarizaci[oó]n|año|clases|bloque/.test(q)) return "El año escolar 2026 inicia su trabajo técnico pedagógico el 2 de marzo. El portafolio incluye todos los bloques y fechas en Calendarización del año escolar.";
	if(/convivencia|norma|bullying|acoso|seguridad/.test(q)) return "La institución promueve respeto, responsabilidad, buen trato, inclusión, cuidado del ambiente y rechazo a la discriminación y al ciberbullying. Si existe un caso de riesgo, comunícalo inmediatamente a un adulto responsable.";
	if(/estudiante|derecho|responsabilidad/.test(q)) return "Los estudiantes tienen derecho a no ser discriminados, opinar, recibir un servicio educativo de calidad y conocer sus avances. También deben participar, cumplir actividades, respetar normas y cuidar los bienes.";
	if(/quién|quien|director|directora|personal/.test(q)) return "El director es Vicente Paul Chorres Alburquerque. En la sección Personal encontrarás la relación completa de directivos, docentes, administrativos y auxiliares.";
	return "Puedo ayudarte con horarios, calendario 2026, misión, visión, valores, convivencia, derechos, responsabilidades y sistema de evaluación. ¿Sobre cuál tema deseas consultar?";
}
function askAssistant(question){
	const clean=question.trim();
	if(!clean) return;
	addAiMessage(clean,"user");
	aiInput.value="";
	const loading=document.createElement("div");
	loading.className="ai-message assistant is-loading";
	loading.innerHTML='<span class="ai-avatar">✦</span><p>Estoy revisando el portafolio<span class="loading-dots">...</span></p>';
	aiMessages.appendChild(loading);
	aiMessages.scrollTop=aiMessages.scrollHeight;
	window.setTimeout(()=>{loading.remove();addAiMessage(answerStudent(clean))},420);
}
aiLauncher?.addEventListener("click",()=>toggleAssistant(!aiPanel.classList.contains("open")));
aiClose?.addEventListener("click",()=>toggleAssistant(false));
aiForm?.addEventListener("submit",event=>{event.preventDefault();askAssistant(aiInput.value)});
aiSuggestions.forEach(button=>button.addEventListener("click",()=>askAssistant(button.dataset.question)));
