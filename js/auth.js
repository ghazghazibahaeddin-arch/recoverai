const AUTH = {
  user: null,

  init: function() {
    var self = this;

    // Check saved session
    var saved = localStorage.getItem('cb_user');
    if (saved) {
      try {
        self.user = JSON.parse(saved);
        self.updateUI();
        NAV.go('page-dashboard');
      } catch(e) {
        NAV.go('page-landing');
      }
    } else {
      NAV.go('page-landing');
    }

    // Login
    NAV.bind('btn-login', function() { self.login(); });

    // Signup
    NAV.bind('btn-signup', function() { self.signup(); });

    // Logout
    NAV.bind('btn-logout', function() { self.logout(); });

    // Forgot
    NAV.bind('btn-forgot-send', function() { self.forgot(); });
  },

  login: async function() {
    var email = document.getElementById('login-email').value.trim();
    var pass = document.getElementById('login-password').value;
    var btn = document.getElementById('btn-login');

    if (!email || !pass) { this.showMsg('login-error', 'Please enter email and password'); return; }

    btn.disabled = true;
    btn.textContent = 'Signing in...';

    try {
      var res = await fetch(CONFIG.SUPABASE_URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass })
      });
      var data = await res.json();
      if (data.error || data.error_description) {
        this.showMsg('login-error', 'Invalid email or password');
        return;
      }
      this.user = {
        token: data.access_token,
        email: email,
        name: data.user && data.user.user_metadata && data.user.user_metadata.full_name || email
      };
      localStorage.setItem('cb_user', JSON.stringify(this.user));
      this.updateUI();
      NAV.go('page-dashboard');
    } catch(e) {
      this.showMsg('login-error', 'Connection error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  },

  signup: async function() {
    var name = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim();
    var pass = document.getElementById('signup-password').value;
    var btn = document.getElementById('btn-signup');

    if (!name || !email || !pass) { this.showMsg('signup-error', 'Please fill all fields'); return; }
    if (pass.length < 8) { this.showMsg('signup-error', 'Password must be at least 8 characters'); return; }

    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
      var res = await fetch(CONFIG.SUPABASE_URL + '/auth/v1/signup', {
        method: 'POST',
        headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass, data: { full_name: name } })
      });
      var data = await res.json();
      if (data.error) { this.showMsg('signup-error', data.error.message || 'Signup error'); return; }
      if (data.access_token) {
        this.user = { token: data.access_token, email: email, name: name };
        localStorage.setItem('cb_user', JSON.stringify(this.user));
        this.updateUI();
        NAV.go('page-dashboard');
      } else {
        this.showMsg('signup-success', 'Account created! Check your email.');
      }
    } catch(e) {
      this.showMsg('signup-error', 'Connection error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Create Free Account';
    }
  },

  forgot: async function() {
    var email = document.getElementById('forgot-email').value.trim();
    if (!email) { this.showMsg('forgot-error', 'Please enter your email'); return; }
    try {
      await fetch(CONFIG.SUPABASE_URL + '/auth/v1/recover', {
        method: 'POST',
        headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      this.showMsg('forgot-success', 'Reset link sent! Check your email.');
    } catch(e) {
      this.showMsg('forgot-error', 'Error sending reset link');
    }
  },

  logout: function() {
    this.user = null;
    localStorage.removeItem('cb_user');
    NAV.go('page-landing');
  },

  updateUI: function() {
    var el = document.getElementById('nav-email');
    if (el && this.user) el.textContent = this.user.email;
    var gr = document.getElementById('dash-greeting');
    if (gr && this.user) gr.textContent = 'Welcome back, ' + this.user.name + ' 👋';
  },

  showMsg: function(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(function() { el.style.display = 'none'; }, 5000);
  }
};
