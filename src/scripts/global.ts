// @ts-ignore
import Animation = gsap.core.Animation;

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