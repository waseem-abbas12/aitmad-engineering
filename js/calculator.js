/**
 * Aitmad Engineering - Interactive Steel Building & PEB Cost Estimator
 * Inspired by modern parametric calculators with Framer-Motion style spring feedback.
 */

(function () {
  'use strict';

  // Building specifications & calculation factors
  const BUILDING_DATA = {
    'peb-warehouse': {
      name: 'Pre-Engineered Warehouse',
      nameUrdu: 'پری انجینئرڈ گودام',
      minRate: 420,
      maxRate: 560,
      tonnagePerSqft: 0.0034, // ~3.4 kg/sq.ft in metric tons
      baseWeeks: 6,
      weekFactor: 0.00003,
      standards: 'ASTM A572 Grade 50 • FM Global Approved',
      recommendedRoof: '0.50mm Standing Seam 360° Seam',
      spanFeasibility: 'Up to 60m 100% Column-Free'
    },
    'factory-shed': {
      name: 'Industrial Factory Shed',
      nameUrdu: 'انڈسٹریل فیکٹری شیڈ',
      minRate: 480,
      maxRate: 640,
      tonnagePerSqft: 0.0042,
      baseWeeks: 7,
      weekFactor: 0.000035,
      standards: 'AWS D1.1 Certified • AISC 360 Specification',
      recommendedRoof: 'Insulated Double-Skin PUF Panel',
      spanFeasibility: 'Multi-Bay with Heavy Crane Runways'
    },
    'cold-storage': {
      name: 'Cold Storage & Agro Facility',
      nameUrdu: 'کولڈ اسٹوریج اور ایگرو پلانٹ',
      minRate: 540,
      maxRate: 720,
      tonnagePerSqft: 0.0038,
      baseWeeks: 8,
      weekFactor: 0.00004,
      standards: 'HACCP Compliant PIR Thermal Envelope',
      recommendedRoof: '100mm PIR Sandwich Panel Sub-Zero Ready',
      spanFeasibility: 'Thermal-Bridge Free Portal Frame'
    },
    'logistics-park': {
      name: 'Clear-Span Logistics Hub',
      nameUrdu: 'ہائی بے لاجسٹکس حب',
      minRate: 460,
      maxRate: 610,
      tonnagePerSqft: 0.0036,
      baseWeeks: 8,
      weekFactor: 0.00003,
      standards: 'FM2 Floor Tolerance Ready • High-Bay Racking',
      recommendedRoof: 'Single-Skin + Rockwool Acoustic Insulation',
      spanFeasibility: 'Up to 90m Continuous Clear-Span'
    }
  };

  const CRANE_FACTORS = {
    'none': { label: 'No Crane Required', multiplier: 1.0, addedTonsPer10k: 0 },
    '5ton': { label: '5 to 10 Ton Overhead Crane', multiplier: 1.14, addedTonsPer10k: 4.5 },
    '20ton': { label: '15 to 30 Ton Heavy Crane', multiplier: 1.28, addedTonsPer10k: 9.0 }
  };

  const HEIGHT_FACTORS = {
    '6m': { label: '6m (20 ft) - Standard Eave', multiplier: 1.0 },
    '9m': { label: '9m (30 ft) - High Eave', multiplier: 1.08 },
    '12m': { label: '12m (40 ft) - Extra High Bay', multiplier: 1.18 }
  };

  let currentState = {
    buildingType: 'peb-warehouse',
    area: 25000,
    height: '9m',
    crane: 'none'
  };

  function formatPKR(val) {
    if (val >= 10000000) {
      return (val / 10000000).toFixed(2) + ' Crore';
    }
    if (val >= 100000) {
      return (val / 100000).toFixed(2) + ' Lakh';
    }
    return Number(val).toLocaleString('en-PK');
  }

  function animateNumber(element, target, prefix = '', suffix = '') {
    if (!element) return;
    const start = parseFloat(element.getAttribute('data-current-val') || '0');
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      element.textContent = ${prefix};

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.setAttribute('data-current-val', target);
      }
    }

    requestAnimationFrame(update);
  }

  function calculate() {
    const bData = BUILDING_DATA[currentState.buildingType];
    const hData = HEIGHT_FACTORS[currentState.height];
    const cData = CRANE_FACTORS[currentState.crane];

    const combinedMultiplier = hData.multiplier * cData.multiplier;
    const minSqftRate = Math.round(bData.minRate * combinedMultiplier);
    const maxSqftRate = Math.round(bData.maxRate * combinedMultiplier);

    const minTotal = minSqftRate * currentState.area;
    const maxTotal = maxSqftRate * currentState.area;

    const baseTonnage = currentState.area * bData.tonnagePerSqft;
    const craneAddedTonnage = (currentState.area / 10000) * cData.addedTonsPer10k;
    const heightFactor = currentState.height === '12m' ? 1.15 : currentState.height === '9m' ? 1.08 : 1.0;
    const totalTonnage = Math.round((baseTonnage + craneAddedTonnage) * heightFactor);

    const weeks = Math.round(bData.baseWeeks + (currentState.area * bData.weekFactor) + (currentState.crane !== 'none' ? 1.5 : 0));

    const rateEl = document.getElementById('calc-rate-range');
    if (rateEl) {
      rateEl.textContent = PKR  -  / sq.ft;
    }

    const totalEl = document.getElementById('calc-total-range');
    if (totalEl) {
      totalEl.textContent = PKR  - ;
    }

    const tonnageEl = document.getElementById('calc-tonnage');
    if (tonnageEl) {
      animateNumber(tonnageEl, totalTonnage, '', ' Tons');
    }

    const timelineEl = document.getElementById('calc-timeline');
    if (timelineEl) {
      timelineEl.textContent = ${weeks} to  Weeks;
    }

    const spanEl = document.getElementById('calc-span-feasibility');
    if (spanEl) {
      spanEl.textContent = bData.spanFeasibility;
    }

    const roofEl = document.getElementById('calc-roof-spec');
    if (roofEl) {
      roofEl.textContent = bData.recommendedRoof;
    }

    const waBtn = document.getElementById('calc-whatsapp-btn');
    if (waBtn) {
      const msg = encodeURIComponent(
        Hello Aitmad Engineering,\n\nI used your Online Steel Cost Estimator:\n +
        • Building Type: \n +
        • Covered Area:  sq.ft\n +
        • Eave Height: \n +
        • Crane Spec: \n +
        • Estimated Tonnage: ~ Tons\n +
        • Est. Cost Range: PKR  - \n\n +
        Please share a formal BOQ, structural design review and timeline.
      );
      waBtn.href = https://wa.me/924235789000?text=;
    }
  }

  function initCalculator() {
    const calcRoot = document.getElementById('steel-calculator-root');
    if (!calcRoot) return;

    const typeButtons = calcRoot.querySelectorAll('.calc-type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentState.buildingType = btn.getAttribute('data-type');
        calculate();
      });
    });

    const areaSlider = document.getElementById('calc-area-slider');
    const areaInput = document.getElementById('calc-area-input');
    const areaDisplay = document.getElementById('calc-area-display');

    if (areaSlider && areaInput) {
      areaSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        currentState.area = val;
        areaInput.value = val;
        if (areaDisplay) areaDisplay.textContent = ${val.toLocaleString()} sq.ft;
        calculate();
      });

      areaInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1000) val = 1000;
        if (val > 300000) val = 300000;
        currentState.area = val;
        areaSlider.value = Math.min(Math.max(val, 5000), 150000);
        if (areaDisplay) areaDisplay.textContent = ${val.toLocaleString()} sq.ft;
        calculate();
      });
    }

    const presetPills = calcRoot.querySelectorAll('.calc-preset-pill');
    presetPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const val = parseInt(pill.getAttribute('data-sqft'), 10);
        currentState.area = val;
        if (areaSlider) areaSlider.value = Math.min(val, 150000);
        if (areaInput) areaInput.value = val;
        if (areaDisplay) areaDisplay.textContent = ${val.toLocaleString()} sq.ft;
        calculate();
      });
    });

    const heightButtons = calcRoot.querySelectorAll('.calc-height-btn');
    heightButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        heightButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentState.height = btn.getAttribute('data-height');
        calculate();
      });
    });

    const craneButtons = calcRoot.querySelectorAll('.calc-crane-btn');
    craneButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        craneButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentState.crane = btn.getAttribute('data-crane');
        calculate();
      });
    });

    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
})();
