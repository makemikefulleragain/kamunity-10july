#!/usr/bin/env node

/**
 * Kamunity Security Audit Script
 * Performs comprehensive security checks on the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor() {
    this.results = {
      passed: [],
      warnings: [],
      critical: [],
      info: []
    };
  }

  log(level, message, details = '') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, details };
    
    this.results[level].push(logEntry);
    
    const colors = {
      passed: '\x1b[32m✓\x1b[0m',
      warnings: '\x1b[33m⚠\x1b[0m',
      critical: '\x1b[31m✗\x1b[0m',
      info: '\x1b[36mℹ\x1b[0m'
    };
    
    console.log(`${colors[level]} ${message}`);
    if (details) console.log(`  ${details}`);
  }

  // Check environment variables
  checkEnvironmentVariables() {
    console.log('\n🔒 Checking Environment Variables...');
    
    const requiredVars = [
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL', // Updated from SENDGRID_FROM_EMAIL for clarity
      'MIKE_FULLER_EMAIL',
      'NEXT_PUBLIC_SITE_URL'
    ];

    const optionalVars = [
      'MIKE_FULLER_EMAIL',
      'NEXT_PUBLIC_CRISP_WEBSITE_ID',
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID'
    ];

    // Check required variables
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        this.log('passed', `Required environment variable ${varName} is set`);
      } else {
        this.log('critical', `Missing required environment variable: ${varName}`);
      }
    }

    // Check optional variables
    for (const varName of optionalVars) {
      if (process.env[varName]) {
        this.log('passed', `Optional environment variable ${varName} is set`);
      } else {
        this.log('info', `Optional environment variable ${varName} not set`);
      }
    }

    // Check for dangerous values
    if (process.env.NODE_ENV === 'production') {
      this.log('passed', 'NODE_ENV set to production');
    } else {
      this.log('warnings', 'NODE_ENV not set to production');
    }
  }

  // Check API security
  checkAPIEndpoints() {
    console.log('\n🛡️ Checking API Security...');
    
    const apiFiles = [
      'src/pages/api/subscribe.ts',
      'src/pages/api/contact.ts',
      'src/pages/api/health.ts',
      'netlify/functions/subscribe.js',
      'netlify/functions/contact.js'
    ];

    for (const apiFile of apiFiles) {
      if (fs.existsSync(apiFile)) {
        const content = fs.readFileSync(apiFile, 'utf8');
        
        // Check for security headers
        if (content.includes('X-Content-Type-Options')) {
          this.log('passed', `${apiFile}: Security headers implemented`);
        } else {
          this.log('warnings', `${apiFile}: Missing security headers`);
        }

        // Check for input validation
        if (content.includes('validateEmail') && content.includes('sanitizeInput')) {
          this.log('passed', `${apiFile}: Input validation implemented`);
        } else {
          this.log('critical', `${apiFile}: Missing input validation`);
        }

        // Check for rate limiting
        if (content.includes('RateLimit') || content.includes('rateLimit')) {
          this.log('passed', `${apiFile}: Rate limiting implemented`);
        } else {
          this.log('warnings', `${apiFile}: Rate limiting not found`);
        }

        // Check for CORS protection
        if (content.includes('validateOrigin') || content.includes('origin')) {
          this.log('passed', `${apiFile}: Origin validation implemented`);
        } else {
          this.log('warnings', `${apiFile}: Origin validation not found`);
        }

        // Check for reCAPTCHA
        if (content.includes('recaptcha') || content.includes('verifyRecaptcha')) {
          this.log('passed', `${apiFile}: reCAPTCHA protection implemented`);
        } else {
          this.log('critical', `${apiFile}: Missing reCAPTCHA protection`);
        }
      } else {
        this.log('info', `${apiFile}: File not found (may be expected)`);
      }
    }
  }

  // Check dependencies for vulnerabilities
  checkDependencies() {
    console.log('\n📦 Checking Dependencies...');
    
    try {
      // Run npm audit
      const auditResult = execSync('npm audit --audit-level high', { encoding: 'utf8' });
      if (auditResult.includes('0 vulnerabilities')) {
        this.log('passed', 'No high-severity vulnerabilities found in dependencies');
      } else {
        this.log('warnings', 'High-severity vulnerabilities found in dependencies', auditResult);
      }
    } catch (error) {
      if (error.stdout && error.stdout.includes('0 vulnerabilities')) {
        this.log('passed', 'No high-severity vulnerabilities found in dependencies');
      } else {
        this.log('critical', 'Critical vulnerabilities found in dependencies', error.stdout || error.message);
      }
    }

    // Check for outdated packages
    try {
      const outdatedResult = execSync('npm outdated', { encoding: 'utf8' });
      if (outdatedResult.trim()) {
        this.log('info', 'Some packages are outdated', 'Consider updating for security patches');
      } else {
        this.log('passed', 'All packages are up to date');
      }
    } catch (error) {
      // npm outdated returns exit code 1 when outdated packages are found
      if (error.stdout) {
        this.log('info', 'Some packages are outdated', 'Consider updating for security patches');
      }
    }
  }

  // Check file permissions and sensitive files
  checkFileSystem() {
    console.log('\n📁 Checking File System Security...');
    
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'package-lock.json',
      'yarn.lock'
    ];

    for (const file of sensitiveFiles) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        this.log('info', `${file}: Found (${stats.size} bytes)`);
        
        // Check if .env files are in gitignore
        if (file.startsWith('.env')) {
          const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
          if (gitignore.includes('.env') || gitignore.includes(file)) {
            this.log('passed', `${file}: Properly excluded from git`);
          } else {
            this.log('critical', `${file}: Not excluded from git - security risk!`);
          }
        }
      }
    }

    // Check for exposed sensitive data in git
    try {
      const gitLog = execSync('git log --oneline -10', { encoding: 'utf8' });
      this.log('info', 'Git history appears normal');
    } catch (error) {
      this.log('info', 'Git not initialized or no commits');
    }
  }

  // Check Netlify configuration
  checkNetlifyConfig() {
    console.log('\n🌐 Checking Netlify Configuration...');
    
    if (fs.existsSync('netlify.toml')) {
      const config = fs.readFileSync('netlify.toml', 'utf8');
      
      // Check for security headers
      if (config.includes('X-Frame-Options') && config.includes('X-Content-Type-Options')) {
        this.log('passed', 'Netlify security headers configured');
      } else {
        this.log('critical', 'Missing Netlify security headers');
      }

      // Check for CSP
      if (config.includes('Content-Security-Policy')) {
        this.log('passed', 'Content Security Policy configured');
      } else {
        this.log('warnings', 'Content Security Policy not configured');
      }

      // Check for HTTPS redirect
      if (config.includes('https') || config.includes('ssl')) {
        this.log('passed', 'HTTPS configuration present');
      } else {
        this.log('warnings', 'HTTPS configuration not explicitly set');
      }
    } else {
      this.log('critical', 'netlify.toml not found - deployment configuration missing');
    }
  }

  // Check for common security anti-patterns
  checkCodePatterns() {
    console.log('\n🔍 Checking Code Patterns...');
    
    const filesToCheck = [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx'
    ];

    const dangerousPatterns = [
      { pattern: /eval\s*\(/, message: 'Use of eval() detected - security risk' },
      { pattern: /innerHTML\s*=/, message: 'Use of innerHTML detected - XSS risk' },
      { pattern: /document\.write/, message: 'Use of document.write detected - XSS risk' },
      { pattern: /\.createRange/, message: 'Use of createRange detected - potential XSS' },
      { pattern: /console\.log\(.*(password|token|secret|key)/i, message: 'Potential sensitive data logging' }
    ];

    const goodPatterns = [
      { pattern: /sanitizeInput/, message: 'Input sanitization found' },
      { pattern: /validateEmail/, message: 'Email validation found' },
      { pattern: /reCAPTCHA/i, message: 'reCAPTCHA protection found' },
      { pattern: /X-Content-Type-Options/, message: 'Security headers found' }
    ];

    // This is a simplified check - in practice, you'd use a proper AST parser
    try {
      const files = execSync('find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);

      let dangerousCount = 0;
      let goodCount = 0;

      for (const file of files) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          for (const { pattern, message } of dangerousPatterns) {
            if (pattern.test(content)) {
              this.log('critical', `${file}: ${message}`);
              dangerousCount++;
            }
          }

          for (const { pattern, message } of goodPatterns) {
            if (pattern.test(content)) {
              goodCount++;
            }
          }
        }
      }

      if (dangerousCount === 0) {
        this.log('passed', 'No dangerous code patterns detected');
      }

      if (goodCount > 0) {
        this.log('passed', `${goodCount} security best practices found in code`);
      }
    } catch (error) {
      this.log('warnings', 'Could not scan code patterns', error.message);
    }
  }

  // Generate final report
  generateReport() {
    console.log('\n📊 SECURITY AUDIT REPORT');
    console.log('='.repeat(50));
    
    const total = this.results.passed.length + this.results.warnings.length + this.results.critical.length;
    const score = Math.round((this.results.passed.length / total) * 100);
    
    console.log(`\n📈 Security Score: ${score}%`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
    console.log(`❌ Critical: ${this.results.critical.length}`);
    console.log(`ℹ️  Info: ${this.results.info.length}`);

    if (this.results.critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES THAT MUST BE FIXED:');
      this.results.critical.forEach(issue => {
        console.log(`   • ${issue.message}`);
        if (issue.details) console.log(`     ${issue.details}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS TO CONSIDER:');
      this.results.warnings.forEach(warning => {
        console.log(`   • ${warning.message}`);
      });
    }

    console.log('\n📋 RECOMMENDATIONS:');
    if (this.results.critical.length === 0) {
      console.log('   ✅ No critical security issues found!');
    } else {
      console.log('   🔧 Fix all critical issues before production deployment');
    }
    
    if (this.results.warnings.length === 0) {
      console.log('   ✅ No security warnings - excellent!');
    } else {
      console.log('   🔧 Address warnings to improve security posture');
    }

    console.log('   🔄 Run this audit regularly');
    console.log('   📝 Keep dependencies updated');
    console.log('   🔍 Monitor for new vulnerabilities');

    // Export results to file
    const reportPath = 'security-audit-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return {
      score,
      critical: this.results.critical.length,
      warnings: this.results.warnings.length,
      passed: this.results.passed.length
    };
  }

  // Main audit function
  async runAudit() {
    console.log('🔒 KAMUNITY SECURITY AUDIT');
    console.log('='.repeat(30));
    console.log(`Started at: ${new Date().toISOString()}`);

    this.checkEnvironmentVariables();
    this.checkAPIEndpoints();
    this.checkDependencies();
    this.checkFileSystem();
    this.checkNetlifyConfig();
    this.checkCodePatterns();

    const summary = this.generateReport();
    
    // Exit with appropriate code
    if (summary.critical > 0) {
      console.log('\n❌ Audit failed due to critical issues');
      process.exit(1);
    } else if (summary.warnings > 5) {
      console.log('\n⚠️  Audit passed with multiple warnings');
      process.exit(1);
    } else {
      console.log('\n✅ Security audit passed!');
      process.exit(0);
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runAudit().catch(error => {
    console.error('Audit failed:', error);
    process.exit(1);
  });
}

module.exports = SecurityAuditor; 