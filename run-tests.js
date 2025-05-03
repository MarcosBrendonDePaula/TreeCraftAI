#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseAndCreateTree } = require('./treecraft');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test cases
const testCases = [
  {
    name: 'Simple Python Project',
    file: 'tests/test1.txt',
    rootDir: 'src'
  },
  {
    name: 'Web Project',
    file: 'tests/test2.txt',
    rootDir: 'projeto-web'
  },
  {
    name: 'Complex API Backend with Text Around',
    file: 'tests/test3.txt',
    rootDir: 'api-backend'
  }
];

// Function to recursively list all files and directories
function listFilesAndDirs(dir, basePath = '') {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      items.push(relativePath + '/');
      items.push(...listFilesAndDirs(fullPath, relativePath));
    } else {
      items.push(relativePath);
    }
  }
  
  return items;
}

// Function to clean up a directory
function cleanupDir(dir) {
  if (fs.existsSync(dir)) {
    console.log(`${colors.yellow}Cleaning up ${dir}${colors.reset}`);
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${dir}"`, { stdio: 'ignore' });
      } else {
        execSync(`rm -rf "${dir}"`, { stdio: 'ignore' });
      }
    } catch (error) {
      console.error(`${colors.red}Error cleaning up ${dir}: ${error.message}${colors.reset}`);
    }
  }
}

// Run tests
async function runTests() {
  console.log(`${colors.cyan}=== TreeCraft AI Tests ===${colors.reset}\n`);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const testCase of testCases) {
    console.log(`${colors.magenta}Running test: ${testCase.name}${colors.reset}`);
    console.log(`${colors.blue}Input file: ${testCase.file}${colors.reset}`);
    
    // Clean up any existing directory
    cleanupDir(testCase.rootDir);
    
    try {
      // Read the test file
      const treeText = fs.readFileSync(testCase.file, 'utf8');
      
      // Parse and create the tree
      console.log(`${colors.yellow}Creating directory structure...${colors.reset}`);
      const outputPath = parseAndCreateTree(treeText, '.');
      
      if (!outputPath) {
        console.log(`${colors.red}✗ Test failed: No output path returned${colors.reset}\n`);
        failedTests++;
        continue;
      }
      
      // Check if the root directory was created
      if (!fs.existsSync(testCase.rootDir)) {
        console.log(`${colors.red}✗ Test failed: Root directory ${testCase.rootDir} was not created${colors.reset}\n`);
        failedTests++;
        continue;
      }
      
      // List all files and directories created
      console.log(`${colors.green}Created structure:${colors.reset}`);
      const items = listFilesAndDirs(testCase.rootDir);
      items.forEach(item => console.log(`  ${item}`));
      
      console.log(`${colors.green}✓ Test passed${colors.reset}\n`);
      passedTests++;
    } catch (error) {
      console.log(`${colors.red}✗ Test failed: ${error.message}${colors.reset}\n`);
      failedTests++;
    } finally {
      // Clean up
      cleanupDir(testCase.rootDir);
    }
  }
  
  // Print summary
  console.log(`${colors.cyan}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`${colors.cyan}Total: ${testCases.length}${colors.reset}`);
  
  return passedTests === testCases.length;
}

// Run the tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
});
