const NAV = {
  pages: [
    'page-landing', 'page-login', 'page-signup',
    'page-forgot', 'page-dashboard', 'page-chargeback',
    'page-fraud', 'page-leakage', 'page-platform'
  ],

  go: function(id) {
    this.pages.forEach(function(p) {
      var el = document.getElementById(p);
      if (el) el.style.display = 'none';
    });
    var target = document.getElementById(id);
    if (target) {
      target.style.display = 'block';
      window.scrollTo(0, 0);
    }
  },

  init: function() {
    var self = this;

    // Landing buttons
    self.bind('btn-start', function() { self.go('page-signup'); });
    self.bind('btn-signin', function() { self.go('page-login'); });
    self.bind('btn-to-login', function() { self.go('page-login'); });
    self.bind('btn-to-signup', function() { self.go('page-signup'); });
    self.bind('btn-to-landing', function() { self.go('page-landing'); });
    self.bind('btn-forgot', function() { self.go('page-forgot'); });
    self.bind('btn-forgot-back', function() { self.go('page-login'); });

    // Dashboard tools
    self.bind('tool-chargeback', function() { self.go('page-chargeback'); });
    self.bind('tool-fraud', function() { self.go('page-fraud'); });
    self.bind('tool-leakage', function() { self.go('page-leakage'); });
    self.bind('tool-platform', function() { self.go('page-platform'); });

    // Back buttons
    self.bind('cb-back', function() { self.go('page-dashboard'); });
    self.bind('fraud-back', function() { self.go('page-dashboard'); });
    self.bind('leakage-back', function() { self.go('page-dashboard'); });
    self.bind('platform-back', function() { self.go('page-dashboard'); });

    // Gumroad
    self.bind('btn-buy-starter', function() { window.open(CONFIG.GUMROAD.STARTER, '_blank'); });
    self.bind('btn-buy-pro', function() { window.open(CONFIG.GUMROAD.PRO, '_blank'); });
    self.bind('btn-buy-enterprise', function() { window.open(CONFIG.GUMROAD.ENTERPRISE, '_blank'); });
    self.bind('btn-upgrade', function() { window.open(CONFIG.GUMROAD.PRO, '_blank'); });
  },

  bind: function(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }
};
