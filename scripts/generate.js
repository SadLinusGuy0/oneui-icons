const fs = require('fs');
const path = require('path');

const SVG_DIR = path.join(__dirname, '../SVG');
const OUTPUT_DIR = path.join(__dirname, '../src/icons');
const INDEX_FILE = path.join(__dirname, '../src/index.ts');

// Convert filename to PascalCase component name
function toPascalCase(filename) {
  // Remove .svg extension
  const name = filename.replace('.svg', '');
  
  // Split by spaces, hyphens, underscores
  const parts = name.split(/[\s_-]+/);
  
  // Capitalize first letter of each part and join
  let componentName = parts
    .map(part => {
      // Handle edge cases like 'XR', 'WiFI', 'vpn'
      if (part.toUpperCase() === part && part.length > 1) {
        // Already all caps, just use as-is
        return part.charAt(0) + part.slice(1).toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
  
  // If component name starts with a number, prefix with 'Icon'
  if (/^\d/.test(componentName)) {
    componentName = 'Icon' + componentName;
  }
  
  return componentName;
}

// Convert SVG attributes to JSX attributes
function svgToJsx(svgContent) {
  return svgContent
    // Convert hyphenated attributes to camelCase
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/stroke-dasharray/g, 'strokeDasharray')
    .replace(/stroke-dashoffset/g, 'strokeDashoffset')
    // Convert style attribute to React style object
    .replace(/style="mask-type:alpha"/g, 'style={{maskType:"alpha"}}')
    .replace(/style="mask-type:luminance"/g, 'style={{maskType:"luminance"}}')
    // Replace hardcoded colors with prop
    .replace(/fill="white"/g, 'fill={color}')
    .replace(/stroke="white"/g, 'stroke={color}')
    .replace(/fill="black"/g, 'fill={color}')
    .replace(/stroke="black"/g, 'stroke={color}')
    // Handle fill and stroke without quotes (some SVGs might have this)
    .replace(/fill=white/g, 'fill={color}')
    .replace(/stroke=white/g, 'stroke={color}');
}

// Extract the SVG content (everything inside <svg>...</svg>)
function extractSvgBody(svgContent) {
  // Remove the opening <svg...> tag and closing </svg> tag
  const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) {
    throw new Error('Invalid SVG content');
  }
  return match[1].trim();
}

// Generate React component from SVG
function generateComponent(svgContent, componentName) {
  const svgBody = extractSvgBody(svgContent);
  const jsxBody = svgToJsx(svgBody);
  
  return `import React from 'react';
import type { IconProps } from '../types';

export const ${componentName}: React.FC<IconProps> = ({
  size = 24,
  color = 'white',
  className,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    ${jsxBody}
  </svg>
);

${componentName}.displayName = '${componentName}';
`;
}

// Main function
function generateComponents() {
  console.log('🚀 Starting icon generation...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Read all SVG files
  const svgFiles = fs.readdirSync(SVG_DIR).filter(file => file.endsWith('.svg'));
  console.log(`📁 Found ${svgFiles.length} SVG files`);
  
  const components = [];
  const componentNames = new Map(); // Track component names to handle duplicates
  let successCount = 0;
  let errorCount = 0;
  
  // Process each SVG file
  svgFiles.forEach((filename, index) => {
    try {
      let componentName = toPascalCase(filename);
      
      // Handle duplicate component names
      if (componentNames.has(componentName)) {
        const count = componentNames.get(componentName);
        componentNames.set(componentName, count + 1);
        componentName = `${componentName}${count + 1}`;
      } else {
        componentNames.set(componentName, 1);
      }
      
      const svgPath = path.join(SVG_DIR, filename);
      const outputPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
      
      // Read SVG content
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      
      // Generate React component
      const componentCode = generateComponent(svgContent, componentName);
      
      // Write component file
      fs.writeFileSync(outputPath, componentCode);
      
      components.push(componentName);
      successCount++;
      
      // Log progress every 100 files
      if ((index + 1) % 100 === 0) {
        console.log(`  ✓ Processed ${index + 1}/${svgFiles.length} files...`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });
  
  console.log(`\n✅ Successfully generated ${successCount} components`);
  if (errorCount > 0) {
    console.log(`⚠️  Failed to generate ${errorCount} components`);
  }
  
  // Generate index.ts with all exports
  console.log('\n📝 Generating index.ts...');
  const exports = components
    .sort()
    .map(name => `export { ${name} } from './icons/${name}';`)
    .join('\n');
  
  const indexContent = `// Auto-generated file. Do not edit manually.
export type { IconProps } from './types';

${exports}
`;
  
  fs.writeFileSync(INDEX_FILE, indexContent);
  console.log('✅ Index file generated');
  
  console.log('\n🎉 Icon generation complete!');
  console.log(`   Total components: ${components.length}`);
}

// Run the generator
try {
  generateComponents();
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
