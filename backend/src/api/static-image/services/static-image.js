'use strict';

/**
 * static-image service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::static-image.static-image');
