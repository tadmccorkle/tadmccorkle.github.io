import{s as K,n as q}from"../chunks/scheduler.YAOc3RFa.js";import{S as P,i as V,e as _,o as x,s as A,t as g,H as W,h as z,a as y,d,c as H,b as I,f as M,p as F,j as a,l as i,k as L}from"../chunks/index.nt5O7gKd.js";import{n as C}from"../chunks/info.pcb27WML.js";import{f as G}from"../chunks/format.Zf9-QFbZ.js";function U(s){let t;return{c(){t=_("link"),this.h()},l(l){t=y(l,"LINK",{rel:!0,href:!0,integrity:!0,crossorigin:!0}),this.h()},h(){a(t,"rel","stylesheet"),a(t,"href","https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"),a(t,"integrity","sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"),a(t,"crossorigin","anonymous")},m(l,n){L(l,t,n)},d(l){l&&d(t)}}}function X(s){let t,l,n,c,f,e,r,T=s[0].metadata.title+"",b,E,m,D,S,N=s[2]?` | last updated ${s[2]}`:"",j,w,v,J=s[0].content+"";document.title=l=s[0].metadata.title+" | "+C;let u=s[0].metadata.katex&&U();return{c(){t=_("meta"),n=_("link"),u&&u.c(),c=x(),f=A(),e=_("article"),r=_("h1"),b=g(T),E=A(),m=_("small"),D=g("posted on "),S=g(s[1]),j=g(N),w=A(),v=new W(!1),this.h()},l(o){const h=z("svelte-8dgaa3",document.head);t=y(h,"META",{property:!0,content:!0}),n=y(h,"LINK",{rel:!0,href:!0}),u&&u.l(h),c=x(),h.forEach(d),f=H(o),e=y(o,"ARTICLE",{class:!0});var p=I(e);r=y(p,"H1",{id:!0,class:!0});var R=I(r);b=M(R,T),R.forEach(d),E=H(p),m=y(p,"SMALL",{id:!0,class:!0});var k=I(m);D=M(k,"posted on "),S=M(k,s[1]),j=M(k,N),k.forEach(d),w=H(p),v=F(p,!1),p.forEach(d),this.h()},h(){a(t,"property","og:type"),a(t,"content","article"),a(n,"rel","stylesheet"),a(n,"href","https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"),a(r,"id","post-title"),a(r,"class","svelte-1vf4bp2"),a(m,"id","post-meta"),a(m,"class","svelte-1vf4bp2"),v.a=null,a(e,"class","svelte-1vf4bp2")},m(o,h){i(document.head,t),i(document.head,n),u&&u.m(document.head,null),i(document.head,c),L(o,f,h),L(o,e,h),i(e,r),i(r,b),i(e,E),i(e,m),i(m,D),i(m,S),i(m,j),i(e,w),v.m(J,e)},p(o,[h]){h&1&&l!==(l=o[0].metadata.title+" | "+C)&&(document.title=l)},i:q,o:q,d(o){o&&(d(f),d(e)),d(t),d(n),u&&u.d(o),d(c)}}}function $(s,t,l){let{data:n}=t;const{post:c}=n,f=G(new Date(c.metadata.date),"MMMM d, yyyy"),e=c.metadata.updated?G(new Date(c.metadata.updated),"MMMM d, yyyy"):void 0;return s.$$set=r=>{"data"in r&&l(3,n=r.data)},[c,f,e,n]}class Z extends P{constructor(t){super(),V(this,t,$,X,K,{data:3})}}export{Z as component};
