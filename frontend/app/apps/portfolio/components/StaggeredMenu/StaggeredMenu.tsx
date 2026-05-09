import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  data?: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
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
  hideToggleButton?: boolean;
  externalOpen?: boolean;
  hideInternalLogo?: boolean;
  onItemClick?: (item: StaggeredMenuItem) => void;
  themeToggleLabel?: string;
  themeToggleIcon?: React.ReactNode;
  onThemeToggle?: () => void;
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
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  closeOnClickAway = false,
  hideToggleButton = false,
  externalOpen,
  hideInternalLogo = false,
  onItemClick,
  themeToggleLabel,
  themeToggleIcon,
  onThemeToggle,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);

  // Stable refs so animation callbacks never go stale
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const itemElsRef = useRef<HTMLElement[]>([]);
  const numberElsRef = useRef<HTMLElement[]>([]);
  const socialTitleRef = useRef<HTMLElement | null>(null);
  const socialLinksRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const activeTlRef = useRef<gsap.core.Timeline | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  // Stable prop refs — lets animation callbacks read latest props without
  // being recreated (avoids stale-closure bugs and excess re-memoisation)
  const positionRef = useRef(position);
  const menuButtonColorRef = useRef(menuButtonColor);
  const openMenuButtonColorRef = useRef(openMenuButtonColor);
  const changeMenuColorOnOpenRef = useRef(changeMenuColorOnOpen);
  const onMenuOpenRef = useRef(onMenuOpen);
  const onMenuCloseRef = useRef(onMenuClose);
  const onItemClickRef = useRef(onItemClick);

  useLayoutEffect(() => { positionRef.current = position; }, [position]);
  useLayoutEffect(() => { menuButtonColorRef.current = menuButtonColor; }, [menuButtonColor]);
  useLayoutEffect(() => { openMenuButtonColorRef.current = openMenuButtonColor; }, [openMenuButtonColor]);
  useLayoutEffect(() => { changeMenuColorOnOpenRef.current = changeMenuColorOnOpen; }, [changeMenuColorOnOpen]);
  useLayoutEffect(() => { onMenuOpenRef.current = onMenuOpen; }, [onMenuOpen]);
  useLayoutEffect(() => { onMenuCloseRef.current = onMenuClose; }, [onMenuClose]);
  useLayoutEffect(() => { onItemClickRef.current = onItemClick; }, [onItemClick]);

  // ── Cache DOM refs after every render so animations always have fresh targets
  const cacheDomRefs = useCallback(() => {
    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    if (!panel || !preContainer) return;

    preLayerElsRef.current = Array.from(
      preContainer.querySelectorAll('.sm-prelayer')
    ) as HTMLElement[];

    itemElsRef.current = Array.from(
      panel.querySelectorAll('.sm-panel-itemLabel')
    ) as HTMLElement[];

    numberElsRef.current = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];

    socialTitleRef.current = panel.querySelector('.sm-socials-title') as HTMLElement | null;

    socialLinksRef.current = Array.from(
      panel.querySelectorAll('.sm-socials-link')
    ) as HTMLElement[];
  }, []);

  // ── GSAP init — runs once on mount ───────────────────────────────────────
  useLayoutEffect(() => {
    cacheDomRefs();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    const plusH = plusHRef.current;
    const plusV = plusVRef.current;
    const icon = iconRef.current;
    const textInner = textInnerRef.current;

    if (!panel || !plusH || !plusV || !icon || !textInner) return;

    const offscreen = positionRef.current === 'left' ? -100 : 100;

    // Set will-change once so the GPU layer is pre-composited
    gsap.set([panel, ...layers], {
      xPercent: offscreen,
      willChange: 'transform',
      force3D: true,
    });

    gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(textInner, { yPercent: 0 });

    if (toggleBtnRef.current) {
      gsap.set(toggleBtnRef.current, { color: menuButtonColorRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-cache when items/socials change (panel re-renders new DOM nodes)
  useLayoutEffect(() => { cacheDomRefs(); }, [items, socialItems, cacheDomRefs]);

  // ── externalOpen sync ─────────────────────────────────────────────────────
  const prevExternalOpenRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    if (externalOpen === undefined) return;
    if (externalOpen === prevExternalOpenRef.current) return;
    prevExternalOpenRef.current = externalOpen;
    if (!externalOpen && !openRef.current) return;

    const target = externalOpen;
    openRef.current = target;
    setOpen(target);

    if (target) { lockBody(); onMenuOpenRef.current?.(); _playOpen(); }
    else         { unlockBody(); onMenuCloseRef.current?.(); _playClose(); }

    animateIcon(target);
    animateText(target, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalOpen]);

  // ── Open animation ────────────────────────────────────────────────────────
  const _playOpen = useCallback(() => {
    cacheDomRefs();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    // Kill any running animation immediately — no waiting
    activeTlRef.current?.kill();
    activeTlRef.current = null;

    const itemEls      = itemElsRef.current;
    const numberEls    = numberElsRef.current;
    const socialTitle  = socialTitleRef.current;
    const socialLinks  = socialLinksRef.current;
    const offscreen    = positionRef.current === 'left' ? -100 : 100;

    // Snap layers + panel to offscreen before animating in
    gsap.set([...layers, panel], { xPercent: offscreen, willChange: 'transform', force3D: true });
    if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 10, force3D: true });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle)      gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline();

    // Pre-layers stagger in
    layers.forEach((el, i) => {
      tl.to(el, { xPercent: 0, duration: 0.45, ease: 'power4.out' }, i * 0.06);
    });

    const lastLayerTime  = layers.length ? (layers.length - 1) * 0.06 : 0;
    const panelStartTime = lastLayerTime + (layers.length ? 0.06 : 0);

    // Panel slides in
    tl.to(panel, { xPercent: 0, duration: 0.55, ease: 'power4.out' }, panelStartTime);

    // Nav items reveal
    if (itemEls.length) {
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 0.8, ease: 'power4.out', stagger: 0.07, force3D: true },
        panelStartTime + 0.08
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { ['--sm-num-opacity' as any]: 1, duration: 0.5, ease: 'power2.out', stagger: 0.07 },
          panelStartTime + 0.15
        );
      }
    }

    // Socials fade in
    if (socialTitle || socialLinks.length) {
      const sStart = panelStartTime + 0.2;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.4, ease: 'power2.out' }, sStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.07,
            onComplete: () => { gsap.set(socialLinks, { clearProps: 'opacity' }); },
          },
          sStart + 0.04
        );
      }
    }

    activeTlRef.current = tl;
  }, [cacheDomRefs]);

  // ── Close animation ───────────────────────────────────────────────────────
  const _playClose = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    // Immediately kill open animation — never block the close
    activeTlRef.current?.kill();
    activeTlRef.current = null;

    const offscreen = positionRef.current === 'left' ? -100 : 100;

    // Single unified tween — all elements slide out together, GPU-accelerated
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset item/social state so next open starts clean
        const itemEls     = itemElsRef.current;
        const numberEls   = numberElsRef.current;
        const socialTitle = socialTitleRef.current;
        const socialLinks = socialLinksRef.current;
        if (itemEls.length)     gsap.set(itemEls,     { yPercent: 140, rotate: 10 });
        if (numberEls.length)   gsap.set(numberEls,   { ['--sm-num-opacity' as any]: 0 });
        if (socialTitle)        gsap.set(socialTitle,  { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks,  { y: 25, opacity: 0 });
      },
    });

    tl.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.28,
      ease: 'power3.in',
      overwrite: 'auto',
      force3D: true,
    });

    activeTlRef.current = tl;
  }, []);

  // ── Icon animation ────────────────────────────────────────────────────────
  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h    = plusHRef.current;
    const v    = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45,  duration: 0.45 }, 0)
        .to(v, { rotate: -45, duration: 0.45 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0,  duration: 0.3 }, 0)
        .to(v, { rotate: 90, duration: 0.3 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  // ── Button color animation ────────────────────────────────────────────────
  const animateColor = useCallback((opening: boolean) => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpenRef.current) {
      const targetColor = opening ? openMenuButtonColorRef.current : menuButtonColorRef.current;
      colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.15, duration: 0.25, ease: 'power2.out' });
    } else {
      gsap.set(btn, { color: menuButtonColorRef.current });
    }
  }, []);

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      const c = (changeMenuColorOnOpen && openRef.current) ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: c });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  // ── Text cycle animation (slot-machine label) ─────────────────────────────
  // Uses a DOM-only tween — no React setState mid-animation, no re-renders
  const animateText = useCallback((opening: boolean, skipCycle = false) => {
    const inner = textInnerRef.current;
    textCycleAnimRef.current?.kill();

    if (skipCycle || !inner) {
      setTextLines([opening ? 'Close' : 'Menu']);
      return;
    }

    const currentLabel = opening ? 'Menu'  : 'Close';
    const targetLabel  = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    // Batch the state update — React will re-render once, then GSAP takes over
    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount  = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    // Schedule after React flush so DOM nodes from setTextLines exist
    requestAnimationFrame(() => {
      textCycleAnimRef.current = gsap.to(inner, {
        yPercent: -finalShift,
        duration: 0.45 + lineCount * 0.06,
        ease: 'power4.out',
      });
    });
  }, []);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  const lockBody   = useCallback(() => { document.body.style.overflow = 'hidden'; }, []);
  const unlockBody = useCallback(() => { document.body.style.overflow = '';       }, []);

  // ── Toggle / close — stable, no dependency churn ──────────────────────────
  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) { lockBody(); onMenuOpenRef.current?.(); _playOpen(); }
    else         { unlockBody(); onMenuCloseRef.current?.(); _playClose(); }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [_playOpen, _playClose, animateIcon, animateColor, animateText, lockBody, unlockBody]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    setTextLines(['Menu']);
    unlockBody();
    onMenuCloseRef.current?.();
    _playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false, true);
  }, [_playClose, animateIcon, animateColor, animateText, unlockBody]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  React.useEffect(() => () => { document.body.style.overflow = ''; }, []);

  // ── Item click ────────────────────────────────────────────────────────────
  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: StaggeredMenuItem) => {
      e.preventDefault();
      if (onItemClickRef.current) onItemClickRef.current(item);
    },
    []
  );

  // ── Click-away ────────────────────────────────────────────────────────────
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnClickAway, open, closeMenu]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`sm-scope z-[200] fixed top-0 left-0 w-screen h-screen overflow-hidden ${!open ? 'pointer-events-none' : ''}`}
    >
      <div
        className={
          (className ? className + ' ' : '') +
          'staggered-menu-wrapper pointer-events-none relative w-full h-full z-40'
        }
        style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Pre-layers (stagger wipe effect) */}
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
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

        {/* Panel overlay header — only rendered when open */}
        {open && (
          <header
            className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none z-20"
            aria-label="Menu controls"
          >
            {onThemeToggle ? (
              <button
                type="button"
                onClick={() => { onThemeToggle(); closeMenu(); }}
                className="pointer-events-auto flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-0 cursor-pointer text-black hover:opacity-70 transition-opacity"
                aria-label={themeToggleLabel ?? 'Toggle theme'}
              >
                {themeToggleIcon ?? null}
              </button>
            ) : (
              <span />
            )}

            <button
              ref={toggleBtnRef}
              className="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto"
              style={{ color: '#111' }}
              aria-label="Close menu"
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              <span
                ref={textWrapRef}
                className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
                aria-hidden="true"
              >
                <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                  {textLines.map((l, i) => (
                    <span className="sm-toggle-line block h-[1em] leading-none" key={i}>{l}</span>
                  ))}
                </span>
              </span>
              <span
                ref={iconRef}
                className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
                aria-hidden="true"
              >
                <span ref={plusHRef} className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]" />
                <span ref={plusVRef} className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]" />
              </span>
            </button>
          </header>
        )}

        {/* GSAP sentinel — keeps icon refs alive when header is unmounted */}
        {!open && (
          <span aria-hidden="true" style={{ display: 'none' }}>
            <span ref={textWrapRef}><span ref={textInnerRef}>{textLines.map((l, i) => <span key={i}>{l}</span>)}</span></span>
            <span ref={iconRef}><span ref={plusHRef} /><span ref={plusVRef} /></span>
          </span>
        )}

        {/* Panel */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full bg-white flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px] pointer-events-auto"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
          aria-hidden={!open}
        >
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
                      onClick={(e) => handleItemClick(e, it)}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                  <span className="sm-panel-item relative text-black font-semibold text-[4rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                      No items
                    </span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 ? (
              <div className="sm-socials mt-auto pt-8 pb-20 flex flex-col gap-3" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">Socials</h3>
                <ul className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.ariaLabel ?? s.label}
                        className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-flex items-center gap-2 py-[2px] transition-[color,opacity] duration-150 ease-linear"
                      >
                        {s.icon && <span className="inline-flex items-center justify-center">{s.icon}</span>}
                        <span>{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {/* CSS — identical to original, untouched */}
      <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 2em; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: fixed; top: 0; right: 0; width: clamp(260px, 38vw, 420px); height: 100%; background: #ffffff; display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow-y: auto; z-index: 10; }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } }.sm-scope .sm-prelayers { position: fixed; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 420px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
@media (max-width: 1024px) { .sm-scope .sm-prelayers { width: 100%; left: 0; right: 0; } }
@media (max-width: 640px) { .sm-scope .sm-prelayers { width: 100%; left: 0; right: 0; } }.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; font-size: 4rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;