const FRAUD = {
  init: function() {
    var self = this;
    NAV.bind('btn-fraud-analyze', function() { self.analyze(); });
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

    AI.setLoading('btn-fraud-analyze', true, '🔍 Analyze Risk');

    try {
      var prompt = 'Analyze this transaction for fraud risk. Return ONLY valid JSON.\n\n' +
        'Customer: ' + customer + '\n' +
        'Amount: $' + amount + '\n' +
        'Email: ' + (email || 'Unknown') + '\n' +
        'Country: ' + (country || 'Unknown') + '\n' +
        'History: ' + (history || 'No history') + '\n\n' +
        'Return: {"risk_score":7,"risk_level":"high","recommendation":"verify","reasons":["reason1","reason2"],"action":"Block this transaction until customer verifies identity"}';

      var data = await AI.callJSON(prompt);

      var score = data.risk_score;
      var scoreEl = document.getElementById('fraud-score');
      if (scoreEl) {
        scoreEl.textContent = score + '/10';
        scoreEl.style.color = score >= 7 ? 'var(--red)' : score >= 4 ? 'var(--yellow)' : 'var(--green)';
      }

      var levelEl = document.getElementById('fraud-level');
      if (levelEl) levelEl.textContent = data.risk_level.toUpperCase();

      var recEl = document.getElementById('fraud-recommendation');
      if (recEl) {
        recEl.textContent = data.action;
        recEl.className = 'alert-box ' + (score >= 7 ? 'alert-red' : score >= 4 ? 'alert-yellow' : 'alert-green');
      }

      var reasonsEl = document.getElementById('fraud-reasons');
      if (reasonsEl && data.reasons) {
        reasonsEl.innerHTML = data.reasons.map(function(r) {
          return '<div class="list-item">⚠️ ' + r + '</div>';
        }).join('');
      }

      document.getElementById('fraud-result').style.display = 'block';

    } catch(e) {
      alert('Analysis error. Please try again.');
    } finally {
      AI.setLoading('btn-fraud-analyze', false, '🔍 Analyze Risk');
    }
  }
};const FRAUD = {
  init: function() {
    var self = this;
    NAV.bind('btn-fraud-analyze', function() { self.analyze(); });
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

    AI.setLoading('btn-fraud-analyze', true, '🔍 Analyze Risk');

    try {
      var prompt = 'Analyze this transaction for fraud risk. Return ONLY valid JSON.\n\n' +
        'Customer: ' + customer + '\n' +
        'Amount: $' + amount + '\n' +
        'Email: ' + (email || 'Unknown') + '\n' +
        'Country: ' + (country || 'Unknown') + '\n' +
        'History: ' + (history || 'No history') + '\n\n' +
        'Return: {"risk_score":7,"risk_level":"high","recommendation":"verify","reasons":["reason1","reason2"],"action":"Block this transaction until customer verifies identity"}';

      var data = await AI.callJSON(prompt);

      var score = data.risk_score;
      var scoreEl = document.getElementById('fraud-score');
      if (scoreEl) {
        scoreEl.textContent = score + '/10';
        scoreEl.style.color = score >= 7 ? 'var(--red)' : score >= 4 ? 'var(--yellow)' : 'var(--green)';
      }

      var levelEl = document.getElementById('fraud-level');
      if (levelEl) levelEl.textContent = data.risk_level.toUpperCase();

      var recEl = document.getElementById('fraud-recommendation');
      if (recEl) {
        recEl.textContent = data.action;
        recEl.className = 'alert-box ' + (score >= 7 ? 'alert-red' : score >= 4 ? 'alert-yellow' : 'alert-green');
      }

      var reasonsEl = document.getElementById('fraud-reasons');
      if (reasonsEl && data.reasons) {
        reasonsEl.innerHTML = data.reasons.map(function(r) {
          return '<div class="list-item">⚠️ ' + r + '</div>';
        }).join('');
      }

      document.getElementById('fraud-result').style.display = 'block';

    } catch(e) {
      alert('Analysis error. Please try again.');
    } finally {
      AI.setLoading('btn-fraud-analyze', false, '🔍 Analyze Risk');
    }
  }
};
