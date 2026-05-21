// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
// Sibling at repo root — lets us reuse type helpers (e.g. Locale) from the web project.
const repoRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch the web project's lib/ for live reload when shared types change.
config.watchFolders = [path.resolve(repoRoot, "lib")];

// Resolve modules only from mobile/node_modules — keeps React Native deps
// separated from the web's React 19 install at repo root.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
