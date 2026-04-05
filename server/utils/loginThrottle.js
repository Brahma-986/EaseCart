const LoginThrottle = require('../models/LoginThrottle');

const MAX_ATTEMPTS = () => Math.max(1, parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) || 3);
const LOCK_MS = () =>
  Math.max(60_000, (parseInt(process.env.LOGIN_LOCKOUT_MINUTES, 10) || 15) * 60 * 1000);

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

async function ensureNotLocked(email) {
  const normalizedEmail = normalizeEmail(email);
  const throttle = await LoginThrottle.findOne({ email: normalizedEmail });
  if (!throttle) return { ok: true, normalizedEmail };

  if (throttle.lockedUntil && throttle.lockedUntil > new Date()) {
    return {
      ok: false,
      normalizedEmail,
      lockedUntil: throttle.lockedUntil
    };
  }

  if (throttle.lockedUntil && throttle.lockedUntil <= new Date()) {
    throttle.attempts = 0;
    throttle.lockedUntil = null;
    await throttle.save();
  }

  return { ok: true, normalizedEmail, throttle };
}

async function recordFailedAttempt(normalizedEmail) {
  const max = MAX_ATTEMPTS();
  let throttle = await LoginThrottle.findOne({ email: normalizedEmail });
  if (!throttle) {
    throttle = new LoginThrottle({ email: normalizedEmail, attempts: 0 });
  }
  throttle.attempts += 1;

  if (throttle.attempts >= max) {
    throttle.lockedUntil = new Date(Date.now() + LOCK_MS());
    await throttle.save();
    return {
      locked: true,
      lockedUntil: throttle.lockedUntil,
      attemptsRemaining: 0
    };
  }

  await throttle.save();
  return {
    locked: false,
    attemptsRemaining: max - throttle.attempts
  };
}

async function clearOnSuccess(normalizedEmail) {
  await LoginThrottle.deleteOne({ email: normalizedEmail });
}

module.exports = {
  normalizeEmail,
  ensureNotLocked,
  recordFailedAttempt,
  clearOnSuccess,
};
