/* ════════════════════════════════════════════════════════
   BRITOL GROUP — Contact Forms Handling
   ════════════════════════════════════════════════════════ */

function initForms() {
  document.addEventListener('DOMContentLoaded', () => {
    // ── Quote Form ─────────────────────────
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
      quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = quoteForm.querySelector('#quoteName').value.trim();
        const email = quoteForm.querySelector('#quoteEmail').value.trim();
        const phone = quoteForm.querySelector('#quotePhone').value.trim();
        const service = quoteForm.querySelector('#quoteService').value;
        const message = quoteForm.querySelector('#quoteMessage').value.trim();
        const submitBtn = quoteForm.querySelector('button[type="submit"]');

        if (!name || !email || !phone) {
          showNotification('Please fill in all required fields.', 'error');
          return;
        }

        if (!isValidEmail(email)) {
          showNotification('Please enter a valid email address.', 'error');
          return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        try {
          await postToApi('/api/send-quote', { name, email, phone, service, message });
          showNotification('Thank you! We\'ll get back to you within 24 hours. 🎉', 'success');
          quoteForm.reset();
        } catch (err) {
          showNotification(err.message || 'Failed to send request. Please try again.', 'error');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }

    // ── Mailing List Form ──────────────────
    const mailingForm = document.getElementById('mailingForm');
    if (mailingForm) {
      mailingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = mailingForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const submitBtn = mailingForm.querySelector('button[type="submit"]');

        if (!email || !isValidEmail(email)) {
          showNotification('Please enter a valid email address.', 'error');
          return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing…';
        submitBtn.disabled = true;

        try {
          await postToApi('/api/subscribe', { email });
          showNotification('You\'re subscribed! Welcome aboard. 🌿', 'success');
          mailingForm.reset();
        } catch (err) {
          showNotification(err.message || 'Failed to subscribe. Please try again.', 'error');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }
  });
}

initForms();
