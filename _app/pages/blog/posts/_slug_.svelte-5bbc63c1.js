import{S as z,i as O,s as Z,e as y,c as b,b as n,g,d as r,t as M,a as E,h as j,G as m,l as Q,k as L,P as x,K as $,m as N,Q as ee,j as te,n as X}from"../../../chunks/index-b2900aaa.js";import{n as F}from"../../../chunks/info-be1d74a5.js";import{f as J}from"../../../chunks/index-70edd345.js";function V(o){let e;return{c(){e=y("link"),this.h()},l(a){e=b(a,"LINK",{rel:!0,href:!0,integrity:!0,crossorigin:!0}),this.h()},h(){n(e,"rel","stylesheet"),n(e,"href","https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"),n(e,"integrity","sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"),n(e,"crossorigin","anonymous")},m(a,l){g(a,e,l)},d(a){a&&r(e)}}}function W(o){let e,a,l;return{c(){e=y("a"),a=M("\u2190 Prev Post"),this.h()},l(t){e=b(t,"A",{href:!0,id:!0,class:!0});var i=E(e);a=j(i,"\u2190 Prev Post"),i.forEach(r),this.h()},h(){n(e,"href",l="/blog/"+o[1].slug),n(e,"id","prev-post-link"),n(e,"class","otherPostLink svelte-ceuv4b")},m(t,i){g(t,e,i),m(e,a)},p(t,i){i&2&&l!==(l="/blog/"+t[1].slug)&&n(e,"href",l)},d(t){t&&r(e)}}}function Y(o){let e,a,l;return{c(){e=y("a"),a=M("Next Post \u2192"),this.h()},l(t){e=b(t,"A",{href:!0,id:!0,class:!0});var i=E(e);a=j(i,"Next Post \u2192"),i.forEach(r),this.h()},h(){n(e,"href",l="/blog/"+o[2].slug),n(e,"id","next-post-link"),n(e,"class","otherPostLink svelte-ceuv4b")},m(t,i){g(t,e,i),m(e,a)},p(t,i){i&4&&l!==(l="/blog/"+t[2].slug)&&n(e,"href",l)},d(t){t&&r(e)}}}function le(o){let e,a,l,t,i,d,v,_=o[0].metadata.title+"",w,q,k,C,R,B=o[4]?` | last updated ${o[4]}`:"",S,U,D,K=o[0].content+"",A,p,H;document.title=a=o[0].metadata.title+" | "+F;let c=o[0].metadata.katex&&V(),u=o[1]&&W(o),f=o[2]&&Y(o);return{c(){e=y("meta"),l=y("link"),c&&c.c(),t=Q(),i=L(),d=y("article"),v=y("h1"),w=M(_),q=L(),k=y("small"),C=M("posted on "),R=M(o[3]),S=M(B),U=L(),D=new x(!1),A=L(),p=y("div"),u&&u.c(),H=L(),f&&f.c(),this.h()},l(s){const h=$('[data-svelte="svelte-km5hh4"]',document.head);e=b(h,"META",{property:!0,content:!0}),l=b(h,"LINK",{rel:!0,href:!0}),c&&c.l(h),t=Q(),h.forEach(r),i=N(s),d=b(s,"ARTICLE",{class:!0});var P=E(d);v=b(P,"H1",{id:!0,class:!0});var G=E(v);w=j(G,_),G.forEach(r),q=N(P),k=b(P,"SMALL",{id:!0,class:!0});var T=E(k);C=j(T,"posted on "),R=j(T,o[3]),S=j(T,B),T.forEach(r),U=N(P),D=ee(P,!1),P.forEach(r),A=N(s),p=b(s,"DIV",{id:!0,class:!0});var I=E(p);u&&u.l(I),H=N(I),f&&f.l(I),I.forEach(r),this.h()},h(){n(e,"property","og:type"),n(e,"content","article"),n(l,"rel","stylesheet"),n(l,"href","//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/night-owl.min.css"),n(v,"id","post-title"),n(v,"class","svelte-ceuv4b"),n(k,"id","post-meta"),n(k,"class","svelte-ceuv4b"),D.a=null,n(d,"class","svelte-ceuv4b"),n(p,"id","other-post-links"),n(p,"class","svelte-ceuv4b")},m(s,h){m(document.head,e),m(document.head,l),c&&c.m(document.head,null),m(document.head,t),g(s,i,h),g(s,d,h),m(d,v),m(v,w),m(d,q),m(d,k),m(k,C),m(k,R),m(k,S),m(d,U),D.m(K,d),g(s,A,h),g(s,p,h),u&&u.m(p,null),m(p,H),f&&f.m(p,null)},p(s,[h]){h&1&&a!==(a=s[0].metadata.title+" | "+F)&&(document.title=a),s[0].metadata.katex?c||(c=V(),c.c(),c.m(t.parentNode,t)):c&&(c.d(1),c=null),h&1&&_!==(_=s[0].metadata.title+"")&&te(w,_),h&1&&K!==(K=s[0].content+"")&&D.p(K),s[1]?u?u.p(s,h):(u=W(s),u.c(),u.m(p,H)):u&&(u.d(1),u=null),s[2]?f?f.p(s,h):(f=Y(s),f.c(),f.m(p,null)):f&&(f.d(1),f=null)},i:X,o:X,d(s){r(e),r(l),c&&c.d(s),r(t),s&&r(i),s&&r(d),s&&r(A),s&&r(p),u&&u.d(),f&&f.d()}}}async function oe({params:o,fetch:e}){const{slug:a}=o,{post:l,previous:t,next:i}=await e(`/blog/posts/${a}.json`).then(d=>d.json());return{props:{post:l,previous:t,next:i}}}function se(o,e,a){let{post:l,previous:t,next:i}=e;const d=J(new Date(l.metadata.date),"MMMM d, yyyy"),v=l.metadata.updated?J(new Date(l.metadata.updated),"MMMM d, yyyy"):void 0;return o.$$set=_=>{"post"in _&&a(0,l=_.post),"previous"in _&&a(1,t=_.previous),"next"in _&&a(2,i=_.next)},[l,t,i,d,v]}class re extends z{constructor(e){super(),O(this,e,se,le,Z,{post:0,previous:1,next:2})}}export{re as default,oe as load};
