/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  HelpCircle, 
  ChevronDown, 
  Code2, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';

interface PlanPricing {
  monthly: number;
  yearly: number;
  savingsYearly: number;
}

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'popular' | 'best-value';
  description: string;
  pricing: PlanPricing;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary';
  featured: boolean;
  featuresHeader: string;
  features: { text: string; highlighted?: boolean }[];
  accentColor: string;
}

const PRICING_PLANS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals and freelancers getting started.',
    pricing: {
      monthly: 9,
      yearly: 86,
      savingsYearly: 22
    },
    ctaText: 'Get Started',
    ctaVariant: 'secondary',
    featured: false,
    featuresHeader: "What's included:",
    features: [
      { text: '1 User' },
      { text: '5 Projects' },
      { text: '5 GB Storage' },
      { text: 'Basic Analytics' },
      { text: 'Email Support' }
    ],
    accentColor: 'indigo'
  },
  {
    id: 'professional',
    name: 'Professional',
    badge: 'POPULAR',
    badgeType: 'popular',
    description: 'For fast-growing teams seeking scalable power.',
    pricing: {
      monthly: 29,
      yearly: 278,
      savingsYearly: 70
    },
    ctaText: 'Start Free Trial',
    ctaVariant: 'primary',
    featured: true,
    featuresHeader: 'Everything in Starter, plus:',
    features: [
      { text: 'Up to 5 Users', highlighted: true },
      { text: 'Unlimited Projects', highlighted: true },
      { text: '50 GB Storage' },
      { text: 'Advanced Analytics' },
      { text: 'Priority Support' },
      { text: 'Custom Integrations' }
    ],
    accentColor: 'indigo'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'BEST VALUE',
    badgeType: 'best-value',
    description: 'For large organizations requiring bespoke controls.',
    pricing: {
      monthly: 79,
      yearly: 758,
      savingsYearly: 190
    },
    ctaText: 'Contact Sales',
    ctaVariant: 'secondary',
    featured: false,
    featuresHeader: 'Everything in Pro, plus:',
    features: [
      { text: 'Unlimited Users', highlighted: true },
      { text: 'Unlimited Projects' },
      { text: '500 GB Storage' },
      { text: 'Advanced Analytics' },
      { text: '24/7 Priority Support' },
      { text: 'Custom Integrations' },
      { text: 'Dedicated Account Manager' }
    ],
    accentColor: 'amber'
  }
];

const FAQS = [
  {
    q: 'Can I change or cancel my plan anytime?',
    a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account billing settings with zero lock-in contracts.'
  },
  {
    q: 'How does the 14-day free trial work?',
    a: 'You get full unlimited access to all features on the Professional plan for 14 days. No credit card is required to begin, and you can switch to any tier when you are ready.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank wire transfers for Enterprise annual accounts.'
  },
  {
    q: 'What happens if my team outgrows our plan storage?',
    a: 'You can easily add storage add-on packs at $5 per 50 GB or upgrade seamlessly to the next tier without any system downtime or data migration headaches.'
  }
];

