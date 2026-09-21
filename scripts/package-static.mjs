import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const output = path.resolve("dist");
const manifest = JSON.parse(fs.readFileSync("PACKAGE-CONTENTS.json", "utf8"));
fs.rmSync(output, { recursive: true, force: true });
for (const { path: file, sha256 } of manifest.files) {
  if (path.isAbsolute(file) || file.split("/").includes(".."))
    throw Error("Invalid public path: " + file);
  const bytes = fs.readFileSync(file);
  if (crypto.createHash("sha256").update(bytes).digest("hex") !== sha256)
    throw Error("Manifest mismatch: " + file);
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
}
fs.copyFileSync(
  "PACKAGE-CONTENTS.json",
  path.join(output, "PACKAGE-CONTENTS.json"),
);
console.log(
  `Verified and packaged ${manifest.files.length} public files in dist/`,
);
