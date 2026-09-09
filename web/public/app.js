/**
 * Progressive enhancement only. Every page is fully readable and navigable
 * with this file blocked — filtering narrows a list that is already rendered,
 * and the language toggle is a set of plain links.
 */
(function () {
  'use strict';

  // Remember the visitor's language so the root redirect can honour it.
  try {
    var locale = document.documentElement.lang;
    if (locale) localStorage.setItem('ads-locale', locale);
  } catch (e) {
    /* private mode — the redirect falls back to Accept-Language */
  }

  // --- Copy attribution ----------------------------------------------------
  document.addEventListener('click', function (event) {
    var button = event.target.closest('.btn-copy');
    if (!button) return;

    var text = button.getAttribute('data-attribution') || '';
    var done = function () {
      var original = button.textContent;
      button.textContent = button.getAttribute('data-copied-label') || 'Copied';
      setTimeout(function () { button.textContent = original; }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  });

  // --- Faceted filtering ---------------------------------------------------
  var form = document.getElementById('filters');
  var grid = document.getElementById('card-grid');
  if (!form || !grid) return;

  var counter = document.getElementById('results-count');
  var empty = document.getElementById('no-results');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

  function selected(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (input) { return input.value; });
  }

  function apply() {
    var tiers = selected('tier');
    var countries = selected('country');
    var families = selected('family');
    var shown = 0;

    cards.forEach(function (card) {
      var visible =
        (!tiers.length || tiers.indexOf(card.dataset.tier) > -1) &&
        (!countries.length || countries.indexOf(card.dataset.country) > -1) &&
        (!families.length || families.indexOf(card.dataset.family) > -1);
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    if (counter) {
      var template = counter.getAttribute('data-template') || '{count}';
      counter.textContent = template.replace('{count}', shown);
    }
    if (empty) empty.hidden = shown !== 0;
  }

  form.addEventListener('change', apply);
  form.addEventListener('reset', function () { setTimeout(apply, 0); });
})();
