import{$ as b,a as ne,g as oe,b as ve,c as U,d as Se,e as le,o as me,f as we,h as Ae,i as m,j as P,k as $,l as T,r as M,m as Oe,t as w,F as Ce,S as W,u as ke,n as j}from"./web.3f745c1b.js";const X=Symbol("store-raw"),L=Symbol("store-node");function re(e){let t=e[b];if(!t&&(Object.defineProperty(e,b,{value:t=new Proxy(e,Te)}),!Array.isArray(e))){const n=Object.keys(e),l=Object.getOwnPropertyDescriptors(e);for(let i=0,o=n.length;i<o;i++){const r=n[i];l[r].get&&Object.defineProperty(e,r,{enumerable:l[r].enumerable,get:l[r].get.bind(t)})}}return t}function q(e){let t;return e!=null&&typeof e=="object"&&(e[b]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function D(e,t=new Set){let n,l,i,o;if(n=e!=null&&e[X])return n;if(!q(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let r=0,f=e.length;r<f;r++)i=e[r],(l=D(i,t))!==i&&(e[r]=l)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const r=Object.keys(e),f=Object.getOwnPropertyDescriptors(e);for(let c=0,A=r.length;c<A;c++)o=r[c],!f[o].get&&(i=e[o],(l=D(i,t))!==i&&(e[o]=l))}return e}function G(e){let t=e[L];return t||Object.defineProperty(e,L,{value:t=Object.create(null)}),t}function Y(e,t,n){return e[t]||(e[t]=ce(n))}function xe(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===b||t===L||(delete n.value,delete n.writable,n.get=()=>e[b][t]),n}function se(e){if(oe()){const t=G(e);(t._||(t._=ce()))()}}function Pe(e){return se(e),Reflect.ownKeys(e)}function ce(e){const[t,n]=U(e,{equals:!1,internal:!0});return t.$=n,t}const Te={get(e,t,n){if(t===X)return e;if(t===b)return n;if(t===ne)return se(e),n;const l=G(e),i=l[t];let o=i?i():e[t];if(t===L||t==="__proto__")return o;if(!i){const r=Object.getOwnPropertyDescriptor(e,t);oe()&&(typeof o!="function"||e.hasOwnProperty(t))&&!(r&&r.get)&&(o=Y(l,t,o)())}return q(o)?re(o):o},has(e,t){return t===X||t===b||t===ne||t===L||t==="__proto__"?!0:(this.get(e,t,e),t in e)},set(){return!0},deleteProperty(){return!0},ownKeys:Pe,getOwnPropertyDescriptor:xe};function z(e,t,n,l=!1){if(!l&&e[t]===n)return;const i=e[t],o=e.length;n===void 0?delete e[t]:e[t]=n;let r=G(e),f;if((f=Y(r,t,i))&&f.$(()=>n),Array.isArray(e)&&e.length!==o){for(let c=e.length;c<o;c++)(f=r[c])&&f.$();(f=Y(r,"length",o))&&f.$(e.length)}(f=r._)&&f.$()}function ae(e,t){const n=Object.keys(t);for(let l=0;l<n.length;l+=1){const i=n[l];z(e,i,t[i])}}function je(e,t){if(typeof t=="function"&&(t=t(e)),t=D(t),Array.isArray(t)){if(e===t)return;let n=0,l=t.length;for(;n<l;n++){const i=t[n];e[n]!==i&&z(e,n,i)}z(e,"length",l)}else ae(e,t)}function E(e,t,n=[]){let l,i=e;if(t.length>1){l=t.shift();const r=typeof l,f=Array.isArray(e);if(Array.isArray(l)){for(let c=0;c<l.length;c++)E(e,[l[c]].concat(t),n);return}else if(f&&r==="function"){for(let c=0;c<e.length;c++)l(e[c],c)&&E(e,[c].concat(t),n);return}else if(f&&r==="object"){const{from:c=0,to:A=e.length-1,by:H=1}=l;for(let O=c;O<=A;O+=H)E(e,[O].concat(t),n);return}else if(t.length>1){E(e[l],t,[l].concat(n));return}i=e[l],n=[l].concat(n)}let o=t[0];typeof o=="function"&&(o=o(i,n),o===i)||l===void 0&&o==null||(o=D(o),l===void 0||q(i)&&q(o)&&!Array.isArray(o)?ae(i,o):z(e,l,o))}function Ee(...[e,t]){const n=D(e||{}),l=Array.isArray(n),i=re(n);function o(...r){ve(()=>{l&&r.length===1?je(n,r[0]):E(n,r)})}return[i,o]}const Le=w('<section class="main"><input id="toggle-all" class="toggle-all" type="checkbox"><label for="toggle-all">Mark all as complete</label><ul class="todo-list">'),De=w('<button class="clear-completed">Clear completed'),Ne=w('<footer class="footer"><span class="todo-count"><strong></strong><span> item<!#><!/> left</span></span><ul class="filters"><li><a href="#/all">All</a></li><li><a href="#/active">Active</a></li><li><a href="#/completed">Completed</a></li></ul><!#><!/>'),Fe=w('<section class="todoapp"><header class="header"><h1>todos</h1><input class="new-todo" autofocus placeholder="What needs to be done?"></header><!#><!/><!#><!/>'),Ie=w('<input class="edit" type="text">'),Ke=w('<li class="todo"><div class="view"><input class="toggle" type="checkbox"><label></label><button class="destroy"></button></div><!#><!/>'),ie="todomvc";function Me(){const[e,t]=Ee(JSON.parse(localStorage.getItem(ie)??"[]")),[n,l]=U(),[i,o]=U("all"),r=le(()=>e.filter(s=>!s.completed).length),f=le(()=>{const s=i();return s==="all"?[...e]:s==="completed"?e.filter(a=>a.completed):s==="active"?e.filter(a=>!a.completed):[]});return me(()=>globalThis.addEventListener("hashchange",Q)),we(()=>globalThis.removeEventListener("hashchange",Q)),Ae(()=>localStorage.setItem(ie,JSON.stringify(e))),(()=>{const s=m(Fe),a=s.firstChild,d=a.firstChild,C=d.nextSibling,ge=a.nextSibling,[V,he]=P(ge.nextSibling),$e=V.nextSibling,[_e,be]=P($e.nextSibling);return C.$$keyup=c,$(s,T(W,{get when(){return f().length},get children(){const p=m(Le),y=p.firstChild,N=y.nextSibling,F=N.nextSibling;return y.addEventListener("change",A),$(F,T(Ce,{get each(){return f()},children:g=>(()=>{const _=m(Ke),k=_.firstChild,x=k.firstChild,v=x.nextSibling,I=v.nextSibling,J=k.nextSibling,[K,B]=P(J.nextSibling);return x.addEventListener("change",()=>H(g.id)),v.$$dblclick=()=>l(g.id),$(v,()=>g.title),I.$$click=()=>O(g.id),$(_,T(W,{get when(){return n()===g.id},get children(){const u=m(Ie);return ke(S=>Promise.resolve().then(()=>S.focus()),u),u.$$keyup=de,u.addEventListener("blur",fe),j(()=>u.value=g.title),M(),u}}),K,B),j(u=>{const S=!!g.completed,R=n()===g.id;return S!==u._v$4&&_.classList.toggle("completed",u._v$4=S),R!==u._v$5&&_.classList.toggle("editing",u._v$5=R),u},{_v$4:void 0,_v$5:void 0}),j(()=>x.checked=g.completed),M(),_})()})),j(()=>y.checked=r()===0),p}}),V,he),$(s,T(W,{get when(){return e.length},get children(){const p=m(Ne),y=p.firstChild,N=y.firstChild,F=N.nextSibling,g=F.firstChild,_=g.nextSibling,[k,x]=P(_.nextSibling);k.nextSibling;const v=y.nextSibling,I=v.firstChild,J=I.firstChild,K=I.nextSibling,B=K.firstChild,u=K.nextSibling,S=u.firstChild,R=v.nextSibling,[pe,ye]=P(R.nextSibling);return $(N,r),$(F,()=>r()>1&&"s",k,x),$(p,T(W,{get when(){return r()<e.length},get children(){const h=m(De);return h.$$click=ue,M(),h}}),pe,ye),j(h=>{const Z=i()==="all",ee=i()==="active",te=i()==="completed";return Z!==h._v$&&J.classList.toggle("selected",h._v$=Z),ee!==h._v$2&&B.classList.toggle("selected",h._v$2=ee),te!==h._v$3&&S.classList.toggle("selected",h._v$3=te),h},{_v$:void 0,_v$2:void 0,_v$3:void 0}),p}}),_e,be),M(),s})();function c({key:s,target:a}){if(s.toLowerCase()!=="enter"||!a)return;const d=a;d.value&&(t([...e,{id:Oe(),title:d.value,completed:!1}]),d.value="")}function A(){t({from:0,to:e.length-1},"completed",r()!==0)}function H(s){t(e.findIndex(a=>a.id===s),a=>({...a,completed:!a.completed}))}function O(s){t(e.filter(a=>a.id!==s))}function fe({target:s}){const a=s,d=e.findIndex(C=>C.id===n());d!==-1&&(t(d,"title",a.value),l())}function de({key:s,target:a}){const d=a;if(s.toLowerCase()==="enter"){d.blur();return}if(s.toLowerCase()==="escape"){d.value=e.find(C=>C.id===n())?.title??d.value,d.blur();return}}function ue(){t(e.filter(s=>!s.completed))}function Q(){const s=globalThis.location.hash.replace(/#\/?/,"");if(s==="all"||s==="active"||s==="completed"){o(s);return}globalThis.location.hash="",o("all")}}Se(["keyup","click","dblclick"]);export{Me as default};
