document.addEventListener('DOMContentLoaded', function() {
  applyHash();
});

window.addEventListener('hashchange', function() {
  applyHash();
});

function applyHash() {
  var anchor = window.location.hash;
  var faqContainer = document.getElementById('faqContainer');
  if (!faqContainer || !anchor) return;

  var target = faqContainer.querySelector(anchor);
  if (!target) return;

  var top = target.getBoundingClientRect().top + window.pageYOffset - 60;
  window.scrollTo({ top: top, behavior: 'smooth' });
}
