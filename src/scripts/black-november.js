/* Scripts extraídos de black-november.html */

/* Galeria em mosaico: clique amplia a foto; Esc ou clique fora fecham; setas do teclado passam a foto */  
 (function () {  
 var botoes = [].slice.call(document.querySelectorAll('.mosaico__botao'));  
 var caixa = document.querySelector('.ampliada');  
 if (!botoes.length || !caixa) return;  
 var img = caixa.querySelector('.ampliada__palco img');  
 var fechar = caixa.querySelector('.ampliada__fechar');  
 var atual = 0, origem = null;  
  
 function mostrar(i) {  
 atual = (i + botoes.length) % botoes.length;  
 var fonte = botoes[atual].querySelector('img');  
 img.classList.remove('pronta');  
 setTimeout(function () {  
 img.onload = function () { img.classList.add('pronta'); };  
 img.src = fonte.currentSrc || fonte.src;  
 img.alt = fonte.alt;  
 if (img.complete) img.classList.add('pronta');  
 }, caixa.classList.contains('aberta') ? 200 : 0);  
 }  
 function abrir(i) {  
 origem = botoes[i]; /* volta o foco para a foto clicada ao fechar */  
 mostrar(i);  
 caixa.classList.add('aberta');  
 caixa.setAttribute('aria-hidden', 'false');  
 document.body.style.overflow = 'hidden';  
 fechar.focus();  
 }  
 function fecharCaixa() {  
 caixa.classList.remove('aberta');  
 caixa.setAttribute('aria-hidden', 'true');  
 document.body.style.overflow = '';  
 if (origem) origem.focus();  
 }  
  
 botoes.forEach(function (b, i) { b.addEventListener('click', function () { abrir(i); }); });  
 fechar.addEventListener('click', fecharCaixa);  
 caixa.addEventListener('click', function (e) {  
 if (e.target === caixa) fecharCaixa();  
 });  
 document.addEventListener('keydown', function (e) {  
 if (!caixa.classList.contains('aberta')) return;  
 if (e.key === 'Escape') fecharCaixa();  
 if (e.key === 'ArrowRight') mostrar(atual + 1);  
 if (e.key === 'ArrowLeft') mostrar(atual - 1);  
 });  
 })();  
  
 /* Cortesias em abas (desktop e mobile): troca de categoria, setas e links "Consulte cortesias" */  
 (function () {  
 var raiz = document.querySelector('.cortesias-abas');  
 if (!raiz) return;  
 var abasAtivas = window.matchMedia('all'); /* abas valem em todas as larguras */  
 var abas = [].slice.call(raiz.querySelectorAll('[role="tab"]'));  
 var paineis = abas.map(function (aba) { return document.getElementById(aba.getAttribute('aria-controls')); });  
 var setaAnterior = raiz.querySelector('[data-cortesias="anterior"]');  
 var setaProxima = raiz.querySelector('[data-cortesias="proxima"]');  
  
 function trilhoAtivo() {  
 var painel = raiz.querySelector('.cortesias.is-ativa');  
 return painel ? painel.querySelector('.cortesias__grade') : null;  
 }  
  
 function atualizarSetas() {  
 var trilho = trilhoAtivo();  
 if (!trilho) return;  
 setaAnterior.disabled = trilho.scrollLeft <= 2;  
 setaProxima.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 2;  
 }  
  
 function ativar(id) {  
 abas.forEach(function (aba, i) {  
 var ativa = aba.getAttribute('aria-controls') === id;  
 aba.setAttribute('aria-selected', ativa ? 'true' : 'false');  
 aba.tabIndex = ativa ? 0 : -1;  
 paineis[i].classList.toggle('is-ativa', ativa);  
 });  
 var trilho = trilhoAtivo();  
 if (trilho) trilho.scrollLeft = 0;  
 atualizarSetas();  
 }  
  
 function aplicarPapeis() {  
 paineis.forEach(function (painel, i) {  
 if (abasAtivas.matches) {  
 painel.setAttribute('role', 'tabpanel');  
 painel.setAttribute('aria-labelledby', abas[i].id);  
 } else {  
 painel.removeAttribute('role');  
 painel.removeAttribute('aria-labelledby');  
 }  
 });  
 atualizarSetas();  
 }  
  
 abas.forEach(function (aba, i) {  
 aba.addEventListener('click', function () { ativar(aba.getAttribute('aria-controls')); });  
 aba.addEventListener('keydown', function (e) {  
 if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;  
 var proxima = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];  
 proxima.focus();  
 ativar(proxima.getAttribute('aria-controls'));  
 });  
 });  
  
 [setaAnterior, setaProxima].forEach(function (seta) {  
 seta.addEventListener('click', function () {  
 var trilho = trilhoAtivo();  
 if (!trilho) return;  
 var card = trilho.querySelector('.cortesia');  
 var passo = card ? card.getBoundingClientRect().width + 24 : trilho.clientWidth * 0.8;  
 trilho.scrollBy({ left: seta === setaProxima ? passo : -passo, behavior: 'smooth' });  
 });  
 });  
  
 paineis.forEach(function (painel) {  
 painel.querySelector('.cortesias__grade').addEventListener('scroll', atualizarSetas, { passive: true });  
 });  
  
 /* Links "Consulte cortesias": abrem a aba certa */  
 document.querySelectorAll('a[href^="#cortesias-"]').forEach(function (link) {  
 link.addEventListener('click', function (e) {  
 if (!abasAtivas.matches) return;  
 var id = link.getAttribute('href').slice(1);  
 if (paineis.indexOf(document.getElementById(id)) === -1) return;  
 e.preventDefault();  
 ativar(id);  
 raiz.scrollIntoView({ behavior: 'smooth', block: 'start' });  
 });  
 });  
  
 raiz.classList.add('is-abas');  
 var inicial = location.hash.slice(1);  
 ativar(paineis.some(function (p) { return p.id === inicial; }) ? inicial : paineis[0].id);  
 aplicarPapeis();  
 abasAtivas.addEventListener('change', aplicarPapeis);  
 window.addEventListener('resize', atualizarSetas);  
 })();  
  
 /* Animação dos números de desconto: hero ao carregar; caixas ao entrar na tela (uma vez) */  
 (function () {  
 var desktop = window.matchMedia('(min-width: 960px)');  
 var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)');  
 if (reduzir.matches || !('IntersectionObserver' in window)) return;  
 /* Mobile: classes próprias (hero + caixas); desktop: classe original */  
 if (desktop.matches) document.documentElement.classList.add('anima-numeros');  
 else document.documentElement.classList.add('anima-hero-mobile', 'anima-caixas-mobile');  
  
 var DURACAO = 1200;  
 function suave(t) { return 1 - Math.pow(1 - t, 3); } /* desacelera no final */  
  
 function contar(caixa) {  
 var el = caixa.querySelector('.contador');  
 var final = parseInt(el.getAttribute('data-valor'), 10);  
 var inicio = null;  
 function quadro(agora) {  
 if (inicio === null) inicio = agora;  
 var t = Math.min(1, (agora - inicio) / DURACAO);  
 el.textContent = Math.round(final * suave(t));  
 if (t < 1) requestAnimationFrame(quadro);  
 }  
 el.textContent = '0';  
 caixa.classList.add('contado');  
 requestAnimationFrame(quadro);  
 }  
  
 var observador = new IntersectionObserver(function (entradas) {  
 entradas.forEach(function (e) {  
 if (!e.isIntersecting) return;  
 contar(e.target);  
 observador.unobserve(e.target);  
 });  
 }, { threshold: 0.6 });  
 document.querySelectorAll('.inclui__principal').forEach(function (caixa) {  
 var el = caixa.querySelector('.contador');  
 el.style.minWidth = el.getBoundingClientRect().width + 'px'; /* reserva a largura do valor final */  
 el.textContent = '0';  
 observador.observe(caixa);  
 });  
 })();  
  
 /* Galeria no mobile (até 560px): carrossel �?" foto central ativa, bolinhas, toque na lateral centraliza */  
 (function () {  
 var trilho = document.querySelector('.mosaico');  
 if (!trilho) return;  
 var originais = [].slice.call(trilho.children);  
 var fotos = originais.slice();  
 /* Ordem visual do carrossel (propriedade CSS order); fora do carrossel, ordem do HTML */  
 function ordenar() {  
 fotos = originais.slice().sort(function (a, b) {  
 return (parseInt(getComputedStyle(a).order, 10) || 0) - (parseInt(getComputedStyle(b).order, 10) || 0)  
 || originais.indexOf(a) - originais.indexOf(b);  
 });  
 }  
 ordenar();  
 var pontos = document.createElement('div');  
 pontos.className = 'mosaico-pontos';  
 pontos.setAttribute('aria-label', 'Escolher foto da galeria');  
 var botoes = fotos.map(function (foto, i) {  
 var b = document.createElement('button');  
 b.type = 'button';  
 b.setAttribute('aria-label', 'Ir para a foto ' + (i + 1));  
 b.addEventListener('click', function () { centralizar(i); });  
 pontos.appendChild(b);  
 return b;  
 });  
 trilho.after(pontos);  
 var ativa = 0;  
  
 function emCarrossel() { return getComputedStyle(trilho).display === 'flex'; }  
 function centralizar(i) {  
 i = Math.max(0, Math.min(fotos.length - 1, i));  
 var f = fotos[i];  
 trilho.scrollTo({ left: f.offsetLeft - (trilho.clientWidth - f.offsetWidth) / 2 });  
 }  
 /* Espaço inicial/final do trilho = o necessário para centralizar a 1ª e a última foto (larguras variam) */  
 function ajustarEspacos() {  
 if (!emCarrossel()) { trilho.style.paddingLeft = ''; trilho.style.paddingRight = ''; return; }  
 var tela = trilho.getBoundingClientRect().width;  
 trilho.style.paddingLeft = Math.max(0, (tela - fotos[0].getBoundingClientRect().width) / 2) + 'px';  
 trilho.style.paddingRight = Math.max(0, (tela - fotos[fotos.length - 1].getBoundingClientRect().width) / 2) + 'px';  
 }  
 function marcarAtiva() {  
 if (!emCarrossel()) { fotos.forEach(function (f) { f.classList.remove('is-ativa'); }); return; }  
 var centro = trilho.scrollLeft + trilho.clientWidth / 2;  
 var menor = Infinity;  
 fotos.forEach(function (f, i) {  
 var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - centro);  
 if (d < menor) { menor = d; ativa = i; }  
 });  
 fotos.forEach(function (f, i) { f.classList.toggle('is-ativa', i === ativa); });  
 botoes.forEach(function (b, i) {  
 if (i === ativa) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');  
 });  
 }  
  
 /* Toque numa foto lateral: só traz para o centro (a central abre ampliada) */  
 trilho.addEventListener('click', function (e) {  
 if (!emCarrossel()) return;  
 var i = fotos.indexOf(e.target.closest('.mosaico__foto'));  
 if (i !== -1 && i !== ativa) { e.stopPropagation(); e.preventDefault(); centralizar(i); }  
 }, true);  
  
 var quadro;  
 trilho.addEventListener('scroll', function () { cancelAnimationFrame(quadro); quadro = requestAnimationFrame(marcarAtiva); }, { passive: true });  
 window.addEventListener('resize', function () { ordenar(); ajustarEspacos(); marcarAtiva(); });  
 ajustarEspacos();  
 marcarAtiva();  
 })();  
 /* Cortesias no mobile: carrossel dos cards em cada aba (mesmo comportamento da galeria) */  
 (function () {  
 var mobile = window.matchMedia('(max-width: 959px)');  
 var carrosseis = [].slice.call(document.querySelectorAll('.cortesias-abas .cortesias__grade')).map(function (trilho) {  
 var itens = [].slice.call(trilho.children);  
 var pontos = document.createElement('div');  
 pontos.className = 'cortesias-pontos';  
 var botoes = itens.map(function (item, i) {  
 var b = document.createElement('button');  
 b.type = 'button';  
 b.setAttribute('aria-label', 'Ir para a cortesia ' + (i + 1));  
 b.addEventListener('click', function () { centralizar(i); });  
 pontos.appendChild(b);  
 return b;  
 });  
 trilho.after(pontos);  
 var ativa = 0;  
 function centralizar(i) { var f = itens[i]; trilho.scrollTo({ left: f.offsetLeft - (trilho.clientWidth - f.offsetWidth) / 2 }); }  
 function marcar() {  
 if (!mobile.matches) { itens.forEach(function (f) { f.classList.remove('is-ativa'); }); return; }  
 var centro = trilho.scrollLeft + trilho.clientWidth / 2, menor = Infinity;  
 itens.forEach(function (f, i) { var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - centro); if (d < menor) { menor = d; ativa = i; } });  
 itens.forEach(function (f, i) { f.classList.toggle('is-ativa', i === ativa); });  
 botoes.forEach(function (b, i) { if (i === ativa) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });  
 }  
 trilho.addEventListener('click', function (e) {  
 if (!mobile.matches) return;  
 var i = itens.indexOf(e.target.closest('.cortesia'));  
 if (i !== -1 && i !== ativa) { e.preventDefault(); centralizar(i); }  
 });  
 var q; trilho.addEventListener('scroll', function () { cancelAnimationFrame(q); q = requestAnimationFrame(marcar); }, { passive: true });  
 return marcar;  
 });  
 function atualizar() { carrosseis.forEach(function (m) { m(); }); }  
 document.querySelectorAll('.cortesias-abas__aba, a[href^="#cortesias-"]').forEach(function (el) {  
 el.addEventListener('click', function () { setTimeout(atualizar, 0); });  
 });  
 window.addEventListener('resize', atualizar);  
 atualizar();  
 })();