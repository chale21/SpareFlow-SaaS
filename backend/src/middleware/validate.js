const { validationResult } = require('express-validator');

/**
 * Generic validation middleware factory using express-validator.
 *
 * Usage examples:
 *
 * // For body-only validators:
 * router.post('/register', validate([ body('email').isEmail(), body('password').isLength({ min: 6 }) ]), handler);
 *
 * // Or passing an object with locations:
 * router.get('/:id', validate({ params: [ param('id').isMongoId() ] }), handler);
 *
 * The `rules` parameter may be either:
 * - an array of express-validator validation chains (applied to req.body by default), or
 * - an object with optional keys: { body: [], params: [], query: [] } each containing arrays of validation chains.
 */
const validate = (rules = []) => {
  // Normalize rules into per-location arrays
  let bodyRules = [];
  let paramRules = [];
  let queryRules = [];

  if (Array.isArray(rules)) {
    // treat as body rules by default
    bodyRules = rules;
  } else if (rules && typeof rules === 'object') {
    bodyRules = Array.isArray(rules.body) ? rules.body : [];
    paramRules = Array.isArray(rules.params) ? rules.params : [];
    queryRules = Array.isArray(rules.query) ? rules.query : [];
  }

  return async (req, res, next) => {
    try {
      // Run all rules against the request
      const runs = [];

      bodyRules.forEach((rule) => runs.push(rule.run(req)));
      paramRules.forEach((rule) => runs.push(rule.run(req)));
      queryRules.forEach((rule) => runs.push(rule.run(req)));

      await Promise.all(runs);

      const result = validationResult(req);
      if (result.isEmpty()) {
        return next();
      }

      // Format errors and avoid exposing sensitive values.
      const errors = result.array().map((err) => ({
        field: err.path || err.param,
        location: err.location,
        message: err.msg
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    } catch (err) {
      // Pass unexpected errors to centralized error handler
      return next(err);
    }
  };
};

module.exports = validate;
