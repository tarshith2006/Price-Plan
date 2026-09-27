/**
 * SaaS Product Pricing Cards - Interactive Logic
 * Vanilla JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  const priceValues = document.querySelectorAll('.price-value');
  const billingPeriods = document.querySelectorAll('.billing-period');
  const billingNotes = document.querySelectorAll('.billing-note');
  const ctaButtons = document.querySelectorAll('.cta-btn');
  
  // Modal Elements
  const actionModal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalSummary = document.getElementById('modalSummary');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // --- Pricing Data Map ---
  const pricingData = {
    starter: {
      monthly: 9,
      yearly: 86,
      savings: '$22'
    },
    professional: {
      monthly: 29,
      yearly: 278,
      savings: '$70'
    },
    enterprise: {
      monthly: 79,
      yearly: 758,
      savings: '$190'
    }
  };

  // --- Current State ---
  let isYearly = false;

  /**
   * Updates all pricing elements and billing labels with smooth animation
   * @param {boolean} yearly - Whether yearly billing is active
   */
  function updatePricing(yearly) {
    isYearly = yearly;

    // 1. Update Toggle Button Appearance & ARIA state
    if (billingToggle) {
      billingToggle.setAttribute('aria-checked', isYearly.toString());
      if (isYearly) {
        billingToggle.classList.add('is-yearly');
      } else {
        billingToggle.classList.remove('is-yearly');
      }
    }

    // 2. Update Label Highlights
    if (monthlyLabel && yearlyLabel) {
      if (isYearly) {
        monthlyLabel.classList.remove('active');
        yearlyLabel.classList.add('active');
      } else {
        monthlyLabel.classList.add('active');
        yearlyLabel.classList.remove('active');
      }
    }

    // 3. Animate and Update Pricing Figures
    priceValues.forEach((elem) => {
      const plan = elem.getAttribute('data-plan');
      const planInfo = pricingData[plan];
      if (!planInfo) return;

      // Add animation fade class
      elem.classList.add('animating');

      setTimeout(() => {
        // Swap price numeral
        elem.textContent = isYearly ? planInfo.yearly : planInfo.monthly;
        elem.classList.remove('animating');
      }, 150);
    });

    // 4. Update Billing Period Text (/month vs /year)
    billingPeriods.forEach((elem) => {
      elem.textContent = isYearly ? '/year' : '/month';
    });

    // 5. Update Billing Notes (e.g., Annual savings information)
    billingNotes.forEach((elem) => {
      const monthlyNote = elem.getAttribute('data-monthly-note') || 'Billed monthly';
      const yearlyNote = elem.getAttribute('data-yearly-note') || 'Billed annually';
      elem.textContent = isYearly ? yearlyNote : monthlyNote;
    });
  }

  /**
   * Toggles the billing frequency state
   */
  function toggleBilling() {
    updatePricing(!isYearly);
  }

  // --- Event Listeners for Billing Toggle ---
  if (billingToggle) {
    // Click toggle button
    billingToggle.addEventListener('click', toggleBilling);

    // Keyboard accessibility: Enter or Space triggers toggle
    billingToggle.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        toggleBilling();
      }
    });
  }

  // Click on "Monthly" label switches to monthly
  if (monthlyLabel) {
    monthlyLabel.addEventListener('click', () => {
      if (isYearly) updatePricing(false);
    });
  }

  // Click on "Yearly" label or "Save 20%" badge switches to yearly
  if (yearlyLabel) {
    yearlyLabel.addEventListener('click', () => {
      if (!isYearly) updatePricing(true);
    });
  }

  const discountBadge = document.getElementById('discountBadge');
  if (discountBadge) {
    discountBadge.addEventListener('click', () => {
      if (!isYearly) updatePricing(true);
    });
  }

  // --- CTA Button Handlers & Feedback Dialog ---
  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const planTitle = btn.getAttribute('data-plan-title') || 'Plan';
      const planKey = planTitle.toLowerCase();
      const planInfo = pricingData[planKey] || { monthly: 0, yearly: 0 };
      const currentPrice = isYearly ? planInfo.yearly : planInfo.monthly;
      const billingCadence = isYearly ? 'year' : 'month';

      // Populate modal dialog
      if (modalTitle && modalMessage && modalSummary && actionModal) {
        modalTitle.textContent = `${planTitle} Plan Selected`;
        
        if (planKey === 'professional') {
          modalMessage.textContent = 'Great choice! You have chosen our most popular plan with team collaboration features.';
        } else if (planKey === 'enterprise') {
          modalMessage.textContent = 'An enterprise solutions specialist will contact you shortly with custom onboarding terms.';
        } else {
          modalMessage.textContent = 'Welcome aboard! Get started immediately with full access to core features.';
        }

        modalSummary.innerHTML = `
          <div><strong>Plan:</strong> ${planTitle}</div>
          <div><strong>Price:</strong> $${currentPrice}/${billingCadence}</div>
          <div><strong>Billing:</strong> ${isYearly ? 'Annual billing (Includes 20% discount)' : 'Monthly recurring'}</div>
        `;

        actionModal.classList.add('is-active');
        actionModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Modal Close Handlers
  function closeModal() {
    if (actionModal) {
      actionModal.classList.remove('is-active');
      actionModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (actionModal) {
    actionModal.addEventListener('click', (e) => {
      if (e.target === actionModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && actionModal && actionModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Initial setup: Ensure Monthly is default
  updatePricing(false);
});
