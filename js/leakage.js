const LEAKAGE = {
  init: function() {
    var self = this;
    NAV.bind('btn-leakage-analyze', function() { self.analyze(); });
  },

  analyze: async function() {
    var text = document.getElementById('leakage-text').value.trim();
    if (!text) { alert('Please paste your transaction data'); return; }

    AI.setLoading('btn-leakage-analyze', true, '🔍 Find Revenue Leaks');

    try {
      var prompt = 'Analyze these transactions for revenue leakage. Return ONLY valid JSON.\n\n' +
        text + '\n\n' +
        'Find: unfilled subscriptions, incomplete refunds, billing errors, duplicate charges.\n' +
        'Return: {"total_leakage":3200,"items":[{"type":"subscription","description":"Unfilled subscription for John","amount":99,"action":"Invoice immediately"}],"summary":"You are losing $3,200/month"}';

      var data = await AI.callJSON(prompt);

      var totalEl = document.getElementById('leakage-total');
      if (totalEl) totalEl.textContent = '$' + data.total_leakage;

      var summaryEl = document.getElementById('leakage-summary');
      if (summaryEl) summaryEl.textContent = data.summary;

      var itemsEl = document.getElementById('leakage-items');
      if (itemsEl && data.items) {
        itemsEl.innerHTML = data.items.map(function(item) {
          return '<div class="list-item">' +
            '<div class="list-item-left"><h4>' + item.description + '</h4><p>' + item.type + '</p></div>' +
            '<div><span class="red bold">$' + item.amount + '</span>' +
            '<div class="green small">' + item.action + '</div></div>' +
            '</div>';
        }).join('');
      }

      document.getElementById('leakage-result').style.display = 'block';

    } catch(e) {
      alert('Analysis error. Please try again.');
    } finally {
      AI.setLoading('btn-leakage-analyze', false, '🔍 Find Revenue Leaks');
    }
  }
};
