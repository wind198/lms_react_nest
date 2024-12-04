const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory from source to destination.
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(srcPath, 'utf-8');
      const updatedContent = replaceContent(
        content,
        'user',
        'teacher',
        'User',
        'Teacher',
      );
      fs.writeFileSync(destPath, updatedContent, 'utf-8');
    }
  }
}

/**
 * Replace case-sensitive content in a file.
 */
function replaceContent(
  content,
  oldLowerCase,
  newLowerCase,
  oldCapitalized,
  newCapitalized,
) {
  return content
    .split(oldLowerCase)
    .join(newLowerCase) // Replace lowercase
    .split(oldCapitalized)
    .join(newCapitalized); // Replace capitalized
}

/**
 * Main function to clone the resource.
 */
function cloneResource(srcResource, destResource) {
  const srcPath = path.join(__dirname, 'src', srcResource);
  const destPath = path.join(__dirname, 'src', destResource);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source resource "${srcResource}" does not exist.`);
    process.exit(1);
  }

  console.log(`Cloning resource from "${srcResource}" to "${destResource}"...`);
  copyDirectory(srcPath, destPath);
  console.log(`Resource cloned successfully.`);
}

// Replace these values as needed
const oldResource = 'users'; // The resource to clone
const newResource = 'teachers'; // The new resource name

cloneResource(oldResource, newResource);