export default function App() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [animatingPrices, setAnimatingPrices] = useState<boolean>(false);
  const [selectedPlanModal, setSelectedPlanModal] = useState<PricingTier | null>(null);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Trigger smooth number animation whenever billing toggle changes
  const handleToggleBilling = () => {
    setAnimatingPrices(true);
    setIsYearly(prev => !prev);
    setTimeout(() => {
      setAnimatingPrices(false);
    }, 200);
  };

  const handleSelectPlan = (plan: PricingTier) => {
    setSelectedPlanModal(plan);
  };

  const copyToClipboard = (text: string, fileKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileKey);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Raw file contents for the code viewer modal
  const vanillaHtmlCode = `<!-- File: pricing-cards/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Product Pricing Cards</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <main class="pricing-container">
    <header class="pricing-header">
      <span class="product-badge">PRICING PLANS</span>
      <h1 class="main-heading">Choose the Perfect Plan for You</h1>
      <p class="sub-heading">Simple, transparent pricing designed to grow with your business.</p>
      
      <div class="toggle-container">
        <span class="toggle-label active" id="monthly-label">Monthly</span>
        <button class="billing-toggle" id="billingToggle" role="switch" aria-checked="false">
          <span class="toggle-circle"></span>
        </button>
        <div class="yearly-option">
          <span class="toggle-label" id="yearly-label">Yearly</span>
          <span class="discount-badge" id="discountBadge">Save 20%</span>
        </div>
      </div>
    </header>

    <section class="pricing-grid">
      <!-- Starter Card -->
      <article class="pricing-card">
        <div class="card-inner">
          <h2 class="plan-name">Starter</h2>
          <p class="plan-desc">For individuals and freelancers getting started.</p>
          <div class="pricing-box">
            <span class="currency-symbol">$</span>
            <span class="price-value" data-plan="starter">9</span>
            <span class="billing-period">/month</span>
          </div>
          <p class="billing-note">Billed monthly</p>
          <button class="btn btn-secondary cta-btn" data-plan-title="Starter">Get Started</button>
          <div class="card-divider"></div>
          <ul class="features-list">
            <li>1 User</li>
            <li>5 Projects</li>
            <li>5 GB Storage</li>
            <li>Basic Analytics</li>
            <li>Email Support</li>
          </ul>
        </div>
      </article>

      <!-- Professional Card (Popular) -->
      <article class="pricing-card featured">
        <div class="badge-ribbon popular-ribbon">POPULAR</div>
        <div class="card-inner">
          <h2 class="plan-name">Professional</h2>
          <p class="plan-desc">For fast-growing teams seeking scalable power.</p>
          <div class="pricing-box">
            <span class="currency-symbol">$</span>
            <span class="price-value" data-plan="professional">29</span>
            <span class="billing-period">/month</span>
          </div>
          <p class="billing-note">Billed monthly</p>
          <button class="btn btn-primary cta-btn" data-plan-title="Professional">Start Free Trial</button>
          <div class="card-divider"></div>
          <ul class="features-list">
            <li><strong>Up to 5 Users</strong></li>
            <li><strong>Unlimited Projects</strong></li>
            <li>50 GB Storage</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
            <li>Custom Integrations</li>
          </ul>
        </div>
      </article>

      <!-- Enterprise Card (Best Value) -->
      <article class="pricing-card">
        <div class="badge-ribbon best-value-ribbon">BEST VALUE</div>
        <div class="card-inner">
          <h2 class="plan-name">Enterprise</h2>
          <p class="plan-desc">For large organizations requiring bespoke controls.</p>
          <div class="pricing-box">
            <span class="currency-symbol">$</span>
            <span class="price-value" data-plan="enterprise">79</span>
            <span class="billing-period">/month</span>
          </div>
          <p class="billing-note">Billed monthly</p>
          <button class="btn btn-secondary cta-btn" data-plan-title="Enterprise">Contact Sales</button>
          <div class="card-divider"></div>
          <ul class="features-list">
            <li><strong>Unlimited Users</strong></li>
            <li>Unlimited Projects</li>
            <li>500 GB Storage</li>
            <li>Advanced Analytics</li>
            <li>24/7 Priority Support</li>
            <li>Custom Integrations</li>
            <li>Dedicated Account Manager</li>
          </ul>
        </div>
      </article>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

  const vanillaCssCode = `/* File: pricing-cards/style.css */
:root {
  --font-family: 'Plus Jakarta Sans', sans-serif;
  --color-bg-base: #0a0e17;
  --color-bg-card: rgba(18, 24, 38, 0.85);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-primary: #6366f1;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-bg-base);
  color: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 4rem 1.5rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}

.pricing-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2.25rem 2rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
}

.pricing-card.featured {
  background: rgba(22, 28, 52, 0.92);
  border-color: rgba(99, 102, 241, 0.45);
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
}

.pricing-card.featured:hover {
  transform: translateY(-14px);
}

