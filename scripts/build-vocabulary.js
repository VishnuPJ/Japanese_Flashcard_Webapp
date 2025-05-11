// scripts/build-vocabulary.js
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const VOCAB_DATA_DIR = path.join(projectRoot, 'src', 'lib', 'vocabulary-data');
const OUTPUT_FILE = path.join(projectRoot, 'src', 'lib', 'vocabulary.json');

let combinedVocabularyData = [];

console.log('Starting vocabulary build...');
console.log(`Reading from: ${VOCAB_DATA_DIR}`);

try {
  JLPT_LEVELS.forEach(level => {
    const fileName = `${level.toLowerCase()}_webapp.txt`;
    const filePath = path.join(VOCAB_DATA_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Reading file: ${filePath}`);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      try {
        const items = JSON.parse(fileContent);
        if (Array.isArray(items)) {
          // Ensure items have basic structure, especially 'level' to match original logic expectations
          const validItems = items.map(item => ({
            ...item,
            level: item.level || level.toUpperCase(), // Ensure level is set, defaulting to file's level
          }));
          combinedVocabularyData.push(...validItems);
          console.log(`Successfully parsed and added ${validItems.length} items from ${fileName}`);
        } else {
          console.error(`Error: Content of ${fileName} is not a JSON array.`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error parsing JSON from ${fileName}:`, errorMessage);
      }
    } else {
      console.warn(`Vocabulary file not found: ${filePath}. Skipping this level.`);
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combinedVocabularyData, null, 2), 'utf-8');
  console.log(`Successfully wrote ${combinedVocabularyData.length} items to ${OUTPUT_FILE}`);

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Fatal error during vocabulary build process:', errorMessage, error);
  process.exit(1);
}

console.log('Vocabulary build finished.');
