import fs = require('fs');

export function readJSON(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, jsonString) => {
      if (err) reject(err);
      else resolve(jsonString);
    });
  });
}
