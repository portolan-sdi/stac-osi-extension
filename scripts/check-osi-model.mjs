// Validates the example OSI semantic models against the vendored OSI core-spec schema
// and checks that the YAML and JSON twins of each model stay in sync.
//
// scripts/osi-schema.json is vendored from open-semantic-interchange/OSI
// core-spec/osi-schema.json at commit c2233f0255ba5ba2dbda1afb50e54f8302930a63.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const models = [
  {
    yaml: "examples/nls-buildings.osi.yaml",
    json: "examples/nls-buildings.osi.json",
  },
];

const schema = JSON.parse(readFileSync(join(root, "scripts/osi-schema.json"), "utf8"));
const ajv = new Ajv2020.default({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

let failed = false;

for (const model of models) {
  const fromYaml = yaml.load(readFileSync(join(root, model.yaml), "utf8"));
  const fromJson = JSON.parse(readFileSync(join(root, model.json), "utf8"));

  if (JSON.stringify(fromYaml) !== JSON.stringify(fromJson)) {
    console.error(`FAIL ${model.yaml} and ${model.json} are out of sync`);
    failed = true;
  }

  for (const [file, doc] of [
    [model.yaml, fromYaml],
    [model.json, fromJson],
  ]) {
    if (validate(doc)) {
      console.log(`ok   ${file} is a valid OSI semantic model`);
    } else {
      console.error(`FAIL ${file} does not validate against the OSI core-spec schema`);
      for (const err of validate.errors) {
        console.error(`     ${err.instancePath || "/"} ${err.message}`);
      }
      failed = true;
    }
  }
}

process.exit(failed ? 1 : 0);
