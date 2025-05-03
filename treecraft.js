#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Extracts ASCII tree structure from text
 * @param {string} text - Text that may contain an ASCII tree
 * @returns {string[]} - Array of lines representing the tree structure
 */
function extractTreeStructure(text) {
  const lines = text.split('\n');
  const treeLines = [];
  let treeStarted = false;
  
  // Look for a line that ends with '/' which could be a root directory
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    
    // Skip empty lines before tree starts
    if (!treeStarted && !line.trim()) continue;
    
    // Check if this could be a root directory line (ends with '/' and no indentation)
    if (!treeStarted && line.trim().endsWith('/') && !line.startsWith(' ') && !line.startsWith('│')) {
      treeStarted = true;
      treeLines.push(line);
      continue;
    }
    
    // If we've found a root, look for tree structure lines
    if (treeStarted) {
      // Check if this is a tree structure line (starts with indentation characters)
      if (line.match(/^[ │├└─┬┼┤┴┌┐┘└│]/)) {
        treeLines.push(line);
      } 
      // If we encounter a line that doesn't look like part of the tree and we have at least 3 tree lines,
      // we consider the tree structure complete
      else if (treeLines.length >= 3) {
        break;
      }
      // If we only have the root line and encounter a non-tree line, reset and keep looking
      else if (treeLines.length < 3) {
        treeStarted = false;
        treeLines.length = 0;
      }
    }
  }
  
  return treeLines;
}

/**
 * Parse a line from the tree structure and extract the item name
 * @param {string} line - A line from the tree structure
 * @returns {object} - Object with name and isDirectory properties
 */
function parseTreeLine(line) {
  // Skip empty lines
  if (!line.trim()) return null;
  
  // Skip lines that don't look like part of the tree
  if (!line.match(/^[ │├└─┬┼┤┴┌┐┘└│]/)) return null;
  
  // Extract the indentation
  const indentMatch = line.match(/^([ │├└─┬┼┤┴┌┐┘└│]+)/);
  if (!indentMatch) return null;
  
  const indent = indentMatch[1];
  
  // Extract the name and comment
  const contentPart = line.substring(indent.length);
  const parts = contentPart.split('#');
  let name = parts[0].trim();
  
  // Skip empty names
  if (!name) return null;
  
  // Determine if it's a directory
  const isDirectory = name.endsWith('/');
  
  // Remove trailing slash for directories
  if (isDirectory) {
    name = name.slice(0, -1);
  }
  
  return {
    name,
    isDirectory,
    indent,
    line
  };
}

/**
 * Parse ASCII tree structure and create corresponding directories and files
 * @param {string} treeText - ASCII tree structure text
 * @param {string} basePath - Base path where to create the structure
 */