.badge-ribbon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.popular-ribbon {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
}

.best-value-ribbon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #0b0f19;
}

.btn {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.02);
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  border: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
  border: 1px solid var(--color-border);
}

@media (max-width: 1024px) {
  .pricing-grid { grid-template-columns: 1fr; }
}`;

  const vanillaJsCode = `// File: pricing-cards/script.js
document.addEventListener('DOMContentLoaded', () => {
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  const priceValues = document.querySelectorAll('.price-value');
  const billingPeriods = document.querySelectorAll('.billing-period');

  const pricingData = {
    starter: { monthly: 9, yearly: 86 },
    professional: { monthly: 29, yearly: 278 },
    enterprise: { monthly: 79, yearly: 758 }
  };

  let isYearly = false;

  function updatePricing(yearly) {
    isYearly = yearly;
    billingToggle.setAttribute('aria-checked', isYearly.toString());
    billingToggle.classList.toggle('is-yearly', isYearly);
    monthlyLabel.classList.toggle('active', !isYearly);
    yearlyLabel.classList.toggle('active', isYearly);

    priceValues.forEach(elem => {
      const plan = elem.getAttribute('data-plan');
      const planInfo = pricingData[plan];
      if (!planInfo) return;
      elem.textContent = isYearly ? planInfo.yearly : planInfo.monthly;
    });

    billingPeriods.forEach(elem => {
      elem.textContent = isYearly ? '/year' : '/month';
    });
  }

  billingToggle.addEventListener('click', () => updatePricing(!isYearly));
  monthlyLabel.addEventListener('click', () => updatePricing(false));
  yearlyLabel.addEventListener('click', () => updatePricing(true));
});`;

  return (
    <div className="relative min-h-screen bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Ambient background decorative glow lights */}
      <div 
        className="pointer-events-none fixed top-[-140px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-indigo-600/25 via-indigo-900/10 to-transparent blur-[140px] z-0" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none fixed bottom-[-100px] right-[5%] w-[550px] h-[450px] rounded-full bg-gradient-to-t from-emerald-600/15 via-emerald-900/5 to-transparent blur-[140px] z-0" 
        aria-hidden="true" 
      />

      {/* Top Bar Navigation conforming to strict Top Bar Contract */}
      <nav className="relative z-10 border-b border-white/[0.08] backdrop-blur-md bg-[#080c14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black text-sm">
              S
            </span>
            <span>Stratum Cloud</span>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#plans" className="text-white hover:text-indigo-400 transition-colors">Pricing Plans</a>
            <button 
              onClick={() => setShowComparison(prev => !prev)} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Comparison Matrix
            </button>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#guarantee" className="hover:text-white transition-colors">Guarantee</a>
          </div>

          {/* Zone 3: Primary actions + View Code modal trigger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCodeModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Inspect separate HTML, CSS & Vanilla JS code"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Source Files</span>
            </button>
            <button 
              onClick={() => handleSelectPlan(PRICING_PLANS[1])}
              className="hidden sm:inline-flex px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        
        {/* Header Section */}
        <header className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full uppercase mb-4">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>PRICING PLANS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
            Choose the Perfect Plan for You
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed text-balance">
            Simple, transparent pricing designed to grow with your business.
          </p>

          {/* Billing Frequency Toggle */}
          <div className="mt-8 inline-flex items-center justify-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-full backdrop-blur-md shadow-inner">
            <button 
              type="button"
              onClick={() => isYearly && handleToggleBilling()}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                !isYearly ? 'text-white bg-white/[0.1] shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>

            {/* Slider Switch Button */}
            <button 
              type="button"
              role="switch"
              aria-checked={isYearly}
              onClick={handleToggleBilling}
              title="Toggle between monthly and yearly billing"
              className={`relative mx-2 w-13 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isYearly ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <button 
              type="button"
              onClick={() => !isYearly && handleToggleBilling()}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                isYearly ? 'text-white bg-white/[0.1] shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[0.68rem] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                Save 20%
              </span>
            </button>
          </div>
        </header>

        {/* Pricing Cards Grid */}
        <section id="plans" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {PRICING_PLANS.map((plan) => {
            const currentPrice = isYearly ? plan.pricing.yearly : plan.pricing.monthly;
            const billingCadence = isYearly ? '/year' : '/month';
            const savingsNote = isYearly ? `Save $${plan.pricing.savingsYearly} billed annually` : 'Billed monthly';

            return (
              <article 
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 backdrop-blur-xl pricing-card-lift ${
                  plan.featured 
                    ? 'bg-[#12192c]/90 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-950/40 lg:-translate-y-2' 
                    : 'bg-[#101624]/80 border border-white/[0.08] shadow-xl hover:border-white/[0.18]'
                }`}
              >
                {/* Badges: POPULAR for Pro, BEST VALUE for Enterprise */}
                {plan.badge && (
                  <div 
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wider uppercase shadow-lg ${
                      plan.badgeType === 'popular'
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border border-indigo-400/40 shadow-indigo-950/80'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-amber-950/50'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                      {plan.name}
                    </h2>
                    <p className="text-sm text-slate-400 min-h-[40px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Value */}
                  <div className="mb-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-200 leading-none">$</span>
                      <span 
                        className={`text-5xl font-extrabold text-white tracking-tight tabular-nums transition-all duration-200 ${
                          animatingPrices ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        {currentPrice}
                      </span>
                      <span className="text-base font-medium text-slate-400 ml-1">
                        {billingCadence}
                      </span>
                    </div>
                  </div>

                  {/* Billing note */}
                  <p className="text-xs font-medium text-slate-500 mb-6">
                    {savingsNote}
                  </p>

                  {/* Primary / Secondary Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      plan.featured 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]' 
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Hairline Divider */}
                  <div className="h-px w-full bg-white/[0.08] my-6" />

                  {/* Features List Header */}
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    {plan.featuresHeader}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                        <span 
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            plan.featured 
                              ? 'bg-indigo-500/20 text-indigo-400' 
                              : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span className={feature.highlighted ? 'text-white font-semibold' : ''}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subdued footer indicator for each card */}
                <div className="mt-8 pt-4 border-t border-white/[0.05] text-[0.78rem] text-slate-500 flex items-center justify-between">
                  <span>Activation</span>
                  <span className="text-emerald-400 font-medium">Instant Access</span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Feature Comparison Accordion Toggle */}
        <div className="text-center mb-16">
          <button 
            onClick={() => setShowComparison(prev => !prev)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-sm font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{showComparison ? 'Hide Detailed Plan Comparison' : 'Compare All Plan Features in Detail'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showComparison ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Plan Comparison Table Section */}
        {showComparison && (
          <section className="mb-20 bg-[#101624]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Detailed Feature Matrix</h3>
            <p className="text-sm text-slate-400 mb-6">Side-by-side technical breakdown across all tiers.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.1] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Feature / Spec</th>
                    <th className="py-3 px-4 font-semibold text-slate-200">Starter</th>
                    <th className="py-3 px-4 font-semibold text-indigo-400">Professional</th>
                    <th className="py-3 px-4 font-semibold text-amber-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Team Members</td>
                    <td className="py-3.5 px-4">1 User</td>
                    <td className="py-3.5 px-4 font-semibold text-white">Up to 5 Users</td>
                    <td className="py-3.5 px-4 font-semibold text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Active Projects</td>
                    <td className="py-3.5 px-4">5 Projects</td>
                    <td className="py-3.5 px-4 font-semibold text-white">Unlimited</td>
                    <td className="py-3.5 px-4 font-semibold text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Cloud Storage</td>
                    <td className="py-3.5 px-4">5 GB</td>
                    <td className="py-3.5 px-4">50 GB</td>
                    <td className="py-3.5 px-4 font-semibold text-white">500 GB</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Analytics Depth</td>
                    <td className="py-3.5 px-4">Basic Summary</td>
                    <td className="py-3.5 px-4">Advanced Real-Time</td>
                    <td className="py-3.5 px-4 font-semibold text-white">Custom BI & Exports</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Support SLA</td>
                    <td className="py-3.5 px-4">Email (24-48h)</td>
                    <td className="py-3.5 px-4">Priority (4h response)</td>
                    <td className="py-3.5 px-4 font-semibold text-white">24/7 Dedicated + SLA</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Custom Integrations</td>
                    <td className="py-3.5 px-4 text-slate-600">—</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Included</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Included + Webhooks</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-white">Dedicated Account Rep</td>
                    <td className="py-3.5 px-4 text-slate-600">—</td>
                    <td className="py-3.5 px-4 text-slate-600">—</td>
                    <td className="py-3.5 px-4 text-amber-400 font-medium">Personal Specialist</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Trust Badges Bar */}
        <section id="guarantee" className="mb-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-400 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>14-day money-back guarantee</span>
            </div>
            <span className="hidden sm:inline text-white/20">·</span>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>Cancel or switch plans anytime</span>
            </div>
            <span className="hidden sm:inline text-white/20">·</span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>No credit card required for trial</span>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section id="faq" className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Everything you need to know about our subscriptions and billing.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] pt-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Stratum Cloud Technologies</span>
            <span>— Precision SaaS Subscription Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
        </div>
      </footer>

      {/* Interactive Plan Selected Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#111827] border border-white/[0.12] rounded-2xl p-6 sm:p-7 shadow-2xl text-center">
            
            <button
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/35 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Ready to start with {selectedPlanModal.name}?
            </h3>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {selectedPlanModal.id === 'enterprise' 
                ? 'An enterprise account specialist will reach out to schedule an executive deployment demo.'
                : selectedPlanModal.id === 'professional'
                ? 'Your 14-day full feature trial is activated immediately. No credit card is required.'
                : 'Your Starter account is prepared with full access to project workspaces.'}
            </p>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-left text-sm mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Plan:</span>
                <span className="text-white font-semibold">{selectedPlanModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing Frequency:</span>
                <span className="text-white font-medium">{isYearly ? 'Annual (20% Discounted)' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-2">
                <span className="text-slate-300 font-medium">Investment:</span>
                <span className="text-indigo-400 font-bold text-base">
                  ${isYearly ? selectedPlanModal.pricing.yearly : selectedPlanModal.pricing.monthly}
                  <span className="text-xs text-slate-400 font-normal"> / {isYearly ? 'year' : 'month'}</span>
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-white/[0.1] text-sm font-semibold text-slate-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Viewer Modal (HTML, CSS, JS separate files inspection) */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0d121f] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Vanilla Codebase (HTML / CSS / JS)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Separated files located in <code className="text-indigo-300">/pricing-cards/</code> directory.
                </p>
              </div>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code Tabs */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 bg-[#0a0e19]">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeCodeTab === 'html'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  index.html
                </button>
                <button
                  onClick={() => setActiveCodeTab('css')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeCodeTab === 'css'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  style.css
                </button>
                <button
                  onClick={() => setActiveCodeTab('js')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeCodeTab === 'js'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  script.js
                </button>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const content = 
                    activeCodeTab === 'html' ? vanillaHtmlCode : 
                    activeCodeTab === 'css' ? vanillaCssCode : vanillaJsCode;
                  copyToClipboard(content, activeCodeTab);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                {copiedFile === activeCodeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy {activeCodeTab.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-[#070a12] leading-relaxed">
              <pre>
                <code>
                  {activeCodeTab === 'html' && vanillaHtmlCode}
                  {activeCodeTab === 'css' && vanillaCssCode}
                  {activeCodeTab === 'js' && vanillaJsCode}
                </code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0a0e19] flex justify-between items-center text-xs text-slate-400">
              <span>Pure Vanilla HTML5, CSS3, and JavaScript — No frameworks or external dependencies.</span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
