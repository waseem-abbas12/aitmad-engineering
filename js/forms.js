/**
 * Aitmaad Engineering - Request a Quote & Contact Form Handler
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

    // Instant WhatsApp Quote Bridge (Step 9)
    const waBridgeBtn = document.getElementById('quote-whatsapp-bridge-btn');
    if (waBridgeBtn) {
      waBridgeBtn.addEventListener('click', () => {
        const name = document.getElementById('contact_name')?.value?.trim() || 'Valued Client';
        const phone = document.getElementById('contact_phone')?.value?.trim() || 'Not provided';
        const projectType = document.getElementById('contact_project_type')?.value || 'Industrial Steel Project';
        const area = document.getElementById('contact_area')?.value?.trim() || 'Not specified';
        const location = document.getElementById('contact_location')?.value?.trim() || 'Pakistan';
        const timeline = document.getElementById('contact_timeline')?.value || 'Standard';
        const msg = document.getElementById('contact_message')?.value?.trim() || 'Preliminary Inquiry';

        const waText = encodeURIComponent(
          `Hello Aitmaad Engineering,\n\nI would like an instant preliminary quote for a steel structure:\n` +
          `• Client: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Structure Type: ${projectType}\n` +
          `• Approx Area: ${area}\n` +
          `• Site Location: ${location}\n` +
          `• Timeline: ${timeline}\n` +
          `• Requirements: ${msg}`
        );

        window.open(`https://wa.me/923004589192?text=${waText}`, '_blank', 'noopener');
      });
    }
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
      } else if (field.type === 'email' && val && !this.isValidEmail(val)) {
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
    const payload = {
      name: formData.get('name') || formData.get('contact_name') || 'Website Inquiry',
      phone: formData.get('phone') || formData.get('contact_phone') || '',
      email: formData.get('email') || formData.get('contact_email') || '',
      projectType: formData.get('project_type') || formData.get('contact_project_type') || 'Industrial PEB',
      dimensions: formData.get('area') || formData.get('contact_area') || '',
      location: formData.get('location') || formData.get('contact_location') || '',
      message: formData.get('message') || formData.get('contact_message') || ''
    };

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('Inquiry API notice:', err);
    }).finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // 5. Show Success Panel
      this.showSuccess();
    });
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
        <a href="https://wa.me/923004589192?text=Hello%20Aitmaad%20Engineering,%20I%20just%20submitted%20a%20quote%20request%20on%20your%20website." target="_blank" rel="noopener" class="btn btn-primary">
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
