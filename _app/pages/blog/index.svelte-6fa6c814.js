import{S as H,i as I,s as K,a as B,l as g,K as O,h as _,c as S,m as y,p as M,b as p,n as x,O as P,u as L,v as k,q as d,G as v,w as A}from"../../chunks/index-b62e0afc.js";import{n as C}from"../../chunks/info-be1d74a5.js";import{f as D}from"../../chunks/index-70edd345.js";function T(r,o,n){const a=r.slice();return a[1]=o[n],a}function G(r){let o,n,a=r[1].metadata.title+"",f,s,e,i,t,m=D(new Date(r[1].metadata.date),"MMMM d, yyyy")+"",b,w,h,u=r[1].metadata.excerpt+"",E;return{c(){o=g("h1"),n=g("a"),f=L(a),e=B(),i=g("small"),t=L("posted on "),b=L(m),w=B(),h=g("p"),E=L(u),this.h()},l(l){o=y(l,"H1",{class:!0});var c=M(o);n=y(c,"A",{href:!0,class:!0});var $=M(n);f=k($,a),$.forEach(_),c.forEach(_),e=S(l),i=y(l,"SMALL",{class:!0});var q=M(i);t=k(q,"posted on "),b=k(q,m),q.forEach(_),w=S(l),h=y(l,"P",{});var j=M(h);E=k(j,u),j.forEach(_),this.h()},h(){d(n,"href",s=`/blog/${r[1].slug}`),d(n,"class","postLink svelte-1gmgwbg"),d(o,"class","postTitle svelte-1gmgwbg"),d(i,"class","postMeta svelte-1gmgwbg")},m(l,c){p(l,o,c),v(o,n),v(n,f),p(l,e,c),p(l,i,c),v(i,t),v(i,b),p(l,w,c),p(l,h,c),v(h,E)},p(l,c){c&1&&a!==(a=l[1].metadata.title+"")&&A(f,a),c&1&&s!==(s=`/blog/${l[1].slug}`)&&d(n,"href",s),c&1&&m!==(m=D(new Date(l[1].metadata.date),"MMMM d, yyyy")+"")&&A(b,m),c&1&&u!==(u=l[1].metadata.excerpt+"")&&A(E,u)},d(l){l&&_(o),l&&_(e),l&&_(i),l&&_(w),l&&_(h)}}}function R(r){let o,n,a;document.title=o="Blog | "+C;let f=r[0],s=[];for(let e=0;e<f.length;e+=1)s[e]=G(T(r,f,e));return{c(){n=B(),a=g("article");for(let e=0;e<s.length;e+=1)s[e].c()},l(e){O('[data-svelte="svelte-gy4i6p"]',document.head).forEach(_),n=S(e),a=y(e,"ARTICLE",{});var t=M(a);for(let m=0;m<s.length;m+=1)s[m].l(t);t.forEach(_)},m(e,i){p(e,n,i),p(e,a,i);for(let t=0;t<s.length;t+=1)s[t].m(a,null)},p(e,[i]){if(i&0&&o!==(o="Blog | "+C)&&(document.title=o),i&1){f=e[0];let t;for(t=0;t<f.length;t+=1){const m=T(e,f,t);s[t]?s[t].p(m,i):(s[t]=G(m),s[t].c(),s[t].m(a,null))}for(;t<s.length;t+=1)s[t].d(1);s.length=f.length}},i:x,o:x,d(e){e&&_(n),e&&_(a),P(s,e)}}}async function Q({fetch:r,url:o}){return{props:{posts:await r(`${o.pathname}.json`).then(a=>a.json())}}}function z(r,o,n){let{posts:a}=o;return r.$$set=f=>{"posts"in f&&n(0,a=f.posts)},[a]}class U extends H{constructor(o){super(),I(this,o,z,R,K,{posts:0})}}export{U as default,Q as load};
