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
    .replace(/fill-opacity/g, 'fillOpacity')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/clip-path/g, 'clipPath')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/stroke-dasharray/g, 'strokeDasharray')
    .replace(/stroke-dashoffset/g, 'strokeDashoffset')
    .replace(/stroke-opacity/g, 'strokeOpacity')
    .replace(/stop-color/g, 'stopColor')
    .replace(/stop-opacity/g, 'stopOpacity')
    .replace(/flood-color/g, 'floodColor')
    .replace(/flood-opacity/g, 'floodOpacity')
    .replace(/color-interpolation-filters/g, 'colorInterpolationFilters')
    .replace(/color-interpolation/g, 'colorInterpolation')
    .replace(/font-family/g, 'fontFamily')
    .replace(/font-size/g, 'fontSize')
    .replace(/font-weight/g, 'fontWeight')
    .replace(/letter-spacing/g, 'letterSpacing')
    .replace(/text-anchor/g, 'textAnchor')
    .replace(/text-decoration/g, 'textDecoration')
    .replace(/dominant-baseline/g, 'dominantBaseline')
    .replace(/alignment-baseline/g, 'alignmentBaseline')
    .replace(/baseline-shift/g, 'baselineShift')
    .replace(/shape-rendering/g, 'shapeRendering')
    .replace(/image-rendering/g, 'imageRendering')
    .replace(/pointer-events/g, 'pointerEvents')
    .replace(/paint-order/g, 'paintOrder')
    .replace(/vector-effect/g, 'vectorEffect')
    // Convert xlink:href to xlinkHref (deprecated but still in some SVGs)
    .replace(/xlink:href/g, 'xlinkHref')
    .replace(/xml:space/g, 'xmlSpace')
    // Convert style attribute to React style object
    .replace(/style="mask-type:alpha"/g, 'style={{maskType:"alpha"}}')
    .replace(/style="mask-type:luminance"/g, 'style={{maskType:"luminance"}}')
    // Replace hardcoded colors with prop
    .replace(/fill="white"/g, 'fill={color}')
    .replace(/stroke="white"/g, 'stroke={color}')
    .replace(/fill="black"/g, 'fill={color}')
    .replace(/stroke="black"/g, 'stroke={color}')
    .replace(/fill="#fff"/gi, 'fill={color}')
    .replace(/stroke="#fff"/gi, 'stroke={color}')
    .replace(/fill="#ffffff"/gi, 'fill={color}')
    .replace(/stroke="#ffffff"/gi, 'stroke={color}')
    .replace(/fill="#000"/gi, 'fill={color}')
    .replace(/stroke="#000"/gi, 'stroke={color}')
    .replace(/fill="#000000"/gi, 'fill={color}')
    .replace(/stroke="#000000"/gi, 'stroke={color}')
    // Handle fill and stroke without quotes (some SVGs might have this)
    .replace(/fill=white/g, 'fill={color}')
    .replace(/stroke=white/g, 'stroke={color}');
}

// Extract the SVG content (everything inside <svg>...</svg>)
function extractSvgBody(svgContent) {
  const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) {
    throw new Error('Invalid SVG content');
  }
  return match[1].trim();
}

// Extract viewBox from the SVG tag, falling back to width/height
function extractViewBox(svgContent) {
  const vbMatch = svgContent.match(/viewBox="([^"]*)"/);
  if (vbMatch) return vbMatch[1];

  const wMatch = svgContent.match(/width="([^"]*)"/);
  const hMatch = svgContent.match(/height="([^"]*)"/);
  if (wMatch && hMatch) return `0 0 ${wMatch[1]} ${hMatch[1]}`;

  return '0 0 24 24';
}

// Generate React component from SVG
function generateComponent(svgContent, componentName) {
  const svgBody = extractSvgBody(svgContent);
  const jsxBody = svgToJsx(svgBody);
  const viewBox = extractViewBox(svgContent);
  
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
    viewBox="${viewBox}"
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
  
  const componentNames = new Map();
  let newCount = 0;
  let replacedCount = 0;
  let errorCount = 0;
  
  // Process each SVG file — overwrites existing components (newer version wins)
  svgFiles.forEach((filename, index) => {
    try {
      let componentName = toPascalCase(filename);
      
      if (componentNames.has(componentName)) {
        const count = componentNames.get(componentName);
        componentNames.set(componentName, count + 1);
        componentName = `${componentName}${count + 1}`;
      } else {
        componentNames.set(componentName, 1);
      }
      
      const svgPath = path.join(SVG_DIR, filename);
      const outputPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
      
      const existed = fs.existsSync(outputPath);
      
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const componentCode = generateComponent(svgContent, componentName);
      fs.writeFileSync(outputPath, componentCode);
      
      if (existed) {
        replacedCount++;
      } else {
        newCount++;
      }
      
      if ((index + 1) % 100 === 0) {
        console.log(`  ✓ Processed ${index + 1}/${svgFiles.length} files...`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });
  
  console.log(`\n✅ Generated from SVGs: ${newCount} new, ${replacedCount} replaced`);
  if (errorCount > 0) {
    console.log(`⚠️  Failed to generate ${errorCount} components`);
  }
  
  // Build index from ALL component files in src/icons/ (existing + newly generated)
  console.log('\n📝 Generating index.ts from all components...');
  const allComponentFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(file => file.endsWith('.tsx'))
    .map(file => file.replace('.tsx', ''))
    .sort();
  
  const exports = allComponentFiles
    .map(name => `export { ${name} } from './icons/${name}';`)
    .join('\n');
  
  const indexContent = `// Auto-generated file. Do not edit manually.
export type { IconProps } from './types';

${exports}
`;
  
  fs.writeFileSync(INDEX_FILE, indexContent);
  console.log('✅ Index file generated');
  
  console.log('\n🎉 Icon generation complete!');
  console.log(`   New icons added: ${newCount}`);
  console.log(`   Existing icons replaced: ${replacedCount}`);
  console.log(`   Total components: ${allComponentFiles.length}`);
}

// Run the generator
try {
  generateComponents();
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
