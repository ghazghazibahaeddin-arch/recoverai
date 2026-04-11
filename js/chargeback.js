const CHARGEBACK = {
  list: [],

  init: function() {
    var self = this;
    var btn = document.getElementById('btn-cb-generate');
    if (btn) btn.addEventListener('click', function() { self.generate(); });
    var copy = document.getElementById('btn-cb-copy');
    if (copy) copy.addEventListener('click', function() {
      var t = document.getElementById('cb-result-text');
      if (t) navigator.clipboard.writeText(t.textContent).then(function() { alert('Copied!'); });
    });
  },

  generate: async function() {
    var customer = document.getElementById('cb-customer').value.trim();
    var amount = document.getElementById('cb-amount').value;
    var date = document.getElementById('cb-date').value;
    var reason = document.getElementById('cb-reason').value;
    var desc = document.getElementById('cb-desc').value.trim();
    var tracking = document.getElementById('cb-tracking').value.trim();

    if (!customer || !amount || !desc) {
      alert('Please fill customer name, amount and description');
      return;
    }

    var btn = document.getElementById('btn-cb-generate');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
      var prompt = 'Write a professional chargeback dispute letter.\nCustomer: ' + customer +
        '\nAmount: $' + amount + '\nDate: ' + date + '\nReason: ' + reason +
        '\nProduct: ' + desc + '\nTracking: ' + (tracking || 'None') +
        '\n\nWrite a complete winning dispute letter.';

      var res = await fetch('https://clearcfo-proxy.ghazghazibahaeddin.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        })
      });

      var data = await res.json();
      var text = data.choices[0].message.content;

      document.getElementById('cb-result-text').textContent = text;
      document.getElementById('cb-result').style.display = 'block';

      this.list.push({ customer: customer, amount: amount, status: 'pending' });
      this.updateStats();

    } catch(e) {
      alert('Error: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '🤖 Generate Winning Dispute Letter';
    }
  },

  updateStats: function() {
    var t = document.getElementById('cb-total');
    var w = document.getElementById('cb-won');
    var p = document.getElementById('cb-pending');
    if (t) t.textContent = this.list.length;
    if (w) w.textContent = this.list.filter(function(c){return c.status==='won';}).length;
    if (p) p.textContent = this.list.filter(function(c){return c.status==='pending';}).length;
  }
};
