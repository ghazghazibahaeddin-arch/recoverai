const AI = {
  call: async function(prompt, systemPrompt) {
    var messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    var res = await fetch(CONFIG.WORKER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7
      })
    });
    var data = await res.json();
    if (!data.choices) throw new Error('AI error');
    return data.choices[0].message.content;
  },

  callJSON: async function(prompt, systemPrompt) {
    var response = await this.call(prompt, systemPrompt || 'Return only valid JSON. No text, no markdown.');
    var start = response.indexOf('{');
    var end = response.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) throw new Error('No JSON returned');
    return JSON.parse(response.slice(start, end));
  },

  setLoading: function(btnId, loading, originalText) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Analyzing...' : originalText;
  }
};
