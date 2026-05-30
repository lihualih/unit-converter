/* ============================================
   Unit & Currency Converter - Common JS
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // Theme Management
  // ============================================
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      this.apply(theme);
      this.bindToggle();
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.updateToggleIcon(theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      this.apply(next);
    },

    updateToggleIcon(theme) {
      const btns = document.querySelectorAll('.theme-toggle');
      btns.forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    },

    bindToggle() {
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });
    }
  };

  // ============================================
  // Mobile Menu
  // ============================================
  const MobileMenu = {
    init() {
      const toggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('.nav');
      if (toggle && nav) {
        toggle.addEventListener('click', () => {
          nav.classList.toggle('active');
          toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.header-inner')) {
            nav.classList.remove('active');
          }
        });
      }
    }
  };

  // ============================================
  // Number Formatting
  // ============================================
  const NumberUtil = {
    format(num, decimals) {
      if (num === 0) return '0';
      if (isNaN(num) || !isFinite(num)) return 'Invalid';

      const absNum = Math.abs(num);

      // Auto-determine decimal places if not specified
      if (decimals === undefined) {
        if (absNum >= 1000000) decimals = 2;
        else if (absNum >= 100) decimals = 4;
        else if (absNum >= 1) decimals = 6;
        else if (absNum >= 0.01) decimals = 8;
        else decimals = 10;
      }

      // Use toLocaleString for large numbers
      if (absNum >= 1000 && decimals <= 4) {
        return num.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals
        });
      }

      // Remove trailing zeros
      return parseFloat(num.toFixed(decimals)).toString();
    },

    parse(str) {
      const cleaned = str.replace(/[^0-9.\-e+]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    },

    formatCurrency(num) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });
    }
  };

  // ============================================
  // Converter Engine
  // ============================================
  class Converter {
    constructor(options) {
      this.inputEl = document.getElementById(options.inputId);
      this.outputEl = document.getElementById(options.outputId);
      this.fromEl = document.getElementById(options.fromId);
      this.toEl = document.getElementById(options.toId);
      this.resultEl = document.getElementById(options.resultId);
      this.swapBtn = document.querySelector(options.swapSelector || '.swap-btn-center .swap-btn');
      this.convertFn = options.convertFn;
      this.units = options.units;

      if (this.inputEl && this.outputEl && this.fromEl && this.toEl) {
        this.init();
      }
    }

    init() {
      // Real-time conversion
      this.inputEl.addEventListener('input', () => this.convert());
      this.fromEl.addEventListener('change', () => this.convert());
      this.toEl.addEventListener('change', () => this.convert());

      // Swap button
      if (this.swapBtn) {
        this.swapBtn.addEventListener('click', () => this.swap());
      }

      // Initial conversion
      if (this.inputEl.value) {
        this.convert();
      }

      // Select all on focus
      this.inputEl.addEventListener('focus', () => this.inputEl.select());
    }

    convert() {
      const value = NumberUtil.parse(this.inputEl.value);
      const from = this.fromEl.value;
      const to = this.toEl.value;

      if (this.inputEl.value === '' || this.inputEl.value === '-') {
        this.outputEl.value = '';
        if (this.resultEl) this.resultEl.innerHTML = '';
        return;
      }

      const result = this.convertFn(value, from, to);
      this.outputEl.value = NumberUtil.format(result);

      if (this.resultEl) {
        const fromUnit = this.units[from] || from;
        const toUnit = this.units[to] || to;
        this.resultEl.innerHTML = `
          <div class="result-label">Result</div>
          <div class="result-value">${NumberUtil.format(result)} ${toUnit}</div>
          <div class="result-formula">${NumberUtil.format(value)} ${fromUnit} = ${NumberUtil.format(result)} ${toUnit}</div>
        `;
      }
    }

    swap() {
      const tempVal = this.fromEl.value;
      this.fromEl.value = this.toEl.value;
      this.toEl.value = tempVal;

      // Also swap input/output values
      const tempInput = this.inputEl.value;
      this.inputEl.value = this.outputEl.value;

      this.convert();
    }
  }

  // ============================================
  // Conversion Functions
  // ============================================
  const ConversionFunctions = {
    // Length conversions - all to meters as base
    length(value, from, to) {
      const toMeters = {
        m: 1, km: 1000, mi: 1609.344, ft: 0.3048,
        'in': 0.0254, cm: 0.01, mm: 0.001, yd: 0.9144
      };
      const meters = value * toMeters[from];
      return meters / toMeters[to];
    },

    // Weight conversions - all to kg as base
    weight(value, from, to) {
      const toKg = {
        kg: 1, g: 0.001, lb: 0.45359237, oz: 0.028349523,
        ton: 1000, st: 6.35029
      };
      const kg = value * toKg[from];
      return kg / toKg[to];
    },

    // Temperature conversions
    temperature(value, from, to) {
      // Convert to Celsius first
      let celsius;
      switch (from) {
        case 'C': celsius = value; break;
        case 'F': celsius = (value - 32) * 5/9; break;
        case 'K': celsius = value - 273.15; break;
        default: celsius = value;
      }
      // Convert from Celsius to target
      switch (to) {
        case 'C': return celsius;
        case 'F': return celsius * 9/5 + 32;
        case 'K': return celsius + 273.15;
        default: return celsius;
      }
    },

    // Speed conversions - all to m/s as base
    speed(value, from, to) {
      const toMs = {
        'km/h': 1/3.6, mph: 0.44704, 'm/s': 1, knots: 0.514444
      };
      const ms = value * toMs[from];
      return ms / toMs[to];
    },

    // Area conversions - all to sq meters as base
    area(value, from, to) {
      const toSqM = {
        'sq m': 1, 'sq ft': 0.09290304, 'sq km': 1000000,
        acres: 4046.8564224, hectares: 10000
      };
      const sqm = value * toSqM[from];
      return sqm / toSqM[to];
    },

    // Volume conversions - all to liters as base
    volume(value, from, to) {
      const toLiters = {
        liters: 1, gallons: 3.78541, ml: 0.001,
        cups: 0.236588, 'fl oz': 0.0295735
      };
      const liters = value * toLiters[from];
      return liters / toLiters[to];
    },

    // Data storage conversions - all to bytes as base
    data(value, from, to) {
      const toBytes = {
        bytes: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776
      };
      const bytes = value * toBytes[from];
      return bytes / toBytes[to];
    },

    // Time conversions - all to seconds as base
    time(value, from, to) {
      const toSeconds = {
        seconds: 1, minutes: 60, hours: 3600,
        days: 86400, weeks: 604800, years: 31536000
      };
      const seconds = value * toSeconds[from];
      return seconds / toSeconds[to];
    }
  };

  // ============================================
  // Currency Converter (Special - uses API)
  // ============================================
  class CurrencyConverter {
    constructor() {
      this.inputEl = document.getElementById('input-value');
      this.outputEl = document.getElementById('output-value');
      this.fromEl = document.getElementById('from-unit');
      this.toEl = document.getElementById('to-unit');
      this.resultEl = document.getElementById('result-display');
      this.swapBtn = document.querySelector('.swap-btn-center .swap-btn');
      this.rates = null;
      this.lastUpdate = null;
      this.statusEl = document.getElementById('rate-status');

      this.init();
    }

    async init() {
      if (!this.inputEl) return;

      // Bind events
      this.inputEl.addEventListener('input', () => this.convert());
      this.fromEl.addEventListener('change', () => this.convert());
      this.toEl.addEventListener('change', () => this.convert());

      if (this.swapBtn) {
        this.swapBtn.addEventListener('click', () => this.swap());
      }

      this.inputEl.addEventListener('focus', () => this.inputEl.select());

      // Fetch rates
      await this.fetchRates();

      // Auto-refresh every 30 minutes
      setInterval(() => this.fetchRates(), 30 * 60 * 1000);
    }

    async fetchRates() {
      try {
        if (this.statusEl) {
          this.statusEl.innerHTML = '<span class="status-dot"></span> Fetching rates...';
        }

        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();

        if (data.result === 'success') {
          this.rates = data.rates;
          this.lastUpdate = new Date(data.time_last_update_utc);

          if (this.statusEl) {
            this.statusEl.innerHTML = `<span class="status-dot online"></span> Rates updated: ${this.lastUpdate.toLocaleString()}`;
          }

          // Do initial conversion if value exists
          if (this.inputEl.value) {
            this.convert();
          }
        } else {
          throw new Error('API returned error');
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
        if (this.statusEl) {
          this.statusEl.innerHTML = '<span class="status-dot offline"></span> Could not fetch live rates. Try again later.';
        }
        // Use fallback rates
        this.rates = {
          USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.36,
          AUD: 1.53, CHF: 0.88, CNY: 7.24, INR: 83.12, MXN: 17.15,
          BRL: 4.97, KRW: 1325.50, SEK: 10.42, NOK: 10.55, DKK: 6.88,
          NZD: 1.63, SGD: 1.34, HKD: 7.82, TRY: 27.50, ZAR: 18.65,
          RUB: 91.50, PLN: 4.05, THB: 35.20, IDR: 15450, MYR: 4.65,
          PHP: 55.80, TWD: 31.50, ARS: 350, CLP: 880, COP: 3950,
          EGP: 30.90, NGN: 780, PKR: 285, BDT: 110, VND: 24350
        };
      }
    }

    convert() {
      if (!this.rates) return;

      const value = NumberUtil.parse(this.inputEl.value);
      const from = this.fromEl.value;
      const to = this.toEl.value;

      if (this.inputEl.value === '' || this.inputEl.value === '-') {
        this.outputEl.value = '';
        if (this.resultEl) this.resultEl.innerHTML = '';
        return;
      }

      // Convert: from USD -> target, or target -> USD -> target
      const inUSD = value / this.rates[from];
      const result = inUSD * this.rates[to];

      this.outputEl.value = NumberUtil.formatCurrency(result);

      if (this.resultEl) {
        const rate = this.rates[to] / this.rates[from];
        this.resultEl.innerHTML = `
          <div class="result-label">Result</div>
          <div class="result-value">${NumberUtil.formatCurrency(result)} ${to}</div>
          <div class="result-formula">1 ${from} = ${NumberUtil.format(rate)} ${to} | ${NumberUtil.formatCurrency(value)} ${from} = ${NumberUtil.formatCurrency(result)} ${to}</div>
        `;
      }
    }

    swap() {
      const temp = this.fromEl.value;
      this.fromEl.value = this.toEl.value;
      this.toEl.value = temp;

      const tempInput = this.inputEl.value;
      this.inputEl.value = this.outputEl.value;

      this.convert();
    }
  }

  // ============================================
  // Quick Converter (Homepage)
  // ============================================
  const QuickConverter = {
    converters: {
      currency: { fn: null, units: {} },
      length: {
        fn: ConversionFunctions.length,
        units: { m: 'meters', km: 'kilometers', mi: 'miles', ft: 'feet', 'in': 'inches', cm: 'centimeters' }
      },
      weight: {
        fn: ConversionFunctions.weight,
        units: { kg: 'kilograms', lb: 'pounds', oz: 'ounces', g: 'grams' }
      },
      temperature: {
        fn: ConversionFunctions.temperature,
        units: { C: '°C', F: '°F', K: 'K' }
      }
    },

    init() {
      const typeSelect = document.getElementById('quick-type');
      if (!typeSelect) return;

      typeSelect.addEventListener('change', () => this.updateUnits());
      this.updateUnits();

      const inputEl = document.getElementById('quick-input');
      const fromEl = document.getElementById('quick-from');
      const toEl = document.getElementById('quick-to');
      const resultEl = document.getElementById('quick-result');
      const swapBtn = document.getElementById('quick-swap');

      const doConvert = () => {
        const type = typeSelect.value;
        const converter = this.converters[type];
        if (!converter.fn) return;

        const value = NumberUtil.parse(inputEl.value);
        if (inputEl.value === '') {
          resultEl.innerHTML = '<span class="result-value">0</span>';
          return;
        }

        const result = converter.fn(value, fromEl.value, toEl.value);
        const fromUnit = converter.units[fromEl.value] || fromEl.value;
        const toUnit = converter.units[toEl.value] || toEl.value;
        resultEl.innerHTML = `<span class="result-value">${NumberUtil.format(result)}</span> ${toUnit}`;
      };

      inputEl.addEventListener('input', doConvert);
      fromEl.addEventListener('change', doConvert);
      toEl.addEventListener('change', doConvert);

      if (swapBtn) {
        swapBtn.addEventListener('click', () => {
          const temp = fromEl.value;
          fromEl.value = toEl.value;
          toEl.value = temp;
          doConvert();
        });
      }
    },

    updateUnits() {
      const type = document.getElementById('quick-type').value;
      const fromEl = document.getElementById('quick-from');
      const toEl = document.getElementById('quick-to');
      const converter = this.converters[type];

      fromEl.innerHTML = '';
      toEl.innerHTML = '';

      Object.entries(converter.units).forEach(([key, label]) => {
        fromEl.add(new Option(label, key));
        toEl.add(new Option(label, key));
      });

      // Set default "to" to second option
      if (toEl.options.length > 1) toEl.selectedIndex = 1;

      // Trigger conversion
      const inputEl = document.getElementById('quick-input');
      if (inputEl.value) inputEl.dispatchEvent(new Event('input'));
    }
  };

  // ============================================
  // Initialize Everything
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();

    // Page-specific initialization based on body data attribute
    const page = document.body.getAttribute('data-page');

    switch (page) {
      case 'home':
        QuickConverter.init();
        break;
      case 'currency':
        new CurrencyConverter();
        break;
      case 'length':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.length,
          units: { m: 'meters', km: 'kilometers', mi: 'miles', ft: 'feet', 'in': 'inches', cm: 'centimeters', mm: 'millimeters', yd: 'yards' }
        });
        break;
      case 'weight':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.weight,
          units: { kg: 'kilograms', g: 'grams', lb: 'pounds', oz: 'ounces', ton: 'metric tons', st: 'stones' }
        });
        break;
      case 'temperature':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.temperature,
          units: { C: '°C', F: '°F', K: 'Kelvin' }
        });
        break;
      case 'speed':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.speed,
          units: { 'km/h': 'km/h', mph: 'mph', 'm/s': 'm/s', knots: 'knots' }
        });
        break;
      case 'area':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.area,
          units: { 'sq m': 'square meters', 'sq ft': 'square feet', 'sq km': 'square kilometers', acres: 'acres', hectares: 'hectares' }
        });
        break;
      case 'volume':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.volume,
          units: { liters: 'liters', gallons: 'gallons', ml: 'milliliters', cups: 'cups', 'fl oz': 'fluid ounces' }
        });
        break;
      case 'data':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.data,
          units: { bytes: 'bytes', KB: 'kilobytes', MB: 'megabytes', GB: 'gigabytes', TB: 'terabytes' }
        });
        break;
      case 'time':
        new Converter({
          inputId: 'input-value', outputId: 'output-value',
          fromId: 'from-unit', toId: 'to-unit',
          resultId: 'result-display',
          convertFn: ConversionFunctions.time,
          units: { seconds: 'seconds', minutes: 'minutes', hours: 'hours', days: 'days', weeks: 'weeks', years: 'years' }
        });
        break;
    }
  });

  // Export for use in other scripts if needed
  window.ConverterApp = {
    ThemeManager,
    NumberUtil,
    ConversionFunctions,
    Converter,
    CurrencyConverter
  };

})();
