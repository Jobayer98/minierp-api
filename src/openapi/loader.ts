import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { load } from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadYmlFile(relativePath: string): Record<string, unknown> {
  const content = readFileSync(join(__dirname, relativePath), "utf-8");
  return load(content) as Record<string, unknown>;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv &&
      typeof tv === "object"
    ) {
      deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else {
      target[key] = sv;
    }
  }
  return target;
}

export function buildSpec(): Record<string, unknown> {
  const files = [
    "openapi.yml",
    "common/schemas.yml",
    "common/responses.yml",
    "common/parameters.yml",
    "modules/auth.yml",
    "modules/product.yml",
    "modules/customer.yml",
    "modules/sales.yml",
    "modules/dashboard.yml",
  ];

  return files.reduce<Record<string, unknown>>((spec, file) => {
    return deepMerge(spec, loadYmlFile(file));
  }, {});
}
