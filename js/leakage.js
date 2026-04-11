const LEAKAGE = {
  init: function() {
    var self = this;
    var btn = document.getElementById('btn-leakage-analyze');
    if (btn) btn.addEventListener('click', function() { self.analyze(); });
  },

  analyze: async function() {
    var text = document.getElementById('leakage-text').value.trim();
    if (!text) { alert('Please paste your transaction data'); return; }

    var btn = document.getElementById('btn-leakage-analyze');
    btn.disabled = true;
    btn.textContent = 'Analyzing...';

    try {
      var prompt = 'Analyze these transactions for revenue leakage. Return ONLY valid JSON.\n\n' +
        text + '\n\n' +
        'Return exactly: {"total_leakage":3200,"items":[{"type":"subscription","description":"Unfilled subscription for John","amount":99,"action":"Invoice immediately"}],"summary":"You are losing $3,200/month"}';

      var res = await fetch(CONFIG.WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Return only valid JSON. No text, no markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000
        })
      });

      var data = await res.json();
      if (!data.choices || !data.choices[0]) {
        alert('AI error: ' + JSON.stringify(data));
        return;
      }

      var response = data.choices[0].message.content;
      var start = response.indexOf('{');
      var end = response.lastIndexOf('}') + 1;
      var parsed = JSON.parse(response.slice(start, end));

      document.getElementById('leakage-total').textContent = '$' + parsed.total_leakage;
      document.getElementById('leakage-summary').textContent = parsed.summary;

      var itemsEl = document.getElementById('leakage-items');
      if (itemsEl && parsed.items) {
        itemsEl.innerHTML = parsed.items.map(function(item) {
          return '<div class="list-item">' +
            '<div class="list-item-left"><h4>' + item.description + '</h4><p>' + item.type + '</p></div>' +
            '<div><span style="color:#ef4444;font-weight:700">$' + item.amount + '</span>' +
            '<div style="color:#10b981;font-size:.8rem">' + item.action + '</div></div>' +
            '</div>';
        }).join('');
      }

      document.getElementById('leakage-result').style.display = 'block';

    } catch(e) {
      alert('Error: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '🔍 Find Revenue Leaks';
    }
  }
};
