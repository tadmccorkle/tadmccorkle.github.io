import{s as M,n as x}from"../chunks/scheduler.YAOc3RFa.js";import{S as N,i as O,e as d,s as k,o as C,a as p,g as q,c as j,k as v,d as _,n as R,t as P,b as g,f as S,j as b,l as u,m as E}from"../chunks/index.nt5O7gKd.js";import{e as z}from"../chunks/each.-oqiv04n.js";function T(){return{projects:[{name:"markdown.nvim",description:"Configurable tools for working with Markdown files in Neovim.",url:"https://github.com/tadmccorkle/markdown.nvim"},{name:"hrl",description:"A simple Rust libary to hot reload functions and static symbols.",url:"https://github.com/tadmccorkle/hrl"}]}}const J=Object.freeze(Object.defineProperty({__proto__:null,load:T},Symbol.toStringTag,{value:"Module"}));function A(i,t,r){const n=i.slice();return n[1]=t[r],n}function H(i){let t,r,n=i[1].name+"",s,h,a,e=i[1].description+"",o,l,m;return{c(){t=d("a"),r=d("h2"),s=P(n),h=k(),a=d("p"),o=P(e),l=k(),this.h()},l(f){t=p(f,"A",{href:!0,class:!0});var c=g(t);r=p(c,"H2",{});var y=g(r);s=S(y,n),y.forEach(_),h=j(c),a=p(c,"P",{});var w=g(a);o=S(w,e),w.forEach(_),l=j(c),c.forEach(_),this.h()},h(){b(t,"href",m=i[1].url),b(t,"class","project svelte-168s1xz")},m(f,c){v(f,t,c),u(t,r),u(r,s),u(t,h),u(t,a),u(a,o),u(t,l)},p(f,c){c&1&&n!==(n=f[1].name+"")&&E(s,n),c&1&&e!==(e=f[1].description+"")&&E(o,e),c&1&&m!==(m=f[1].url)&&b(t,"href",m)},d(f){f&&_(t)}}}function B(i){let t,r="Projects",n,s,h=z(i[0].projects),a=[];for(let e=0;e<h.length;e+=1)a[e]=H(A(i,h,e));return{c(){t=d("h1"),t.textContent=r,n=k();for(let e=0;e<a.length;e+=1)a[e].c();s=C()},l(e){t=p(e,"H1",{"data-svelte-h":!0}),q(t)!=="svelte-136d6se"&&(t.textContent=r),n=j(e);for(let o=0;o<a.length;o+=1)a[o].l(e);s=C()},m(e,o){v(e,t,o),v(e,n,o);for(let l=0;l<a.length;l+=1)a[l]&&a[l].m(e,o);v(e,s,o)},p(e,[o]){if(o&1){h=z(e[0].projects);let l;for(l=0;l<h.length;l+=1){const m=A(e,h,l);a[l]?a[l].p(m,o):(a[l]=H(m),a[l].c(),a[l].m(s.parentNode,s))}for(;l<a.length;l+=1)a[l].d(1);a.length=h.length}},i:x,o:x,d(e){e&&(_(t),_(n),_(s)),R(a,e)}}}function D(i,t,r){let{data:n}=t;return i.$$set=s=>{"data"in s&&r(0,n=s.data)},[n]}class K extends N{constructor(t){super(),O(this,t,D,B,M,{data:0})}}export{K as component,J as universal};
