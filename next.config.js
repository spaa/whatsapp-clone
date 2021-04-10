module.exports = {
    poweredByHeader: false,
    async headers(){
        return [
            { 
                source: '/',
                headers: [
                  {
                    key: 'Cache-Control',
                    value:
                      'public, max-age=31536000, immutable',
                  },
                  {
                    key: 'x-content-type-options',
                    value:
                      'nosniff',
                  },
                ],
            },
            { 
                source: '/(.*).png',
                headers: [
                  {
                    key: 'Cache-Control',
                    value:
                      'public, max-age=31536000, immutable',
                  },
                  {
                    key: 'x-content-type-options',
                    value:
                      'nosniff',
                  },
                ],
            },
            { 
                source: '/(.*).svg',
                headers: [
                  {
                    key: 'Cache-Control',
                    value:
                      'public, max-age=31536000, immutable',
                  },
                  {
                    key: 'x-content-type-options',
                    value:
                      'nosniff',
                  },
                ],
            },
            {
                // This doesn't work for 'Cache-Control' key (works for others though):
                source: '/_next/image(.*)',
                headers: [
                  {
                    key: 'Cache-Control',
                    // Instead of this value:
                    value: 'public, max-age=31536000, immutable',
                    // Cache-Control response header is `public, max-age=60` in production
                    // and `public, max-age=0, must-revalidate` in development
                  },
                  {
                    key: 'x-content-type-options',
                    value:
                      'nosniff',
                  },
                ],
              },
              {
                // This doesn't work for 'Cache-Control' key (works for others though):
                source: '/_next/static(.*)',
                headers: [
                  {
                    key: 'x-content-type-options',
                    value:
                      'nosniff',
                  },
                ],
              },
        ]
    }
}