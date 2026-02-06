const fs = require("fs");
const path = require("path");

const bumpType = process.argv[2];
const validTypes = new Set(["patch", "minor", "major"]);

if (!validTypes.has(bumpType)) {
  throw new Error("Usage: node scripts/bump-version.cjs <patch|minor|major>");
}

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageLockPath = path.join(process.cwd(), "package-lock.json");
const cargoTomlPath = path.join(process.cwd(), "src-tauri", "Cargo.toml");
const cargoLockPath = path.join(process.cwd(), "src-tauri", "Cargo.lock");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const currentVersion = packageJson.version;

const versionMatch = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(currentVersion);
if (!versionMatch) {
  throw new Error(`Invalid version in package.json: ${currentVersion}`);
}

const major = Number(versionMatch[1]);
const minor = Number(versionMatch[2]);
const patch = Number(versionMatch[3]);

let nextVersion = currentVersion;
if (bumpType === "patch") {
  nextVersion = `${major}.${minor}.${patch + 1}`;
}
if (bumpType === "minor") {
  nextVersion = `${major}.${minor + 1}.0`;
}
if (bumpType === "major") {
  nextVersion = `${major + 1}.0.0`;
}

const updateJsonVersion = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.version = nextVersion;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
};

updateJsonVersion(packageJsonPath);
updateJsonVersion(packageLockPath);

const cargoToml = fs.readFileSync(cargoTomlPath, "utf8");
const packageSectionMatch = cargoToml.match(/\[package\][\s\S]*?(?=\n\[|$)/);
if (!packageSectionMatch) {
  throw new Error("[package] section not found in Cargo.toml");
}

const packageSection = packageSectionMatch[0];
const cargoVersionMatch = packageSection.match(/^version\s*=\s*"([^"]+)"/m);
if (!cargoVersionMatch) {
  throw new Error("version not found in [package] section of Cargo.toml");
}

const updatedSection = packageSection.replace(
  cargoVersionMatch[0],
  `version = "${nextVersion}"`,
);
const updatedToml = cargoToml.replace(packageSection, updatedSection);
fs.writeFileSync(cargoTomlPath, updatedToml);

const cargoLock = fs.readFileSync(cargoLockPath, "utf8");
const cargoLockRegex = /(name = "voxara"[\s\S]*?\nversion = ")([^"]+)(")/;
if (!cargoLockRegex.test(cargoLock)) {
  throw new Error("Package entry for voxara not found in Cargo.lock");
}
const updatedCargoLock = cargoLock.replace(
  cargoLockRegex,
  `$1${nextVersion}$3`,
);
fs.writeFileSync(cargoLockPath, updatedCargoLock);

process.stdout.write(`Version bumped ${currentVersion} -> ${nextVersion}\n`);
