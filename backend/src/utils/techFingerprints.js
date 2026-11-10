/**
 * Comprehensive fingerprint patterns for technology detection
 */
const TECH_PATTERNS = [
  // CMS
  {
    name: 'WordPress',
    category: 'CMS',
    icon: 'wordpress',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /wordpress/i }, { key: 'link', regex: /wp-json/i }],
      body: [/wp-content/i, /wp-includes/i, /<meta name="generator" content="WordPress/i],
      meta: [{ name: 'generator', regex: /wordpress/i }]
    }
  },
  {
    name: 'Shopify',
    category: 'CMS',
    icon: 'shopify',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-shopify-stage', regex: /.*/i }, { key: 'server', regex: /shopify/i }],
      body: [/cdn\.shopify\.com/i, /Shopify\.shop/i, /Shopify\.theme/i],
      meta: [{ name: 'shopify-checkout-api-token', regex: /.*/i }]
    }
  },
  {
    name: 'Wix',
    category: 'CMS',
    icon: 'wix',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-wix-request-id', regex: /.*/i }, { key: 'x-wix-renderer-server', regex: /.*/i }],
      body: [/static\.wixstatic\.com/i, /_wixPageRender/i, /wix-code/i],
      meta: [{ name: 'generator', regex: /wix.com/i }]
    }
  },
  {
    name: 'Squarespace',
    category: 'CMS',
    icon: 'squarespace',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-sqsp-backend', regex: /.*/i }],
      body: [/static1\.squarespace\.com/i, /Squarespace\.onInitialize/i],
      meta: [{ name: 'generator', regex: /squarespace/i }]
    }
  },
  {
    name: 'Drupal',
    category: 'CMS',
    icon: 'drupal',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-drupal-cache', regex: /.*/i }, { key: 'x-generator', regex: /drupal/i }],
      body: [/Drupal\.settings/i, /sites\/default\/files/i],
      meta: [{ name: 'generator', regex: /drupal/i }]
    }
  },
  {
    name: 'Joomla',
    category: 'CMS',
    icon: 'joomla',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-content-encoded-by', regex: /joomla/i }],
      body: [/\/components\/com_/i, /\/media\/system\/js/i],
      meta: [{ name: 'generator', regex: /joomla/i }]
    }
  },
  {
    name: 'Magento',
    category: 'CMS',
    icon: 'magento',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-magento-tags', regex: /.*/i }],
      body: [/Mage\.Cookies/i, /skin\/frontend/i, /varien\/js\.js/i],
      meta: [{ name: 'generator', regex: /magento/i }]
    }
  },

  // Frameworks & Frontend Libraries
  {
    name: 'React',
    category: 'Framework',
    icon: 'react',
    confidence: 'high',
    rules: {
      body: [/data-reactroot/i, /react-dom/i, /_reactListening/i, /__REACT_DEVTOOLS_GLOBAL_HOOK__/i]
    }
  },
  {
    name: 'Next.js',
    category: 'Framework',
    icon: 'nextjs',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /next\.js/i }],
      body: [/__NEXT_DATA__/i, /_next\/static/i, /<next-route-announcer>/i]
    }
  },
  {
    name: 'Vue.js',
    category: 'Framework',
    icon: 'vue',
    confidence: 'high',
    rules: {
      body: [/data-v-[a-f0-9]/i, /__vue__/i, /vue\.runtime/i]
    }
  },
  {
    name: 'Nuxt.js',
    category: 'Framework',
    icon: 'nuxtjs',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /nuxt/i }],
      body: [/__NUXT__/i, /_nuxt\//i]
    }
  },
  {
    name: 'Angular',
    category: 'Framework',
    icon: 'angular',
    confidence: 'high',
    rules: {
      body: [/ng-version=/i, /ng-app/i, /data-ng-/i, /_ngcontent/i]
    }
  },
  {
    name: 'Laravel',
    category: 'Framework',
    icon: 'laravel',
    confidence: 'high',
    rules: {
      headers: [{ key: 'set-cookie', regex: /laravel_session/i }],
      body: [/laravel_token/i]
    }
  },
  {
    name: 'Django',
    category: 'Framework',
    icon: 'django',
    confidence: 'high',
    rules: {
      headers: [{ key: 'set-cookie', regex: /csrftoken/i }],
      body: [/csrfmiddlewaretoken/i, /__django_/i]
    }
  },
  {
    name: 'Express',
    category: 'Framework',
    icon: 'express',
    confidence: 'high',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /express/i }]
    }
  },

  // Language Runtimes & Languages
  {
    name: 'PHP',
    category: 'Language',
    icon: 'php',
    confidence: 'medium',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /php/i }, { key: 'set-cookie', regex: /phpsessid/i }]
    }
  },
  {
    name: 'Node.js',
    category: 'Language',
    icon: 'nodejs',
    confidence: 'medium',
    rules: {
      headers: [{ key: 'x-powered-by', regex: /node/i }]
    }
  },

  // CSS Frameworks
  {
    name: 'Tailwind CSS',
    category: 'UI Framework',
    icon: 'tailwind',
    confidence: 'high',
    rules: {
      body: [/tailwind/i, /class="[^"]*(?:flex|grid|hidden|bg-[a-z]+-\d+|text-[a-z]+-\d+|p-\d|m-\d)[^"]*"/i]
    }
  },
  {
    name: 'Bootstrap',
    category: 'UI Framework',
    icon: 'bootstrap',
    confidence: 'high',
    rules: {
      body: [/bootstrap(?:\.min)?\.css/i, /bootstrap(?:\.bundle)?(?:\.min)?\.js/i, /class="[^"]*(?:container|row|col-(?:sm|md|lg|xl)?-\d+)[^"]*"/i]
    }
  }
];

module.exports = { TECH_PATTERNS };
