export function injectContent(selector, label, content) {
  document.querySelector(selector).textContent = content;
  console.info(label, content);
}
