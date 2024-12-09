const fs = require('fs');
const { upperFirst, zip, kebabCase } = require('lodash');
const path = require('path');
/**
 * Recursively copy a directory from source to destination.
 */

const OLD = {
  resource: 'major',
  resourcePlural: 'majors',
};
const NEW = {
  resource: 'roomSetting',
  resourcePlural: 'roomSettings',
};

function copyDirectory(src, dest, replacements) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, replacements);
    } else if (entry.isFile()) {
      destPath = replaceContent(
        destPath,
        replacements.map((i) => i.map((k) => kebabCase(k))),
      );
      const content = fs.readFileSync(srcPath, 'utf-8');
      const updatedContent = replaceContent(content, replacements);
      fs.writeFileSync(destPath, updatedContent, 'utf-8');
    }
  }
}

/**
 *
 * @param {string} content
 * @param {Array} replacements
 */
function replaceContent(content, replacements = []) {
  let output = content;
  replacements.forEach(([o, n]) => {
    output = output.replaceAll(o, n);
  });

  return output;
}

/**
 * Main function to clone the resource.
 */
function cloneResource() {
  const {
    resource: oldResource,
    resourcePlural: oldResourcePlural = oldResource + 's',
    resourceCapitalized: oldResourceCapitalized = upperFirst(oldResource),
    resourcePluralCapitalized: oldResourcePluralCapitalized = upperFirst(
      oldResourcePlural,
    ),
  } = OLD;
  const {
    resource: newResource,
    resourcePlural: newResourcePlural = newResource + 's',
    resourceCapitalized: newResourceCapitalized = upperFirst(newResource),
    resourcePluralCapitalized: newResourcePluralCapitalized = upperFirst(
      newResourcePlural,
    ),
  } = NEW;

  const srcPath = path.join(__dirname, '../src/resources', oldResourcePlural);
  const destPath = path.join(__dirname, '../src/resources', newResourcePlural);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source resource path "${srcPath}" does not exist.`);
    process.exit(1);
  }
  if (fs.existsSync(destPath)) {
    fs.rmdirSync(destPath, { recursive: true, force: true });
  }

  const replacements = zip(
    [
      oldResourcePluralCapitalized,
      oldResourceCapitalized,
      oldResourcePlural,
      oldResource,
    ],
    [
      newResourcePluralCapitalized,
      newResourceCapitalized,
      newResourcePlural,
      newResource,
    ],
  );

  console.log(`Cloning resource from "${srcPath}" to "${destPath}"...`);
  copyDirectory(srcPath, destPath, replacements);
  console.log(`Resource cloned successfully.`);
}

cloneResource();
