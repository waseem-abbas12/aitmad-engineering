/**
 * Aitmad Engineering - Request a Quote & Contact Form Handler
 * Spec: Section 7.8
 */

export class QuoteFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Clear error on input
    this.form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // 1. Honeypot check (anti-spam)
    const honeypot = this.form.querySelector('input[name="company_website_hp"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Spam submission detected by honeypot.');
      return;
    }

    // 2. Validate fields
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      const val = field.value.trim();

      if (!val) {
        isValid = false;
        if (group) group.classList.add('has-error');
      } else if (field.type === 'email' && !this.isValidEmail(val)) {
        isValid = false;
        if (group) group.classList.add('has-error');
      } else if (field.name === 'phone' && !this.isValidPhone(val)) {
        isValid = false;
        if (group) group.classList.add('has-error');
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    if (!isValid) {
      const firstError = this.form.querySelector('.form-group.has-error input, .form-group.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // 3. Loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <span>Transmitting Request...</span>
    `;

    // 4. Collect form payload
    const formData = new FormData(this.form);
    const payload = Object.fromEntries(formData.entries());

    /**
     * TODO: Connect to your backend API or Formspree endpoint:
     * Example: fetch("https://formspree.io/f/YOUR_FORM_ID", { method: "POST", body: formData })
     */
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // 5. Show Success Panel
      this.showSuccess();
    }, 1200);
  }

  showSuccess() {
    const card = this.form.closest('.contact-form-card') || this.form.parentElement;
    card.innerHTML = `
      <div style="text-align: center; padding: 48px 24px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--pine-100); color: var(--pine-700); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size: 1.6rem; color: var(--pine-800); margin-bottom: 12px;">Quote Request Received</h3>
        <p style="color: var(--steel); font-size: 0.95rem; line-height: 1.6; max-width: 480px; margin: 0 auto 28px;">
          Thank you for providing your project details. Our Senior Structural Engineering Director is reviewing your dimensional requirements and will reach out with preliminary calculations and a detailed proposal within 24 business hours.
        </p>
        <a href="https://wa.me/924235789000?text=Hello%20Aitmad%20Engineering,%20I%20just%20submitted%20a%20quote%20request%20on%20your%20website." target="_blank" rel="noopener" class="btn btn-primary">
          <span>Speed Up on WhatsApp</span>
        </a>
      </div>
    `;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    // Allows Pakistani formats: 03001234567, +923001234567, 042-35789000 etc.
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s+/g, ''));
  }
}
