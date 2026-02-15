// scripts/generate-icons.js
const fs = require('fs');
const path = require('path');
const https = require('https');

async function fetchMaterialIcons() {
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function parseCodepoints(data) {
  // Each line is: icon_name codepoint
  return data
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.split(' ')[0])
    .sort();
}

function categorizIcons(icons) {
  // Basic categorization - you can enhance this
  const categories = {
    navigation: [],
    action: [],
    communication: [],
    content: [],
    device: [],
    editor: [],
    file: [],
    hardware: [],
    image: [],
    maps: [],
    notification: [],
    social: [],
    toggle: [],
    av: [],
    alert: [],
    other: []
  };

  icons.forEach(icon => {
    // Simple prefix-based categorization
    if (icon.startsWith('arrow_') || icon.startsWith('navigation_') || ['home', 'menu', 'close'].includes(icon)) {
      categories.navigation.push(icon);
    } else if (icon.startsWith('add') || icon.startsWith('delete') || icon.startsWith('edit') || ['search', 'settings', 'refresh'].includes(icon)) {
      categories.action.push(icon);
    } else if (icon.startsWith('email') || icon.startsWith('chat') || icon.startsWith('message')) {
      categories.communication.push(icon);
    } else if (icon.startsWith('content_')) {
      categories.content.push(icon);
    } else if (icon.startsWith('phone') || icon.startsWith('device')) {
      categories.device.push(icon);
    } else if (icon.startsWith('format_')) {
      categories.editor.push(icon);
    } else if (icon.startsWith('folder') || icon.startsWith('insert_')) {
      categories.file.push(icon);
    } else if (icon.startsWith('computer') || icon.startsWith('keyboard')) {
      categories.hardware.push(icon);
    } else if (icon.startsWith('image') || icon.startsWith('photo')) {
      categories.image.push(icon);
    } else if (icon.startsWith('map') || icon.startsWith('place')) {
      categories.maps.push(icon);
    } else if (icon.startsWith('notification')) {
      categories.notification.push(icon);
    } else if (icon.startsWith('person') || icon.startsWith('group') || icon.startsWith('share')) {
      categories.social.push(icon);
    } else if (icon.startsWith('toggle_') || icon.startsWith('check')) {
      categories.toggle.push(icon);
    } else if (icon.startsWith('play_') || icon.startsWith('pause') || icon.startsWith('volume')) {
      categories.av.push(icon);
    } else if (icon.startsWith('error') || icon.startsWith('warning')) {
      categories.alert.push(icon);
    } else {
      categories.other.push(icon);
    }
  });

  return categories;
}

function generateTypeScript(icons, categories) {
  const template = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
// Total icons: ${icons.length}

/**
 * All available Material Icon names.
 * Source: https://fonts.google.com/icons
 */
export const MATERIAL_ICON_NAMES = [
${icons.map(icon => `  '${icon}'`).join(',\n')}
] as const;

export type MaterialIconName = typeof MATERIAL_ICON_NAMES[number];

/**
 * Material Icons organized by category for easier discovery.
 * Use this when you need to find icons for specific purposes.
 */
export const ICON_CATEGORIES = {
${Object.entries(categories)
  .filter(([_, icons]) => icons.length > 0)
  .map(([category, icons]) => 
    `  ${category}: [\n${icons.map(icon => `    '${icon}'`).join(',\n')}\n  ] as const`
  )
  .join(',\n')}
} as const;

/**
 * Helper function to check if a string is a valid Material Icon name.
 */
export function isMaterialIconName(name: string): name is MaterialIconName {
  return MATERIAL_ICON_NAMES.includes(name as MaterialIconName);
}

/**
 * Get all icons in a specific category.
 */
export function getIconsByCategory(category: keyof typeof ICON_CATEGORIES): readonly string[] {
  return ICON_CATEGORIES[category];
}
`;

  return template;
}

async function main() {
  try {
    console.log('Fetching Material Icons codepoints...');
    const data = await fetchMaterialIcons();
    
    console.log('Parsing icon names...');
    const icons = parseCodepoints(data);
    
    console.log(`Found ${icons.length} icons`);
    
    console.log('Categorizing icons...');
    const categories = categorizIcons(icons);
    
    console.log('Generating TypeScript file...');
    const tsContent = generateTypeScript(icons, categories);
    
    const outputPath = path.join(__dirname, '../src/components/icon/material-icon-names.ts');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✅ Successfully generated ${outputPath}`);
    console.log('\nCategory summary:');
    Object.entries(categories)
      .filter(([_, icons]) => icons.length > 0)
      .forEach(([category, icons]) => {
        console.log(`  ${category}: ${icons.length} icons`);
      });
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();