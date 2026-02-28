document.addEventListener('DOMContentLoaded', function() {
  applyHash();
  initProtectedEmails();
});

window.addEventListener('hashchange', function() {
  applyHash();
});

function rot13(str) {
  return str.replace(/[a-zA-Z]/g, function(c) {
    var base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function initProtectedEmails() {
  document.querySelectorAll('[data-rot13-email]').forEach(function(el) {
    var email = rot13(el.dataset.rot13Email);
    el.href = 'mailto:' + email;
    el.textContent = email;
  });
}

function applyHash() {
  var anchor = window.location.hash;
  var faqContainer = document.getElementById('faqContainer');
  if (!faqContainer || !anchor) return;

  var target = faqContainer.querySelector(anchor);
  if (!target) return;

  var top = target.getBoundingClientRect().top + window.pageYOffset - 60;
  window.scrollTo({ top: top, behavior: 'smooth' });
}
