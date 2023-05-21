export function blockScroll(el) {
  el.style.height = '100%';
  el.style.overflow = 'hidden';
}

export function enableScroll(el) {
  el.style.height = 'unset';
  el.style.overflow = 'unset';
}