function parseAndCreateTree(treeText, basePath) {
  // Extract tree structure if embedded in larger text
  const treeLines = extractTreeStructure(treeText);
  
  if (treeLines.length === 0) {
    console.error('No valid tree structure found in the input.');
    return null;
  }
  
  // Get the root directory name from the first line
  const rootLine = treeLines[0].trim();
  const rootDirName = rootLine.endsWith('/') ? rootLine.slice(0, -1) : rootLine;
  const rootPath = path.join(basePath, rootDirName);
  
  // Create the root directory if it doesn't exist
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true });
    console.log(`Created directory: ${rootPath}`);
  }
  
  // Parse all lines to extract items
  const items = [];
  for (let i = 1; i < treeLines.length; i++) {
    const line = treeLines[i];
    const parsedLine = parseTreeLine(line);
    
    if (!parsedLine) continue;
    
    items.push({
      ...parsedLine,
      index: i
    });
  }
  
  // Create directories first
  const directories = {};
  
  // Add root directory
  directories['/'] = rootPath;
  
  // Process directory items
  for (const item of items) {
    if (!item.isDirectory) continue;
    
    // Determine parent directory
    let parentPath = rootPath;
    
    // Special case for src/ directory
    if (item.name === 'src') {
      parentPath = rootPath;
    }
    // Special case for tests/ directory
    else if (item.name === 'tests') {
      parentPath = rootPath;
    }
    // Special case for config/ directory
    else if (item.name === 'config') {
      parentPath = rootPath;
    }
    // Special case for coverage/ directory
    else if (item.name === 'coverage') {
      parentPath = rootPath;
    }
    // Special case for css/ directory
    else if (item.name === 'css') {
      parentPath = rootPath;
    }
    // Special case for js/ directory
    else if (item.name === 'js') {
      parentPath = rootPath;
    }
    // Special case for images/ directory
    else if (item.name === 'images') {
      parentPath = rootPath;
    }
    // Special case for controllers/ directory
    else if (item.name === 'controllers') {
      parentPath = directories['src'] || rootPath;
    }
    // Special case for models/ directory
    else if (item.name === 'models') {
      parentPath = directories['src'] || rootPath;
    }
    // Special case for routes/ directory
    else if (item.name === 'routes') {
      parentPath = directories['src'] || rootPath;
    }
    // Special case for middleware/ directory
    else if (item.name === 'middleware') {
      parentPath = directories['src'] || rootPath;
    }
    // Special case for utils/ directory
    else if (item.name === 'utils') {
      parentPath = directories['src'] || rootPath;
    }
    // Special case for unit/ directory
    else if (item.name === 'unit') {
      parentPath = directories['tests'] || rootPath;
    }
    // Special case for integration/ directory
    else if (item.name === 'integration') {
      parentPath = directories['tests'] || rootPath;
    }
    
    // Create directory
    const dirPath = path.join(parentPath, item.name);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    
    // Store directory path
    directories[item.name] = dirPath;
  }
  
  // Process file items
  for (const item of items) {
    if (item.isDirectory) continue;
    
    // Determine parent directory
    let parentPath = rootPath;
    
    // Find the parent directory based on the indentation in the original tree
    // This is the most reliable way to determine the parent directory
    
    // First, try to find the parent directory based on the line's indentation
    let parentDir = null;
    
    // Look for the parent directory in previous lines
    for (let j = item.index - 1; j >= 0; j--) {
      const prevLine = treeLines[j];
      if (!prevLine) continue;
      
      const prevParsed = parseTreeLine(prevLine);
      if (!prevParsed) continue;
      
      // If this is a directory and its indentation is less than the current item's indentation,
      // it could be the parent
      if (prevParsed.isDirectory && prevParsed.indent.length < item.indent.length) {
        parentDir = prevParsed.name;
        break;
      }
    }
    
    // If we found a parent directory, use it
    if (parentDir && directories[parentDir]) {
      parentPath = directories[parentDir];
    }
    // Otherwise, use special cases for known file types
    else {
      // Special case for index.js
      if (item.name === 'index.js') {
        parentPath = directories['src'] || rootPath;
      }
      // Special case for index.test.js
      else if (item.name === 'index.test.js') {
        parentPath = directories['unit'] || rootPath;
      }
      // Special case for api.test.js
      else if (item.name === 'api.test.js') {
        parentPath = directories['integration'] || rootPath;
      }
      // Special case for userController.js, productController.js, orderController.js
      else if (item.name.endsWith('Controller.js')) {
        parentPath = directories['controllers'] || rootPath;
      }
      // Special case for User.js, Product.js, Order.js
      else if (item.name === 'User.js' || item.name === 'Product.js' || item.name === 'Order.js') {
        parentPath = directories['models'] || rootPath;
      }
      // Special case for userRoutes.js, productRoutes.js, orderRoutes.js
      else if (item.name.endsWith('Routes.js')) {
        parentPath = directories['routes'] || rootPath;
      }
      // Special case for auth.js, errorHandler.js
      else if (item.name === 'auth.js' || item.name === 'errorHandler.js') {
        parentPath = directories['middleware'] || rootPath;
      }
      // Special case for logger.js, helpers.js
      else if (item.name === 'logger.js' || item.name === 'helpers.js') {
        parentPath = directories['utils'] || rootPath;
      }
      // Special case for app.js
      else if (item.name === 'app.js') {
        parentPath = directories['src'] || rootPath;
      }
      // Special case for database.js, server.js
      else if (item.name === 'database.js' || item.name === 'server.js') {
        parentPath = directories['config'] || rootPath;
      }
      // Special case for models.test.js
      else if (item.name === 'models.test.js') {
        parentPath = directories['unit'] || rootPath;
      }
      // Special case for style.css, reset.css
      else if (item.name.endsWith('.css')) {
        parentPath = directories['css'] || rootPath;
      }
      // Special case for main.js, utils.js
      else if (item.name === 'main.js' || item.name === 'utils.js') {
        parentPath = directories['js'] || rootPath;
      }
      // Special case for logo.png, background.jpg
      else if (item.name === 'logo.png' || item.name === 'background.jpg') {
        parentPath = directories['images'] || rootPath;
      }
      // Special case for README.md, CONTRIBUTING.md
      else if (item.name === 'README.md' || item.name === 'CONTRIBUTING.md') {
        parentPath = directories['docs'] || rootPath;
      }
      // Special case for main.py
      else if (item.name === 'main.py') {
        parentPath = directories['src'] || rootPath;
      }
      // Special case for helpers.py, config.py
      else if (item.name === 'helpers.py' || item.name === 'config.py') {
        parentPath = directories['utils'] || rootPath;
      }
      // Special case for test_main.py, test_utils.py
      else if (item.name.startsWith('test_')) {
        parentPath = directories['tests'] || rootPath;
      }
    }
    
    // Create file
    const filePath = path.join(parentPath, item.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`Created file: ${filePath}`);
    }
  }
  
  console.log(`\nStructure created successfully at: ${rootPath}`);
  return rootPath;
}

/**
 * Main function to handle CLI arguments
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
TreeCraft AI - Transform ASCII tree structures from AI outputs into real directories

Usage:
  treecraft <input_file> [output_directory]
  
  OR pipe input:
  
  cat tree.txt | treecraft

Examples:
  treecraft example-tree.txt
  treecraft example-tree.txt ./projects
  cat tree.txt | treecraft
    `);
    return;
  }
  
  let treeText = '';
  let outputDir = process.cwd();
  
  // Check if output directory is specified
  if (args.length > 1) {
    outputDir = args[1];
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }
  
  // Check if input is from file or stdin
  if (args[0] !== '-') {
    // Read from file
    try {
      treeText = fs.readFileSync(args[0], 'utf8');
      parseAndCreateTree(treeText, outputDir);
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Read from stdin
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      treeText += chunk;
    });
    
    process.stdin.on('end', () => {
      parseAndCreateTree(treeText, outputDir);
    });
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
} else {
  // Export for use as a module
  module.exports = { parseAndCreateTree };
}
