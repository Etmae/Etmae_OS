// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import type { Variants } from 'framer-motion';

// export interface StaggeredMenuItem {
//   label: string;
//   ariaLabel: string;
//   link: string;
// }

// export interface StaggeredMenuSocialItem {
//   label: string;
//   link: string;
//   icon?: React.ReactNode;
// }

// export interface StaggeredMenuProps {
//   position?: 'left' | 'right';
//   colors?: string[]; // Array of colors for the pre-layers
//   items?: StaggeredMenuItem[];
//   socialItems?: StaggeredMenuSocialItem[];
//   displaySocials?: boolean;
//   displayItemNumbering?: boolean;
//   className?: string;
//   logoUrl?: string;
//   menuButtonColor?: string;
//   openMenuButtonColor?: string;
//   accentColor?: string;
//   isFixed: boolean;
//   changeMenuColorOnOpen?: boolean;
//   closeOnClickAway?: boolean;
//   hideInternalLogo?: boolean;
//   onMenuOpen?: () => void;
//   onMenuClose?: () => void;
// }

// export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
//   position = 'right',
//   colors = ['#B19EEF', '#5227FF'], 
//   items = [],
//   socialItems = [],
//   displaySocials = true,
//   displayItemNumbering = true,
//   className = '',
//   logoUrl,
//   menuButtonColor = '#000',
//   openMenuButtonColor = '#000',
//   changeMenuColorOnOpen = true,
//   accentColor = '#5227FF',
//   isFixed = false,
//   closeOnClickAway = true,
//   hideInternalLogo = false,
//   onMenuOpen,
//   onMenuClose
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const panelRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   const toggleMenu = () => {
//     const newState = !isOpen;
//     setIsOpen(newState);
//     if (newState) {
//       onMenuOpen?.();
//     } else {
//       onMenuClose?.();
//     }
//   };

//   const closeMenu = () => {
//     if (isOpen) {
//       setIsOpen(false);
//       onMenuClose?.();
//     }
//   };

//   useEffect(() => {
//     if (!closeOnClickAway || !isOpen) return;
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         panelRef.current &&
//         !panelRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         closeMenu();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [closeOnClickAway, isOpen]);

//   // Animation Variants
//   const layerVariants: Variants = {
//     closed: { x: position === 'right' ? '101%' : '-101%' },
//     open: (i: number) => ({
//       x: 0,
//       transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: i * 0.08 }
//     }),
//     exit: (i: number) => ({
//       x: position === 'right' ? '101%' : '-101%',
//       transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 }
//     })
//   };

//   const panelVariants: Variants = {
//     closed: { x: position === 'right' ? '101%' : '-101%' },
//     open: {
//       x: 0,
//       transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.15 }
//     },
//     exit: {
//       x: position === 'right' ? '101%' : '-101%',
//       transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
//     }
//   };

//   const listVariants: Variants = {
//     open: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
//     closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
//   };

//   const itemVariants: Variants = {
//     closed: { y: 100, opacity: 0, rotate: 5, transition: { duration: 0.4 } },
//     open: { y: 0, opacity: 1, rotate: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }
//   };

//   const socialVariants: Variants = {
//     closed: { y: 20, opacity: 0 },
//     open: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
//   };

//   const layerColors = colors && colors.length ? colors : ['#B19EEF'];

//   return (
//     <div className={`sm-scope relative w-full h-full ${isFixed ? 'fixed inset-0 z-100' : 'z-40'}`}>
//       <div 
//         className={`${className} staggered-menu-wrapper relative w-full h-full pointer-events-none`}
//         style={{ '--sm-accent': accentColor } as React.CSSProperties}
//       >
        
//         {/* === Global Header (Logo + Toggle) === */}
//         <div className={`sm-header-container flex items-center justify-between px-8 md:px-12 h-24 md:h-32 absolute top-0 left-0 w-full z-150 pointer-events-none`}>
          
//           {/* Main Logo Container */}
//           <div className="sm-logo pointer-events-auto h-12 md:h-16 flex items-center">
//             {logoUrl && (
//               <img 
//                 src={logoUrl} 
//                 alt="Logo" 
//                 className={`h-full w-auto object-contain transition-opacity duration-500 ${isOpen && hideInternalLogo ? 'opacity-0' : 'opacity-100'}`} 
//               />
//             )}
//           </div>

//           <button
//             ref={buttonRef}
//             onClick={toggleMenu}
//             className="sm-toggle pointer-events-auto group relative flex items-center gap-4 bg-transparent border-0 cursor-pointer font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs h-full"
//             style={{ color: isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor }}
//           >
//             <div className="relative h-[1.2em] overflow-hidden">
//                <motion.div 
//                  initial={false}
//                  animate={{ y: isOpen ? '-100%' : '0%' }}
//                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
//                  className="flex flex-col"
//                >
//                  <span className="block h-[1.2em]">Menu</span>
//                  <span className="block h-[1.2em]">Close</span>
//                </motion.div>
//             </div>

//             <div className="relative w-6 h-6 flex flex-col justify-center items-center">
//                <motion.span 
//                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 1 : -3 }}
//                  className="absolute w-6 h-[1.5px] bg-current rounded-full"
//                />
//                <motion.span 
//                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 1 : 3 }}
//                  className="absolute w-6 h-[1.5px] bg-current rounded-full"
//                />
//             </div>
//           </button>
//         </div>

//         {/* === Backdrop === */}
//         <AnimatePresence>
//           {isOpen && isFixed && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeMenu}
//               className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto z-105"
//             />
//           )}
//         </AnimatePresence>

//         {/* === Menu Content === */}
//         <AnimatePresence>
//           {isOpen && (
//             <>
//               {/* Layers */}
//               <div className="fixed inset-0 pointer-events-none z-110">
//                 {layerColors.map((color, i) => (
//                   <motion.div
//                     key={i}
//                     custom={i}
//                     variants={layerVariants}
//                     initial="closed"
//                     animate="open"
//                     exit="exit"
//                     className="absolute top-0 right-0 h-full w-full md:w-[550px]"
//                     style={{ backgroundColor: color, zIndex: i }}
//                   />
//                 ))}
//               </div>

//               {/* Main Panel */}
//               <motion.aside
//                 ref={panelRef}
//                 variants={panelVariants}
//                 initial="closed"
//                 animate="open"
//                 exit="exit"
//                 className="staggered-menu-panel fixed top-0 right-0 h-full w-full md:w-[550px] bg-white flex flex-col px-10 md:px-16 pb-12 pt-40 overflow-y-auto pointer-events-auto z-120"
//               >
//                  <div className="flex-1 flex flex-col">
//                     <motion.ul 
//                       variants={listVariants}
//                       initial="closed"
//                       animate="open"
//                       exit="closed"
//                       className="sm-panel-list flex flex-col gap-6 md:gap-8"
//                       data-numbering={displayItemNumbering}
//                     >
//                       {items.map((item, idx) => (
//                         <li key={idx} className="relative block">
//                            <motion.div variants={itemVariants}>
//                              <a 
//                                href={item.link} 
//                                onClick={closeMenu}
//                                className="sm-panel-item inline-block text-5xl md:text-7xl font-black uppercase tracking-tighter text-black hover:text-(--sm-accent) transition-colors pr-14 relative"
//                              >
//                                {item.label}
//                              </a>
//                            </motion.div>
//                         </li>
//                       ))}
//                     </motion.ul>

//                     {/* Socials Section */}
//                     {displaySocials && socialItems.length > 0 && (
//                       <div className="mt-auto pt-20">
//                         <motion.p 
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 mb-8"
//                         >
//                           Socials
//                         </motion.p>
//                         <motion.ul 
//                           className="flex flex-wrap gap-x-10 gap-y-6"
//                           initial="closed"
//                           animate="open"
//                           transition={{ staggerChildren: 0.1, delayChildren: 0.7 }}
//                         >
//                           {socialItems.map((social, idx) => (
//                             <motion.li key={idx} variants={socialVariants}>
//                               <a 
//                                 href={social.link} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="flex items-center gap-3 text-white hover:text-(--sm-accent) transition-all group"
//                               >
//                                 {social.icon && (
//                                   <span className="flex items-center justify-center w-5 h-5 opacity-100 fill-current text-black group-hover:text-(--sm-accent)">
//                                     {social.icon}
//                                   </span>
//                                 )}
//                                 <span className="uppercase font-bold tracking-widest text-[10px]">{social.label}</span>
//                               </a>
//                             </motion.li>
//                           ))}
//                         </motion.ul>
//                       </div>
//                     )}
//                  </div>
//               </motion.aside>
//             </>
//           )}
//         </AnimatePresence>
//       </div>

//       <style>{`
//         .sm-scope .sm-panel-list[data-numbering='true'] {
//           counter-reset: smItem;
//         }
//         .sm-scope .sm-panel-list[data-numbering='true'] li a::after {
//           counter-increment: smItem;
//           content: counter(smItem, decimal-leading-zero);
//           position: absolute;
//           top: 0;
//           right: 0;
//           font-size: 0.2em; /* Relative to parent font-size */
//           font-weight: 800;
//           color: var(--sm-accent);
//           transform: translateY(0);
//           line-height: 1;
//         }
//         /* Mobile adjustment for numbering */
//         @media (max-width: 768px) {
//           .sm-scope .sm-panel-list[data-numbering='true'] li a::after {
//             font-size: 14px;
//             top: 4px;
//           }
//         }
//         .staggered-menu-panel::-webkit-scrollbar {
//           width: 4px;
//         }
//         .staggered-menu-panel::-webkit-scrollbar-thumb {
//           background-color: #eee;
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StaggeredMenu;



import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { gsap } from 'gsap';



export interface StaggeredMenuItem {

  label: string;

  ariaLabel: string;

  link: string;

}



export interface StaggeredMenuSocialItem {

  label: string;

  link: string;

}



export interface StaggeredMenuProps {

  position?: 'left' | 'right';

  colors?: string[];

  items?: StaggeredMenuItem[];

  socialItems?: StaggeredMenuSocialItem[];

  displaySocials?: boolean;

  displayItemNumbering?: boolean;

  className?: string;

  logoUrl?: string;

  menuButtonColor?: string;

  openMenuButtonColor?: string;

  accentColor?: string;

  isFixed: boolean;

  changeMenuColorOnOpen?: boolean;

  closeOnClickAway?: boolean;

  hideInternalLogo?: boolean;

  onMenuOpen?: () => void;

  onMenuClose?: () => void;

}



export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({

  position = 'right',

  colors = ['#B19EEF', '#5227FF'],

  items = [],

  socialItems = [],

  displaySocials = true,

  displayItemNumbering = true,

  className,

  logoUrl,

  menuButtonColor = '#fff',

  openMenuButtonColor = '#fff',

  changeMenuColorOnOpen = true,

  accentColor = '#5227FF',

  isFixed = false,

  closeOnClickAway = true,

  hideInternalLogo = false,

  onMenuOpen,

  onMenuClose

}: StaggeredMenuProps) => {

  const [open, setOpen] = useState(false);

  const openRef = useRef(false);



  const panelRef = useRef<HTMLDivElement | null>(null);

  const preLayersRef = useRef<HTMLDivElement | null>(null);

  const preLayerElsRef = useRef<HTMLElement[]>([]);



  const plusHRef = useRef<HTMLSpanElement | null>(null);

  const plusVRef = useRef<HTMLSpanElement | null>(null);

  const iconRef = useRef<HTMLSpanElement | null>(null);



  const textInnerRef = useRef<HTMLSpanElement | null>(null);

  const textWrapRef = useRef<HTMLSpanElement | null>(null);

  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);



  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  const closeTweenRef = useRef<gsap.core.Tween | null>(null);

  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);

  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);

  const colorTweenRef = useRef<gsap.core.Tween | null>(null);



  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const busyRef = useRef(false);



  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);



  useLayoutEffect(() => {

    const ctx = gsap.context(() => {

      const panel = panelRef.current;

      const preContainer = preLayersRef.current;



      const plusH = plusHRef.current;

      const plusV = plusVRef.current;

      const icon = iconRef.current;

      const textInner = textInnerRef.current;



      if (!panel || !plusH || !plusV || !icon || !textInner) return;



      let preLayers: HTMLElement[] = [];

      if (preContainer) {

        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];

      }

      preLayerElsRef.current = preLayers;



      const offscreen = position === 'left' ? -100 : 100;

      gsap.set([panel, ...preLayers], { xPercent: offscreen });



      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });

      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });

      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });



      gsap.set(textInner, { yPercent: 0 });



      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });

    });

    return () => ctx.revert();

  }, [menuButtonColor, position]);



  const buildOpenTimeline = useCallback(() => {

    const panel = panelRef.current;

    const layers = preLayerElsRef.current;

    if (!panel) return null;



    openTlRef.current?.kill();

    if (closeTweenRef.current) {

      closeTweenRef.current.kill();

      closeTweenRef.current = null;

    }

    itemEntranceTweenRef.current?.kill();



    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];

    const numberEls = Array.from(

      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')

    ) as HTMLElement[];

    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;

    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];



    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));

    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));



    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });

    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });



    const tl = gsap.timeline({ paused: true });



    layerStates.forEach((ls, i) => {

      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);

    });



    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;

    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);

    const panelDuration = 0.65;



    tl.fromTo(

      panel,

      { xPercent: panelStart },

      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },

      panelInsertTime

    );



    if (itemEls.length) {

      const itemsStartRatio = 0.15;

      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;



      tl.to(

        itemEls,

        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },

        itemsStart

      );



      if (numberEls.length) {

        tl.to(

          numberEls,

          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },

          itemsStart + 0.1

        );

      }

    }



    if (socialTitle || socialLinks.length) {

      const socialsStart = panelInsertTime + panelDuration * 0.4;



      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);



      if (socialLinks.length) {

        tl.to(

          socialLinks,

          {

            y: 0,

            opacity: 1,

            duration: 0.55,

            ease: 'power3.out',

            stagger: { each: 0.08, from: 'start' },

            onComplete: () => {

              gsap.set(socialLinks, { clearProps: 'opacity' });

            }

          },

          socialsStart + 0.04

        );

      }

    }



    openTlRef.current = tl;

    return tl;

  }, [position]);



  const playOpen = useCallback(() => {

    if (busyRef.current) return;

    busyRef.current = true;

    const tl = buildOpenTimeline();

    if (tl) {

      tl.eventCallback('onComplete', () => {

        busyRef.current = false;

      });

      tl.play(0);

    } else {

      busyRef.current = false;

    }

  }, [buildOpenTimeline]);



  const playClose = useCallback(() => {

    openTlRef.current?.kill();

    openTlRef.current = null;

    itemEntranceTweenRef.current?.kill();



    const panel = panelRef.current;

    const layers = preLayerElsRef.current;

    if (!panel) return;



    const all: HTMLElement[] = [...layers, panel];

    closeTweenRef.current?.kill();



    const offscreen = position === 'left' ? -100 : 100;



    closeTweenRef.current = gsap.to(all, {

      xPercent: offscreen,

      duration: 0.32,

      ease: 'power3.in',

      overwrite: 'auto',

      onComplete: () => {

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });



        const numberEls = Array.from(

          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')

        ) as HTMLElement[];

        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });



        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;

        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];



        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });

        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });



        busyRef.current = false;

      }

    });

  }, [position]);



  const animateIcon = useCallback((opening: boolean) => {

    const icon = iconRef.current;

    const h = plusHRef.current;

    const v = plusVRef.current;

    if (!icon || !h || !v) return;



    spinTweenRef.current?.kill();



    if (opening) {

      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      spinTweenRef.current = gsap

        .timeline({ defaults: { ease: 'power4.out' } })

        .to(h, { rotate: 45, duration: 0.5 }, 0)

        .to(v, { rotate: -45, duration: 0.5 }, 0);

    } else {

      spinTweenRef.current = gsap

        .timeline({ defaults: { ease: 'power3.inOut' } })

        .to(h, { rotate: 0, duration: 0.35 }, 0)

        .to(v, { rotate: 90, duration: 0.35 }, 0)

        .to(icon, { rotate: 0, duration: 0.001 }, 0);

    }

  }, []);



  const animateColor = useCallback(

    (opening: boolean) => {

      const btn = toggleBtnRef.current;

      if (!btn) return;



      colorTweenRef.current?.kill();



      if (changeMenuColorOnOpen) {

        const targetColor = opening ? openMenuButtonColor : menuButtonColor;

        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });

      } else {

        gsap.set(btn, { color: menuButtonColor });

      }

    },

    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]

  );



  React.useEffect(() => {

    if (toggleBtnRef.current) {

      if (changeMenuColorOnOpen) {

        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;

        gsap.set(toggleBtnRef.current, { color: targetColor });

      } else {

        gsap.set(toggleBtnRef.current, { color: menuButtonColor });

      }

    }

  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);



  const animateText = useCallback((opening: boolean) => {

    const inner = textInnerRef.current;

    if (!inner) return;



    textCycleAnimRef.current?.kill();



    const currentLabel = opening ? 'Menu' : 'Close';

    const targetLabel = opening ? 'Close' : 'Menu';

    const cycles = 3;



    const seq: string[] = [currentLabel];

    let last = currentLabel;

    for (let i = 0; i < cycles; i++) {

      last = last === 'Menu' ? 'Close' : 'Menu';

      seq.push(last);

    }

    if (last !== targetLabel) seq.push(targetLabel);

    seq.push(targetLabel);



    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });



    const lineCount = seq.length;

    const finalShift = ((lineCount - 1) / lineCount) * 100;



    textCycleAnimRef.current = gsap.to(inner, {

      yPercent: -finalShift,

      duration: 0.5 + lineCount * 0.07,

      ease: 'power4.out'

    });

  }, []);



  const toggleMenu = useCallback(() => {

    const target = !openRef.current;

    openRef.current = target;

    setOpen(target);



    if (target) {

      onMenuOpen?.();

      playOpen();

    } else {

      onMenuClose?.();

      playClose();

    }



    animateIcon(target);

    animateColor(target);

    animateText(target);

  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);



  const closeMenu = useCallback(() => {

    if (openRef.current) {

      openRef.current = false;

      setOpen(false);

      onMenuClose?.();

      playClose();

      animateIcon(false);

      animateColor(false);

      animateText(false);

    }

  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);



  React.useEffect(() => {

    if (!closeOnClickAway || !open) return;



    const handleClickOutside = (event: MouseEvent) => {

      if (

        panelRef.current &&

        !panelRef.current.contains(event.target as Node) &&

        toggleBtnRef.current &&

        !toggleBtnRef.current.contains(event.target as Node)

      ) {

        closeMenu();

      }

    };



    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, [closeOnClickAway, open, closeMenu]);



  const zIndexScope = isFixed ? 'z-[100]' : 'z-40';

  const zIndexWrapper = isFixed ? 'z-[100]' : 'z-40';

  // FIX: Increased header z-index to 150 to sit ABOVE the panel (140)

  const zIndexHeader = isFixed ? 'z-[150]' : 'z-20';

  const zIndexPanel = isFixed ? 'z-[140]' : 'z-10';

  const zIndexPrelayers = isFixed ? 'z-[95]' : 'z-5';

  const zIndexBackdrop = isFixed ? 'z-[105]' : 'z-5';



  return (

    <div

      className={`sm-scope ${zIndexScope} ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'w-full h-full'}`}

    >

      <div

        className={(className ? className + ' ' : '') + `staggered-menu-wrapper pointer-events-none relative w-full h-full ${zIndexWrapper}`}

        style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}

        data-position={position}

        data-open={open || undefined}

      >

        <div

          ref={preLayersRef}

          className={`sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none ${zIndexPrelayers}`}

          aria-hidden="true"

        >

          {(() => {

            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];

            let arr = [...raw];

            if (arr.length >= 3) {

              const mid = Math.floor(arr.length / 2);

              arr.splice(mid, 1);

            }

            return arr.map((c, i) => (

              <div

                key={i}

                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"

                style={{ background: c }}

              />

            ));

          })()}

        </div>



        {!hideInternalLogo && (

          <header

            className={`staggered-menu-header ${isFixed ? 'fixed' : 'absolute'} top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none ${zIndexHeader}`}

            aria-label="Main navigation header"

          >

            <div className="sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">

              {logoUrl && (

                <img

                  src={logoUrl}

                  alt="Logo"

                  className="sm-logo-img block h-12 w-auto object-contain"

                  draggable={false}

                  width={110}

                  height={110}

                />

              )}

            </div>



            <button

              ref={toggleBtnRef}

              className={`sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto ${

                open ? 'text-black' : 'text-[#e9e9ef]'

              }`}

              aria-label={open ? 'Close menu' : 'Open menu'}

              aria-expanded={open}

              aria-controls="staggered-menu-panel"

              onClick={toggleMenu}

              type="button"

            >

              <span

                ref={textWrapRef}

                className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-(--sm-toggle-width,auto) min-w-(--sm-toggle-width,auto)"

                aria-hidden="true"

              >

                <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">

                  {textLines.map((l, i) => (

                    <span className="sm-toggle-line block h-[1em] leading-none" key={i}>

                      {l}

                    </span>

                  ))}

                </span>

              </span>



              <span

                ref={iconRef}

                className="sm-icon relative w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center will-change-transform"

                aria-hidden="true"

              >

                <span

                  ref={plusHRef}

                  className="sm-icon-line absolute left-1/2 top-1/2 w-full h-0.5 bg-current rounded-xs -translate-x-1/2 -translate-y-1/2 will-change-transform"

                />

                <span

                  ref={plusVRef}

                  className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-0.5 bg-current rounded-xs -translate-x-1/2 -translate-y-1/2 will-change-transform"

                />

              </span>

            </button>

          </header>

        )}



        {hideInternalLogo && (

          <div className={`sm-header-standalone ${isFixed ? 'fixed' : 'absolute'} top-0 left-0 w-full flex items-center justify-end px-10 py-10 pointer-events-none ${zIndexHeader}`}>

            <button

              ref={toggleBtnRef}

              className="sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-medium leading-none pointer-events-auto"

              onClick={toggleMenu}

              type="button"

            >

              <span ref={textWrapRef} className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden uppercase font-bold text-[12px] tracking-[0.2em]">

                <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col">

                  {textLines.map((l, i) => <span key={i} className="h-[1em]">{l}</span>)}

                </span>

              </span>

              <span ref={iconRef} className="sm-icon relative w-3.5 h-3.5 flex items-center justify-center">

                <span ref={plusHRef} className="absolute w-full h-0.5 bg-current rounded-full" />

                <span ref={plusVRef} className="absolute w-full h-0.5 bg-current rounded-full" />

              </span>

            </button>

          </div>

        )}



        {open && isFixed && (

          <div

            className={`fixed inset-0 bg-transparent ${zIndexBackdrop}`}

            onClick={closeMenu}

            aria-hidden="true"

          />

        )}



        <aside

          id="staggered-menu-panel"

          ref={panelRef}

          className={`staggered-menu-panel ${isFixed ? 'fixed' : 'absolute'} top-0 right-0 h-full bg-white flex flex-col p-[6em_2em_2em_2em] overflow-y-auto ${zIndexPanel}`}

          style={{ backgroundColor: '#ffffff' }}

          aria-hidden={!open}

        >

          {/* Internal logo inside the white panel */}

          {hideInternalLogo && logoUrl && (

            <div className="sm-panel-logo mb-8">

              <img

                src={logoUrl}

                alt="Logo"

                className="h-12 w-auto object-contain"

                draggable={false}

              />

            </div>

          )}



          <div className="sm-panel-inner flex-1 flex flex-col gap-5">

            <ul

              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"

              role="list"

              data-numbering={displayItemNumbering || undefined}

            >

              {items && items.length ? (

                items.map((it, idx) => (

                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>

                    <a

                      className="sm-panel-item relative text-black font-semibold text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]"

                      href={it.link}

                      aria-label={it.ariaLabel}

                      data-index={idx + 1}

                      onClick={closeMenu}

                    >

                      <span className="sm-panel-itemLabel inline-block origin-[50%_100%] will-change-transform">

                        {it.label}

                      </span>

                    </a>

                  </li>

                ))

              ) : (

                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">

                  <span className="sm-panel-item relative text-black font-semibold text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">

                    <span className="sm-panel-itemLabel inline-block origin-[50%_100%] will-change-transform">

                      No items

                    </span>

                  </span>

                </li>

              )}

            </ul>



            {displaySocials && socialItems && socialItems.length > 0 && (

              <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">

                <h3 className="sm-socials-title m-0 text-base font-medium text-(--sm-accent,#ff0000)">Socials</h3>

                <ul

                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"

                  role="list"

                >

                  {socialItems.map((s, i) => (

                    <li key={s.label + i} className="sm-socials-item">

                      <a

                        href={s.link}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-block py-0.5 transition-[color,opacity] duration-300 ease-linear"

                      >

                        {s.label}

                      </a>

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

        </aside>

      </div>

     

      <style>{`

  .sm-scope .sm-header-standalone {

    height: calc(2.5rem + 64px);

    display: flex;

    align-items: center;

    padding: 0 2.5rem;

  }



  .sm-scope .staggered-menu-panel {

    position: fixed;

    top: 0;

    right: 0;

    width: 100%;

    height: 100%;

    background: #ffffff !important;

    display: flex;

    flex-direction: column;

    padding: 2.5rem;

    padding-top: 10rem;

    z-index: 10;

  }



  .sm-scope .sm-panel-logo {

    position: absolute;

    top: 2.5rem;

    left: 2.5rem;

    display: block;

    z-index: 20; /* Ensure logo sits above panel content if overlap occurs */

  }



  .sm-scope .sm-panel-item {

    position: relative;

    color: #000;

    font-weight: 600;

    font-size: clamp(3rem, 12vw, 4.5rem);

    line-height: 1;

    letter-spacing: -3px;

    text-transform: uppercase;

    text-decoration: none;

    display: inline-block;

    padding-right: 1.5em;

    transition: color 0.25s ease;

  }



  .sm-scope .sm-panel-item:hover {

    color: var(--sm-accent, #5227FF);

  }



  .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {

    counter-increment: smItem;

    content: counter(smItem, decimal-leading-zero);

    position: absolute;

    top: 0.15em;

    right: 0.5em;

    font-size: 18px;

    font-weight: 500;

    letter-spacing: 0;

    color: var(--sm-accent, #5227FF);

    opacity: var(--sm-num-opacity, 0);

  }

`}</style>

    </div>

  );

};



export default StaggeredMenu;