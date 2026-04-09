const CHARGEBACK = {
  list: [],

  init: function() {
    var self = this;
    NAV.bind('btn-cb-generate', function() { self.generate(); });
    NAV.bind('btn-cb-copy', function() {
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

    AI.setLoading('btn-cb-generate', true, '🤖 Generate Dispute Letter');

    try {
      var prompt = 'Write a professional chargeback dispute letter that maximizes winning chances.\n\n' +
        'Customer: ' + customer + '\n' +
        'Amount: $' + amount + '\n' +
        'Date: ' + date + '\n' +
        'Reason: ' + reason + '\n' +
        'Product/Service: ' + desc + '\n' +
        'Tracking: ' + (tracking || 'Not available') + '\n\n' +
        'Include:\n' +
        '1. Professional introduction\n' +
        '2. Clear transaction timeline\n' +
        '3. Evidence summary\n' +
        '4. Proof of delivery/service (if applicable)\n' +
        '5. Request to reverse chargeback\n' +
        '6. Professional closing\n\n' +
        'Make it compelling and legally sound.';

      var response = await AI.call(prompt);

      document.getElementById('cb-result-text').textContent = response;
      document.getElementById('cb-result').style.display = 'block';

      this.list.push({ customer: customer, amount: amount, date: date, status: 'pending' });
      this.updateStats();

    } catch(e) {
      alert('AI error. Please try again.');
    } finally {
      AI.setLoading('btn-cb-generate', false, '🤖 Generate Dispute Letter');
    }
  },

  updateStats: function() {
    var total = document.getElementById('cb-total');
    var won = document.getElementById('cb-won');
    var pending = document.getElementById('cb-pending');
    if (total) total.textContent = this.list.length;
    if (won) won.textContent = this.list.filter(function(c) { return c.status === 'won'; }).length;
    if (pending) pending.textContent = this.list.filter(function(c) { return c.status === 'pending'; }).length;
  }
};
