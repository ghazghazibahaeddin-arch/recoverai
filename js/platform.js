const PLATFORM = {
  init: function() {
    var self = this;
    var btn = document.getElementById('btn-platform-report');
    if (btn) btn.addEventListener('click', function() { self.generateReport(); });
  },

  generateReport: async function() {
    var revenue = document.getElementById('platform-revenue').value;
    var chargebacks = document.getElementById('platform-chargebacks').value;
    var disputes = document.getElementById('platform-disputes').value;
    var subscriptions = document.getElementById('platform-subscriptions').value;

    if (!revenue) { alert('Please enter monthly revenue'); return; }

    var btn = document.getElementById('btn-platform-report');
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
      var prompt = 'You are an expert CFO. Generate a complete revenue recovery report.\n\n' +
        'Monthly Revenue: $' + revenue + '\n' +
        'Monthly Chargebacks: $' + (chargebacks || 0) + '\n' +
        'Open Disputes: ' + (disputes || 0) + '\n' +
        'Subscription Issues: ' + (subscriptions || 0) + '\n\n' +
        'Provide:\n' +
        '1. Revenue at risk analysis\n' +
        '2. Chargeback recovery recommendations\n' +
        '3. Fraud prevention priorities\n' +
        '4. Revenue leakage fixes\n' +
        '5. Expected recovery amount\n' +
        '6. 30-day action plan\n\n' +
        'Be specific with numbers and actionable steps.';

      var res = await fetch(CONFIG.WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        })
      });

      var data = await res.json();
      if (!data.choices || !data.choices[0]) {
        alert('AI error: ' + JSON.stringify(data));
        return;
      }

      document.getElementById('platform-result-text').textContent = data.choices[0].message.content;
      document.getElementById('platform-result').style.display = 'block';

    } catch(e) {
      alert('Error: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '📊 Generate Full Report';
    }
  }
};
