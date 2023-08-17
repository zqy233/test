#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

function removeComments(text) {
  const pattern = /(\/\/.*\s*|\/\*[\s\S]*?\*\/\s*)/g;
  return text.replace(pattern, "");
}

function main() {
  const stagedFiles = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  })
    .trim()
    .split("\n");

  stagedFiles.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const newContent = removeComments(content);
    fs.writeFileSync(file, newContent, "utf-8");
    execSync(`git add ${file}`);
    fs.writeFileSync(file, content, "utf-8");
  });

  console.log("Removed comments from staged files.");
  process.exit(0);
}

main();
