document.addEventListener('DOMContentLoaded', function() {
  applyHash();

  var faqContainer = document.getElementById('faqContainer');
  if (faqContainer) {
    faqContainer.querySelectorAll('.accordion-button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        history.replaceState('', document.title, window.location.pathname + window.location.search);
      });
    });
  }
});

window.addEventListener('hashchange', function() {
  //applyHash();
});

function applyHash() {
  var anchor = window.location.hash;
  var faqContainer = document.getElementById('faqContainer');
  if (!faqContainer || !anchor) return;

  var target = faqContainer.querySelector(anchor);
  if (!target) return;

  var accordionHeader = target.previousElementSibling;
  if (accordionHeader) {
    var button = accordionHeader.querySelector('.accordion-button');
    if (button) button.click();
  }

  var panel = target.closest('.accordion-item') || target.parentElement;
  var top = panel.getBoundingClientRect().top + window.pageYOffset - 60;
  window.scrollTo({ top: top, behavior: 'smooth' });
}
