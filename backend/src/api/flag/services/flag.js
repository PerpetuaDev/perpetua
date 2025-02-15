'use strict';

/**
 * flag service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::flag.flag');
