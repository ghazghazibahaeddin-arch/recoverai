const DASHBOARD = {
  init: function() {
    // Update stats
    this.updateStats();
  },

  updateStats: function() {
    var totalEl = document.getElementById('dash-total-recovered');
    var disputesEl = document.getElementById('dash-active-disputes');
    var riskEl = document.getElementById('dash-revenue-risk');

    if (totalEl) totalEl.textContent = '$0';
    if (disputesEl) disputesEl.textContent = '0';
    if (riskEl) riskEl.textContent = '$0';
  }
};
