export const emitEvent = (eventName: string, detail: any = null) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const subscribeToEvent = (
  eventName: string,
  callback: (detail: any) => void
): (() => void) => {
  const handler = (event: Event) => callback((event as CustomEvent).detail);
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};