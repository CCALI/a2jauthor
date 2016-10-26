import path from 'path-browserify';

export default function(pathToGuideFolder, filePath) {
  if (!pathToGuideFolder || !filePath) throw new Error('Invalid parameters');

  // Keep fully qualified web path
  if (filePath.indexOf('http') === 0) return filePath;

  // handle paths using either slash or backslash (windows) as a separator
  let filename = filePath.split('\\').pop().split('/').pop();

  // ...otherwise default to file within guide's folder
  return path.join(pathToGuideFolder, filename);
}
