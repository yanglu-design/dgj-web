const {groups:platformGroups,trialText:platformTrialText,badgeText:platformBadgeText}=window.DGJPlatformCatalog;
const platformGrid=document.querySelector('#platformGrid'),platformTabs=[...document.querySelectorAll('.platform-segmented button')],platformKeys=['mainstream','instant','supply','preferred'];
function renderPlatforms(key) { window.DGJPlatformCards.render(platformGrid, platformGroups[key]); }
platformTabs.forEach((tab,i)=>{tab.dataset.platformGroup=platformKeys[i];tab.setAttribute('role','tab');tab.setAttribute('aria-selected',String(i===0));tab.addEventListener('click',()=>{platformTabs.forEach(item=>{const active=item===tab;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active))});renderPlatforms(tab.dataset.platformGroup)})});
renderPlatforms('mainstream');
const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});nav.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')});
const hero=document.querySelector('.hero'),heroTrack=document.querySelector('.hero-track'),slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.dots button')];let slideIndex=0,carouselTimer;
function showSlide(index){slideIndex=(index+slides.length)%slides.length;heroTrack.style.transform=`translate3d(-${slideIndex*100}%,0,0)`;slides.forEach((slide,i)=>slide.classList.toggle('active',i===slideIndex));dots.forEach((dot,i)=>{dot.classList.toggle('active',i===slideIndex);dot.setAttribute('aria-selected',String(i===slideIndex))})}
function startCarousel(){clearInterval(carouselTimer);carouselTimer=setInterval(()=>showSlide(slideIndex+1),5000)}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startCarousel()}));hero.addEventListener('mouseenter',()=>clearInterval(carouselTimer));hero.addEventListener('mouseleave',startCarousel);showSlide(0);startCarousel();

const solutionTabs=[...document.querySelectorAll('.solution-tabs button')],solutionSlider=document.querySelector('.solution-slider'),solutionPanels=[...document.querySelectorAll('[data-plan-panel]')];
function showSolutionPlan(key){if(!solutionSlider||solutionSlider.dataset.active===key)return;solutionSlider.dataset.active=key;solutionTabs.forEach(tab=>{const active=tab.dataset.plan===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))});solutionPanels.forEach(panel=>{const active=panel.dataset.planPanel===key;panel.setAttribute('aria-hidden',String(!active));panel.inert=!active})}
solutionTabs.forEach(tab=>tab.addEventListener('click',()=>showSolutionPlan(tab.dataset.plan)));

// Both categories use twelve placeholders; keep separate panels for sliding.
const matrixTabs = [...document.querySelectorAll('.matrix-tabs button')];
const matrixSlider = document.querySelector('.matrix-slider');
const matrixPanels = [...document.querySelectorAll('[data-matrix-panel]')];
function selectMatrixTab(tab) {
  matrixTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  matrixSlider.dataset.active = tab.dataset.matrix;
  matrixPanels.forEach(panel => {
    const active = panel.dataset.matrixPanel === tab.dataset.matrix;
    panel.setAttribute('aria-hidden', String(!active));
    panel.inert = !active;
  });
}
matrixTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectMatrixTab(tab));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % matrixTabs.length
      : event.key === 'ArrowLeft' ? (index + matrixTabs.length - 1) % matrixTabs.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? matrixTabs.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); selectMatrixTab(matrixTabs[next]); matrixTabs[next].focus();
  });
});

const featureLinks = [...document.querySelectorAll('.feature-details')];
featureLinks.forEach(link => {
  const card = link.closest('article');
  link.addEventListener('click', event => {
    card.classList.add('is-dismissed');
    if (event.detail > 0) link.blur();
  });
  card.addEventListener('pointerleave', () => card.classList.add('is-dismissed'));
  card.addEventListener('pointerenter', () => card.classList.remove('is-dismissed'));
  link.addEventListener('focus', () => {
    if (link.matches(':focus-visible')) card.classList.remove('is-dismissed');
  });
});
window.addEventListener('blur', () => {
  featureLinks.forEach(link => link.closest('article').classList.add('is-dismissed'));
});
