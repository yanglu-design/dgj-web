const platforms=[['抖音','抖音20.svg'],['淘宝/淘特','淘宝20.svg'],['天猫','天猫20.svg'],['微信小店/视频号','微信小店20.svg'],['闲鱼回收','闲鱼20.svg'],['京东','京东20.svg'],['快手','快手20.svg'],['拼多多','拼多多20.svg'],['小红书','小红书20.svg'],['淘工厂','淘工厂20.svg'],['自由商城','自由商城20.svg'],['开放平台','其他平台20.svg']];
document.querySelector('#platformGrid').innerHTML=platforms.map((p,i)=>`<div class="platform-card"><img src="assets/icon/${p[1]}" alt=""><span>${p[0]}</span>${i<9?'<em>免费试用</em>':''}</div>`).join('');
const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});nav.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')});
const hero=document.querySelector('.hero'),heroTrack=document.querySelector('.hero-track'),slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.dots button')];let slideIndex=0,carouselTimer;
function showSlide(index){slideIndex=(index+slides.length)%slides.length;heroTrack.style.transform=`translate3d(-${slideIndex*100}%,0,0)`;slides.forEach((slide,i)=>slide.classList.toggle('active',i===slideIndex));dots.forEach((dot,i)=>{dot.classList.toggle('active',i===slideIndex);dot.setAttribute('aria-selected',String(i===slideIndex))})}
function startCarousel(){clearInterval(carouselTimer);carouselTimer=setInterval(()=>showSlide(slideIndex+1),5000)}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startCarousel()}));hero.addEventListener('mouseenter',()=>clearInterval(carouselTimer));hero.addEventListener('mouseleave',startCarousel);showSlide(0);startCarousel();

const solutionPlans={
  distribution:{title:'分销代发',description:'低至20元/月，功能更全面，适合全平台多店铺卖家',image:'assets/images/分销代发方案.svg',alt:'分销代发产品界面'},
  printing:{title:'打单发货',description:'低至18元/月，单平台多店铺卖家首选',image:'assets/images/打单发货方案.svg',alt:'打单发货产品界面'}
};
const solutionTabs=[...document.querySelectorAll('.solution-tabs button')],solutionTitle=document.querySelector('#solutionTitle'),solutionDescription=document.querySelector('#solutionDescription'),solutionImage=document.querySelector('#solutionImage');
function showSolutionPlan(key){const plan=solutionPlans[key];if(!plan)return;solutionTitle.textContent=plan.title;solutionDescription.textContent=plan.description;solutionImage.src=plan.image;solutionImage.alt=plan.alt;solutionTabs.forEach(tab=>{const active=tab.dataset.plan===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))})}
solutionTabs.forEach(tab=>tab.addEventListener('click',()=>showSolutionPlan(tab.dataset.plan)));
