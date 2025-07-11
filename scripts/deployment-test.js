#!/usr/bin/env node

/**
 * Kamunity Deployment Testing Script
 * Tests all critical functionality after deployment
 */

const https = require('https');
const http = require('http');

class DeploymentTester {
  constructor(baseUrl = 'https://kamunity.ai') {
    this.baseUrl = baseUrl;
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  log(level, test, message) {
    const colors = {
      passed: '\x1b[32m✓\x1b[0m',
      failed: '\x1b[31m✗\x1b[0m',
      warnings: '\x1b[33m⚠\x1b[0m'
    };
    
    console.log(`${colors[level]} ${test}: ${message}`);
    this.results[level].push({ test, message });
  }

  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  async testBasicConnectivity() {
    console.log('\n🌐 Testing Basic Connectivity...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      if (response.statusCode === 200) {
        this.log('passed', 'Site Access', 'Main site loads successfully');
      } else {
        this.log('failed', 'Site Access', `HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.log('failed', 'Site Access', `Cannot reach site: ${error.message}`);
    }

    // Test www redirect
    try {
      const wwwUrl = this.baseUrl.replace('://', '://www.');
      const response = await this.makeRequest(wwwUrl);
      if (response.statusCode === 200 || response.statusCode === 301) {
        this.log('passed', 'WWW Redirect', 'www subdomain working');
      } else {
        this.log('warnings', 'WWW Redirect', 'www subdomain may have issues');
      }
    } catch (error) {
      this.log('warnings', 'WWW Redirect', 'www subdomain not accessible');
    }
  }

  async testSSLSecurity() {
    console.log('\n🔒 Testing SSL & Security...');
    
    try {
      const response = await this.makeRequest(this.baseUrl);
      
      // Check HTTPS
      if (this.baseUrl.startsWith('https')) {
        this.log('passed', 'HTTPS', 'SSL certificate working');
      } else {
        this.log('failed', 'HTTPS', 'Site not using HTTPS');
      }

      // Check security headers
      const headers = response.headers;
      
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'referrer-policy'
      ];

      securityHeaders.forEach(header => {
        if (headers[header]) {
          this.log('passed', 'Security Headers', `${header} present`);
        } else {
          this.log('warnings', 'Security Headers', `${header} missing`);
        }
      });

    } catch (error) {
      this.log('failed', 'SSL Security', `Error checking security: ${error.message}`);
    }
  }

  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    // Test health endpoint
    try {
      const response = await this.makeRequest(`${this.baseUrl}/api/health`);
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        this.log('passed', 'Health Check', `Status: ${data.status}`);
        
        if (data.services) {
          Object.entries(data.services).forEach(([service, status]) => {
            if (status) {
              this.log('passed', 'Service Check', `${service} operational`);
            } else {
              this.log('warnings', 'Service Check', `${service} not configured`);
            }
          });
        }
      } else {
        this.log('failed', 'Health Check', `HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.log('failed', 'Health Check', `Health endpoint error: ${error.message}`);
    }

    // Test form endpoints (should reject without proper data)
    const formEndpoints = ['/api/subscribe', '/api/contact'];
    
    for (const endpoint of formEndpoints) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        
        if (response.statusCode === 400) {
          this.log('passed', 'Form Security', `${endpoint} properly validates input`);
        } else if (response.statusCode === 405) {
          this.log('passed', 'Form Security', `${endpoint} properly rejects invalid methods`);
        } else {
          this.log('warnings', 'Form Security', `${endpoint} unexpected response: ${response.statusCode}`);
        }
      } catch (error) {
        this.log('warnings', 'Form Security', `${endpoint} test error: ${error.message}`);
      }
    }
  }

  async testPageLoad() {
    console.log('\n📄 Testing Page Load Performance...');
    
    const pages = ['/', '/about', '/content', '/welcome'];
    
    for (const page of pages) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(`${this.baseUrl}${page}`);
        const loadTime = Date.now() - startTime;
        
        if (response.statusCode === 200) {
          if (loadTime < 3000) {
            this.log('passed', 'Page Load', `${page} loaded in ${loadTime}ms`);
          } else {
            this.log('warnings', 'Page Load', `${page} slow load: ${loadTime}ms`);
          }
        } else {
          this.log('failed', 'Page Load', `${page} returned ${response.statusCode}`);
        }
      } catch (error) {
        this.log('failed', 'Page Load', `${page} error: ${error.message}`);
      }
    }
  }

  async testStaticAssets() {
    console.log('\n🖼️ Testing Static Assets...');
    
    const assets = [
      '/favicon.ico',
      '/logo.svg',
      '/kamunity-logo.png',
      '/site.webmanifest'
    ];
    
    for (const asset of assets) {
      try {
        const response = await this.makeRequest(`${this.baseUrl}${asset}`);
        if (response.statusCode === 200) {
          this.log('passed', 'Static Assets', `${asset} accessible`);
        } else {
          this.log('warnings', 'Static Assets', `${asset} returned ${response.statusCode}`);
        }
      } catch (error) {
        this.log('warnings', 'Static Assets', `${asset} error: ${error.message}`);
      }
    }
  }

  generateReport() {
    console.log('\n📊 DEPLOYMENT TEST REPORT');
    console.log('='.repeat(50));
    
    const total = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const score = Math.round((this.results.passed.length / total) * 100);
    
    console.log(`\n📈 Deployment Score: ${score}%`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);

    if (this.results.failed.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.results.failed.forEach(result => {
        console.log(`   • ${result.test}: ${result.message}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.warnings.forEach(result => {
        console.log(`   • ${result.test}: ${result.message}`);
      });
    }

    console.log('\n📋 RECOMMENDATIONS:');
    if (this.results.failed.length === 0) {
      console.log('   ✅ No critical issues found!');
    } else {
      console.log('   🔧 Fix critical issues before going live');
    }
    
    if (score >= 90) {
      console.log('   🎉 Deployment looks great!');
    } else if (score >= 75) {
      console.log('   👍 Deployment is functional with minor issues');
    } else {
      console.log('   ⚠️  Deployment needs attention');
    }

    return {
      score,
      passed: this.results.passed.length,
      failed: this.results.failed.length,
      warnings: this.results.warnings.length
    };
  }

  async runTests() {
    console.log('🔍 KAMUNITY DEPLOYMENT TESTS');
    console.log('='.repeat(35));
    console.log(`Testing: ${this.baseUrl}`);
    console.log(`Started: ${new Date().toISOString()}`);

    await this.testBasicConnectivity();
    await this.testSSLSecurity();
    await this.testAPIEndpoints();
    await this.testPageLoad();
    await this.testStaticAssets();

    const summary = this.generateReport();
    
    if (summary.failed === 0) {
      console.log('\n✅ All critical tests passed!');
      console.log('🚀 Deployment is ready for production use');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed');
      console.log('🔧 Please address critical issues before launch');
      process.exit(1);
    }
  }
}

// Run tests
if (require.main === module) {
  const baseUrl = process.argv[2] || 'https://kamunity.ai';
  const tester = new DeploymentTester(baseUrl);
  
  tester.runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentTester; 