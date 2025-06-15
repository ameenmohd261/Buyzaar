/**
 * Format a price for display
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted price string
 */
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(price)
}

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date))
}

/**
 * Format measurements with appropriate units
 * @param {number} value - The measurement value
 * @param {string} unit - The unit of measurement
 * @returns {string} - Formatted measurement string
 */
export function formatMeasurement(value, unit = 'cm') {
  if (unit === 'cm') {
    return `${value} cm`
  } else if (unit === 'in') {
    return `${value.toFixed(1)}"`
  } else {
    return `${value} ${unit}`
  }
}

/**
 * Convert between units of measurement (metric/imperial)
 * @param {number} value - The measurement value
 * @param {string} fromUnit - The current unit
 * @param {string} toUnit - The target unit
 * @returns {number} - The converted value
 */
export function convertMeasurement(value, fromUnit, toUnit) {
  // cm to inches
  if (fromUnit === 'cm' && toUnit === 'in') {
    return value / 2.54
  }
  // inches to cm
  else if (fromUnit === 'in' && toUnit === 'cm') {
    return value * 2.54
  }
  // kg to lbs
  else if (fromUnit === 'kg' && toUnit === 'lb') {
    return value * 2.20462
  }
  // lbs to kg
  else if (fromUnit === 'lb' && toUnit === 'kg') {
    return value / 2.20462
  }
  // no conversion needed
  else {
    return value
  }
}