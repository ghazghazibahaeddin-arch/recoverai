const FRAUD = {
  init: function() {
    var self = this;
    var btn = document.getElementById('btn-fraud-analyze');
    if (btn) btn.addEventListener('click', function() { self.analyze(); });
  },

  analyze: async function() {
    var customer = document.getElementById('fraud-customer').value.trim();
    var amount = document.getElementById('fraud-amount').value;
    var email = document.getElementById('fraud-email').value.trim();
    var country = document.getElementById('fraud-country').value.trim();
    var history = document.getElementById('fraud-history').value.trim();

    if (!customer || !amount) {
      alert('Please fill customer name and amount');
      return;
    }

    var btn = document.getElementById('btn-fraud-analyze');
    btn.disabled = true;
    btn.textContent = 'Analyzing...';

    try {
      var prompt = 'Analyze this transaction for fraud risk. Return ONLY valid JSON.\n\n' +
        'Customer: ' + customer + '\n' +
        'Amount: $' + amount + '\n' +
        'Email: ' + (email || 'Unknown') + '\n' +
        'Country: ' + (country || 'Unknown') + '\n' +
        'History: ' + (history || 'No history') + '\n\n' +
        'Return exactly: {"risk_score":7,"risk_level":"high","recommendation":"verify","reasons":["reason1","reason2"],"action":"Block this transaction until customer verifies identity"}';

      var res = await fetch(CONFIG.WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Return only valid JSON. No text, no markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 800
        })
      });

      var data = await res.json();
      if (!data.choices || !data.choices[0]) {
        alert('AI error: ' + JSON.stringify(data));
        return;
      }

      var text = data.choices[0].message.content;
      var start = text.indexOf('{');
      var end = text.lastIndexOf('}') + 1;
      var parsed = JSON.parse(text.slice(start, end));

      var score = parsed.risk_score;
      var scoreEl = document.getElementById('fraud-score');
      if (scoreEl) {
        scoreEl.textContent = score + '/10';
        scoreEl.style.color = score >= 7 ? '#ef4444' : score >= 4 ? '#f59e0b' : '#10b981';
      }

      var recEl = document.getElementById('fraud-recommendation');
      if (recEl) {
        recEl.textContent = parsed.action;
        recEl.className = 'alert-box ' + (score >= 7 ? 'alert-red' : score >= 4 ? 'alert-yellow' : 'alert-green');
      }

      var reasonsEl = document.getElementById('fraud-reasons');
      if (reasonsEl && parsed.reasons) {
        reasonsEl.innerHTML = parsed.reasons.map(function(r) {
          return '<div class="list-item">⚠️ ' + r + '</div>';
        }).join('');
      }

      document.getElementById('fraud-result').style.display = 'block';

    } catch(e) {
      alert('Error: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '🔍 Analyze Fraud Risk';
    }
  }
};
