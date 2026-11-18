const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.join(__dirname, '../dist');
const events = {}, windowEvents = {}, popupEvents = {};
const background = {};
const popup = { style: {}, dataset: {}, attrs: {}, offsetWidth: 334, offsetHeight: 192, setAttribute(k,v) { this.attrs[k]=v; }, addEventListener(k,v) { popupEvents[k]=v; }, querySelector: () => background, focus() { this.focused = true; }, contains: n => n === popup };
const viewport = { clientWidth: 1200 };
const window = { innerHeight: 800, addEventListener(k,v) { windowEvents[k]=v; } };
const document = { createElement: () => popup, body: { append() {} }, documentElement: viewport, addEventListener(k,v) { events[k]=v; } };
vm.runInNewContext(fs.readFileSync(path.join(dist,'platform-consult.js'),'utf8'), { window, document });
let rect;
const card = { isConnected: true, getBoundingClientRect: () => rect };
const trigger = { isConnected: true, dataset: { platformConsult: '爱库存' }, attrs: {}, closest: () => card, setAttribute(k,v) { this.attrs[k]=v; }, contains: n => n === trigger, focus() { this.focused = true; } };
const open = r => { window.DGJPlatformConsult.close(); rect=r; window.DGJPlatformConsult.open(trigger, { anchor: card, label: '爱库存商家内测咨询' }); };
for (const [side,r] of [
  ['right',{left:20,right:200,top:250,bottom:330}],
  ['left',{left:1000,right:1180,top:250,bottom:330}],
  ['bottom',{left:480,right:720,top:20,bottom:100}],
  ['top',{left:480,right:720,top:700,bottom:780}]
]) {
  // Narrow the horizontal space for top/bottom candidates.
  viewport.clientWidth = side==='top'||side==='bottom' ? 800 : 1200;
  if (viewport.clientWidth === 800) { r.left=300; r.right=500; }
  open(r);
  assert.equal(popup.dataset.side, side);
  assert.equal(popup.hidden, false);
  assert.equal(trigger.attrs['aria-expanded'],'true');
  const x=parseFloat(popup.style.left), y=parseFloat(popup.style.top);
  assert.ok(x>=12 && x+popup.offsetWidth<=viewport.clientWidth-12);
  assert.ok(y>=12 && y+popup.offsetHeight<=window.innerHeight-12);
  assert.equal(background.src,`assets/platform-consult/${side}.svg`);
}
events.keydown({key:'Escape',preventDefault(){}});
assert.equal(popup.hidden,true); assert.equal(trigger.focused,true);
viewport.clientWidth=320; popup.offsetWidth=296; popup.offsetHeight=168;
open({left:12,right:150,top:300,bottom:380});
assert.equal(parseFloat(popup.style.left),12);
rect={left:12,right:150,top:100,bottom:180}; windowEvents.scroll();
assert.equal(popup.hidden,false);
windowEvents.resize(); assert.ok(parseFloat(popup.style.top)>=12);
rect={left:12,right:150,top:-200,bottom:-100}; windowEvents.scroll();
assert.equal(popup.hidden,true);
open({left:12,right:150,top:100,bottom:180});
events.pointerdown({target:{}}); assert.equal(popup.hidden,true);
open({left:12,right:150,top:100,bottom:180});
window.DGJPlatformConsult.open(trigger); assert.equal(popup.hidden,true);
open({left:12,right:150,top:100,bottom:180});
windowEvents.blur(); assert.equal(popup.hidden,true);
open({left:12,right:150,top:100,bottom:180});
popupEvents.focusout({relatedTarget:{}}); assert.equal(popup.hidden,true);
const button = { ...trigger, dataset: { consult: '合作咨询' }, getBoundingClientRect: () => rect };
events.click({ target: { closest: () => button }, preventDefault() {} });
assert.equal(popup.hidden, false);
assert.equal(popup.attrs['aria-label'], '合作咨询');
window.DGJPlatformConsult.close();
window.DGJPlatformConsult.open(button);
assert.equal(popup.hidden, false);
assert.equal(popup.attrs['aria-label'], '客服咨询');
window.DGJPlatformConsult.close();
for (const [,file] of popup.innerHTML.matchAll(/src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(dist,file.split('?')[0])));
assert.ok(popup.innerHTML.includes('tel:4008638288'));
assert.ok(popup.innerHTML.includes('tel:18603065384'));
assert.ok(popup.innerHTML.includes('target="_blank" rel="noopener noreferrer"'));
for (const file of ['index.html','products.html','open-platform.html']) {
  const html=fs.readFileSync(path.join(dist,file),'utf8');
  assert.ok(html.includes('platform-consult.css?'));
  assert.ok(html.indexOf('platform-consult.js?')<html.indexOf('platform-cards.js?'));
}
console.log('Independent consultation popup: four directions, small-screen clamping, scroll/resize tracking, dismissal, focus return and local assets verified.');
