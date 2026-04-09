const PLATFORM = {
  init: function() {
    var self = this;
    NAV.bind('btn-platform-report', function() { self.generateReport(); });
  },

  generateReport: async function() {
    var revenue = document.getElementById('platform-revenue').value;
    var chargebacks = document.getElementById('platform-chargebacks').value;
    var disputes = document.getElementById('platform-disputes').value;
    var subscriptions = document.getElementById('platform-subscriptions').value;

    if (!revenue) { alert('Please enter monthly revenue'); return; }

    AI.setLoading('btn-platform-report', true, '📊 Generate Report');

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

      var response = await AI.call(prompt);

      document.getElementById('platform-result-text').textContent = response;
      document.getElementById('platform-result').style.display = 'block';

    } catch(e) {
      alert('Report generation error. Please try again.');
    } finally {
      AI.setLoading('btn-platform-report', false, '📊 Generate Report');
    }
  }
};
