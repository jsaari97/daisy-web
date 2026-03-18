#!/usr/bin/env node
"use strict";

const { existsSync, mkdirSync, writeFileSync } = require("fs");
const path = require("path");

const SAMPLE_URL =
  "https://dl.daisy.org/samples/3full-text-full-audio/are-you-ready-z3986.zip";

const fileName = path.basename(new URL(SAMPLE_URL).pathname) || "sample.zip";
const targetDir = path.resolve("public/samples");
const targetFile = path.join(targetDir, fileName);

const main = async () => {
  if (existsSync(targetFile)) {
    console.log(`Sample already exists: ${targetFile}`);
    return;
  }

  mkdirSync(targetDir, { recursive: true });
  const response = await fetch(SAMPLE_URL);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}) for ${SAMPLE_URL}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  writeFileSync(targetFile, data);
  console.log(`Saved ${fileName} (${data.length} bytes) to ${targetDir}`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
