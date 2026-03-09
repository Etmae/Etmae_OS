import{R as d,r as m,j as o}from"./index-BlIH_K9_.js";var O={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},x=d.createContext&&d.createContext(O),T=["attr","size","title"];function R(e,t){if(e==null)return{};var r=E(e,t),n,l;if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(l=0;l<c.length;l++)n=c[l],!(t.indexOf(n)>=0)&&Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function E(e,t){if(e==null)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}function b(){return b=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},b.apply(this,arguments)}function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(l){return Object.getOwnPropertyDescriptor(e,l).enumerable})),r.push.apply(r,n)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?y(Object(r),!0).forEach(function(n){I(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function I(e,t,r){return t=L(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function L(e){var t=k(e,"string");return typeof t=="symbol"?t:t+""}function k(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function C(e){return e&&e.map((t,r)=>d.createElement(t.tag,v({key:r},t.attr),C(t.child)))}function g(e){return t=>d.createElement(z,b({attr:v({},e.attr)},t),C(e.child))}function z(e){var t=r=>{var{attr:n,size:l,title:c}=e,f=R(e,T),p=l||r.size||"1em",a;return r.className&&(a=r.className),e.className&&(a=(a?a+" ":"")+e.className),d.createElement("svg",b({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,n,f,{className:a,style:v(v({color:e.color||r.color},r.style),e.style),height:p,width:p,xmlns:"http://www.w3.org/2000/svg"}),c&&d.createElement("title",null,c),e.children)};return x!==void 0?d.createElement(x.Consumer,null,r=>t(r)):t(O)}function A(e){return g({attr:{viewBox:"0 0 16 16",fill:"currentColor"},child:[{tag:"path",attr:{d:"M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"},child:[]}]})(e)}function M(e){return g({attr:{viewBox:"0 0 16 16",fill:"currentColor"},child:[{tag:"path",attr:{fillRule:"evenodd",clipRule:"evenodd",d:"M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"},child:[]}]})(e)}function D(e){return g({attr:{viewBox:"0 0 16 16",fill:"currentColor"},child:[{tag:"path",attr:{fillRule:"evenodd",clipRule:"evenodd",d:"M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"},child:[]}]})(e)}const w={path:"C:\\Users\\Guest"},j={help:`
  AVAILABLE COMMANDS:
    ls skillset    - List technical proficiencies
    whereis live   - Current location and availability
    whoami         - Professional bio
    contact        - Social and email links
    neofetch       - Display system information
    clear          - Clear the terminal screen
    exit           - Close the terminal
    `,"ls skillset":`
  [Frontend]      React, TypeScript, Next.js, Tailwind
  [Backend]       Node.js, PostgreSQL, Docker, GraphQL
  [Mobile]        React Native
  [Tools]         Git, AWS, Vitest, CI/CD
    `,"whereis live":`
  LOCATION:       New York, NY (Remote-First)
  RELOCATION:     Available for specific opportunities.
    `,whoami:`
  I am a Full-Stack Engineer dedicated to building high-fidelity 
  user interfaces and robust system architectures. I specialize 
  in turning complex requirements into elegant, maintainable code.
    `,contact:`
  GitHub:         github.com/yourhandle
  LinkedIn:       linkedin.com/in/yourhandle
  Email:          dev@example.com
    `,neofetch:`
     .-.      OS: Portfolio Windows 11 Pro
    oo|       Host: Gemini-Flash-Runtime
    /\`      Kernel: React 18.2.0
   (_;/)     Uptime: 15 mins
              Packages: 42 (npm)
              Shell: cmd.exe
              Resolution: 1920x1080
              UI: Tailwind CSS
    `},V=()=>{const[e,t]=m.useState([{id:"1",title:"Command Prompt",history:["Microsoft Windows [Version 10.0.22621.2428]","(c) Microsoft Corporation. All rights reserved.","",'Type "help" to see available commands.']}]),[r,n]=m.useState("1"),[l,c]=m.useState(""),f=m.useRef(null),p=m.useRef(null),a=e.find(i=>i.id===r)||e[0];m.useEffect(()=>{f.current&&(f.current.scrollTop=f.current.scrollHeight)},[a.history]);const N=i=>{i.preventDefault();const s=l.trim().toLowerCase();if(!s)return;let u=[...a.history,`${w.path}> ${l}`];s==="clear"?u=[]:j[s]?u.push(j[s]):u.push(`'${s}' is not recognized as an internal or external command.`),t(e.map(h=>h.id===r?{...h,history:u}:h)),c("")},P=()=>{const i=Math.random().toString(36).substr(2,9);t([...e,{id:i,title:`Command Prompt (${e.length+1})`,history:["Microsoft Windows [Version 10.0.22621.2428]","",'Type "help" to start.']}]),n(i)},S=(i,s)=>{if(s.stopPropagation(),e.length===1)return;const u=e.filter(h=>h.id!==i);t(u),r===i&&n(u[0].id)};return o.jsxs("div",{className:"flex flex-col h-full w-full bg-[#0c0c0ce6] backdrop-blur-xl text-[#cccccc] font-['Cascadia_Code',_monospace] text-sm overflow-hidden shadow-2xl",children:[o.jsxs("div",{className:"flex items-center bg-[#1e1e1e] px-2 pt-1 h-10 select-none",children:[e.map(i=>o.jsxs("div",{onClick:()=>n(i.id),className:`group relative flex items-center h-full px-4 min-w-[120px] max-w-[200px] rounded-t-lg transition-colors cursor-default border-b-2 ${r===i.id?"bg-[#0c0c0c] border-[#60cdff] text-white":"hover:bg-[#2b2b2b] border-transparent text-gray-400"}`,children:[o.jsx("span",{className:"truncate text-xs",children:i.title}),o.jsx("button",{onClick:s=>S(i.id,s),className:"ml-auto p-0.5 rounded-md hover:bg-[#ffffff20] opacity-0 group-hover:opacity-100 transition-opacity",children:o.jsx(D,{size:14})})]},i.id)),o.jsx("button",{onClick:P,className:"p-2 ml-1 text-gray-400 hover:bg-[#ffffff10] rounded-md transition-colors",children:o.jsx(A,{size:16})}),o.jsx("button",{className:"p-2 text-gray-400 hover:bg-[#ffffff10] rounded-md",children:o.jsx(M,{size:16})})]}),o.jsxs("div",{className:"flex-1 p-3 overflow-y-auto custom-scrollbar scroll-smooth",ref:f,onClick:()=>p.current?.focus(),children:[o.jsx("div",{className:"whitespace-pre-wrap mb-2",children:a.history.join(`
`)}),o.jsxs("form",{onSubmit:N,className:"flex items-center",children:[o.jsxs("span",{className:"text-[#60cdff] mr-2 shrink-0",children:[w.path,">"]}),o.jsx("input",{ref:p,type:"text",autoFocus:!0,spellCheck:!1,value:l,onChange:i=>c(i.target.value),className:"bg-transparent border-none outline-none flex-1 text-white caret-[#60cdff]"})]})]})]})};export{V as T};
