import {gsap} from "gsap";

export type LaunchpadClientGlobals = {
  navBreakpoint: number,
}

// @ts-ignore
document["launchpadGlobals"] = {
  navBreakpoint: 768,
} as LaunchpadClientGlobals;

export function getClientGlobals(): LaunchpadClientGlobals {
  // @ts-ignore
  return document["launchpadGlobals"];
}

export function getClientGlobal<K extends keyof LaunchpadClientGlobals>(key: K): LaunchpadClientGlobals[K] {
  return getClientGlobals()[key];
}

export function isLarge() {
  return window.innerWidth > getClientGlobal("navBreakpoint");
}

export function isDesktop() {
  // @ts-ignore
  if (navigator.userAgentData) {
    // @ts-ignore
    return !navigator.userAgentData.mobile;
  }

  const ua = navigator.userAgent.toLowerCase();
  return !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
}

export function createFadeIn(targetSelector: string) {
  // blur only on desktop, mobile browsers can't really render it cleanly
  gsap.set(targetSelector, {
    scale: 0.9,
    filter: isDesktop() ? "blur(5px)" : "",
    y: 100,
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: targetSelector,
      start: "top 90%",
      end: "bottom top",
      markers: false,
      toggleActions: "play complete resume reverse",
      invalidateOnRefresh: true,
    },
  }).to(targetSelector,
    {
      scale: 1,
      filter: isDesktop() ? "blur(0px)" : "",
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power1.inOut",
    },
    0);
}