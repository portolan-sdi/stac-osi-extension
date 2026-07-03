# STAC OSI Extension

- **Title:** OSI
- **Identifier:** <https://portolan-sdi.github.io/stac-osi-extension/v0.2.0/schema.json>
- **Field Name Prefix:** osi
- **Scope:** Collection, Item
- **Extension Maturity Classification:** Proposal
- **Owner:** [Portolan SDI](https://github.com/portolan-sdi)

This extension links a STAC Collection or Item to an [OSI](https://github.com/open-semantic-interchange/OSI)
(Open Semantic Interchange, incubating at the Apache Software Foundation as Ossie) semantic model, and surfaces a
searchable summary of the model's metrics. It lets a geospatial or tabular catalog declare the business meaning of its data,
metrics, dimensions, and relationships, so that BI tools and AI agents can consume it through a vendor-neutral standard.

> **Work in Progress.** This is an early Proposal. `osi:spatial` is explicitly experimental, see below. Field names,
> the schema, and the extension URL may change before any stable release.

## Design intent

The extension is deliberately thin. It does not re-describe column types, data contracts, or discovery metadata,
because existing standards already cover those and should be referenced instead of duplicated.

- Column typing comes from the [STAC Table extension](https://github.com/stac-extensions/table) (`table:columns`).
- Discovery stays native to STAC.
- Business meaning, metrics, dimensions, and relationships live in the linked OSI semantic model.

The only genuinely new surface this extension adds is the link from a STAC object to an OSI model, a small set of
searchable summary fields, and an experimental per-column spatial descriptor.

## Stability

| Surface | Status | Covered by `osi:version` |
| ------- | ------ | ------------------------ |
| `osi:version`, `osi:semantic_model_href`, `osi:metrics` | Stable within this Proposal | Yes |
| `osi-semantic-model` link relation, `osi` / `semantic-model` asset roles | Stable within this Proposal | Yes |
| `osi:spatial` column descriptor | **Experimental**, prototypes [OSI Discussion 114](https://github.com/open-semantic-interchange/OSI/discussions/114) | No |

The schema rejects unknown `osi:` prefixed fields at the Collection and Item level and inside `table:columns`
entries, so typos and stale fields from earlier drafts fail validation instead of passing silently.

## Fields

These fields apply at the Collection level and in Item `properties`. Collection is the common case, one semantic
model per collection. Item-level use is intentional and supported for catalogs where each Item carries its own
tabular asset, for example item-per-partition layouts.

| Field Name | Type | Description |
| ----------------------- | --------- | ----------- |
| osi:version | string | **REQUIRED** when the extension is used. Version of the OSI specification the linked model and the `osi:metrics` summary conform to. Does not cover the experimental `osi:spatial` field. |
| osi:semantic_model_href | string | Pointer to the OSI semantic model document, used when the model is not attached as an asset. |
| osi:metrics | \[object] | Denormalized summary of the model's metrics, surfaced for discovery. Each entry has a `name` and an optional `description`. |
| table:columns | \[object] | Column definitions from the STAC Table extension, optionally annotated with the OSI fields below. |

### Column annotations

One optional field annotates objects inside `table:columns`. It sits alongside the Table extension's own
`name`, `type`, and `description`. Semantic role and richer typing are not covered here, they are derivable
from the linked OSI semantic model and have no STAC search consumer, so this extension does not duplicate them.

| Field Name | Type | Description |
| ----------- | ------ | ----------- |
| osi:spatial | object | **Experimental.** Spatial descriptor for a column. See below. |

### osi:spatial object

**Experimental.** A prototype of the OSI spatial dimension descriptor proposed in
[OSI Discussion 114](https://github.com/open-semantic-interchange/OSI/discussions/114). OSI has no spatial
primitives yet, so this field runs ahead of the upstream standard and may change once OSI adopts its own
descriptor. Presence of `osi:spatial` on a column is itself the spatial signal, no separate role field is needed.

| Field Name | Type | Description |
| ------------- | ------ | ----------- |
| geometry_type | string | One of `point`, `line`, `polygon`, `multipolygon`, `geometry`, `geography`, `raster`. Geometry is planar, geography is spherical. |
| srid | integer | EPSG spatial reference identifier, for example `4326`. |
| spatial_index | object | Discrete global grid index carried by the column. Has a `system` (`h3`, `quadbin`, `s2`, `geohash`) and an optional `resolution`. |

### Deltas from OSI Discussion 114

The descriptor keeps its own field names while the upstream proposal is still moving. The differences are recorded
here so the eventual reconciliation is a documented rename, not a surprise.

| This extension | OSI Discussion 114 | Notes |
| -------------- | ------------------ | ----- |
| `osi:spatial.geometry_type` | `spatial_data.type` | Same value space, different name. |
| `osi:spatial.spatial_index` | `spatial_index` with `rollup` | The upstream proposal adds a `rollup` member this extension does not carry yet. |
| Not carried | `geographic_level`, `geographic_hierarchy` | Geographic hierarchy modeling stays in the OSI document until upstream settles. |
| `osi:spatial` as a sibling of the column fields | Nested inside the dimension block | Placement differs because `table:columns` entries are flat objects. |

## Attaching the semantic model

Carry the OSI document as an asset with a role, which keeps OSI as the authoritative source in its own format.

```json
{
  "assets": {
    "semantic-model": {
      "href": "./model.osi.yaml",
      "type": "application/yaml",
      "roles": ["osi", "semantic-model"],
      "title": "OSI semantic model"
    }
  }
}
```

When the model is a peer document rather than an asset of the catalog, point to it with the `osi-semantic-model` link
relation instead.

```json
{
  "links": [
    {
      "rel": "osi-semantic-model",
      "href": "./model.osi.yaml",
      "type": "application/yaml",
      "title": "OSI semantic model"
    }
  ]
}
```

## OSI to STAC mapping

| OSI construct | STAC home | Notes |
| ------------------------- | ----------------------------------------- | ----------- |
| `semantic_model` | Collection, or Catalog for multi-collection models | One model per collection is the common case. |
| `dataset.source` | The GeoParquet or Parquet data asset href | Portolan assets become OSI sources. |
| `dataset.fields` (dimensions) | `table:columns` | Column typing is referenced, not duplicated. Semantic role stays in the OSI model. |
| `metrics` | The attached OSI document, plus `osi:metrics` inline | No STAC analog, this is the new content. |
| `relationships` | The attached OSI document | Cross-collection joins, no STAC analog. |

## Relation to other extensions

- [STAC Table extension](https://github.com/stac-extensions/table) provides the `table:columns` schema this
  extension annotates. The Table extension is a dependency of any object that uses the `osi:spatial` column descriptor.
- [STAC Iceberg extension](https://github.com/portolan-sdi/stac-iceberg-extension) is the natural physical anchor.
  When a collection is Iceberg backed, the OSI dataset source and the Iceberg table identity line up.

## Examples

- [examples/collection.json](examples/collection.json) is a non-geospatial tabular collection with a semantic model.
- [examples/collection-spatial.json](examples/collection-spatial.json) is a geospatial collection demonstrating the
  `osi:spatial` column descriptor on an H3 index column and a WKB geometry column.
- [examples/collection-nls-buildings.json](examples/collection-nls-buildings.json) is a full, real-data example.
  It catalogs the [NLS Finland building footprints](https://source.coop/youssef-harby/geoparquet-overviews)
  GeoParquet on Source Cooperative, 5.65 million rows in ETRS89 / TM35FIN (EPSG:3067) with precomputed geometry
  overviews, and links a complete OSI semantic model provided in both
  [YAML](examples/nls-buildings.osi.yaml) and [JSON](examples/nls-buildings.osi.json). The two formats carry the
  identical model and the test suite keeps them in sync and validates both against the OSI core-spec schema.

The example models pin `osi:version` to `0.2.0.dev0`, the current draft version of the OSI core spec. OSI is
pre-1.0 and mid-incubation, so expect this value to move.

## Building and Testing

This repository uses [stac-node-validator](https://github.com/stac-utils/stac-node-validator) to validate the examples
against the schema, [remark](https://github.com/remarkjs/remark) to lint the documentation, and
[Biome](https://biomejs.dev/) to keep JSON formatting consistent. The extension schema is compiled with
[ajv](https://ajv.js.org/) against the draft-07 meta-schema, and the example OSI semantic models are validated
against the vendored OSI core-spec schema in `scripts/osi-schema.json`.

```bash
npm install
npm test
```

`npm run format` applies safe Biome formatting. A [husky](https://typicode.github.io/husky/) pre-commit hook runs
[lint-staged](https://github.com/lint-staged/lint-staged), which formats staged JSON with Biome and lints staged
Markdown with remark, so formatting stays automatic and safe.

## Contributing

This extension is maintained by the [Portolan SDI](https://github.com/portolan-sdi) project. Issues and pull requests
are welcome. Upstream OSI threads this extension tracks are collected in
[issue #1](https://github.com/portolan-sdi/stac-osi-extension/issues/1).
