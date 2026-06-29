# STAC OSI Extension

- **Title:** OSI
- **Identifier:** <https://portolan-sdi.github.io/stac-osi-extension/v0.1.0/schema.json>
- **Field Name Prefix:** osi
- **Scope:** Collection, Item
- **Extension Maturity Classification:** Proposal
- **Owner:** [Portolan SDI](https://github.com/portolan-sdi)

This extension links a STAC Collection or Item to an [OSI](https://github.com/open-semantic-interchange/OSI)
(Open Semantic Interchange, incubating at the Apache Software Foundation as Ossie) semantic model, and annotates the
semantic role of tabular columns. It lets a geospatial or tabular catalog declare the business meaning of its data,
metrics, dimensions, and relationships, so that BI tools and AI agents can consume it through a vendor-neutral standard.

> **Work in Progress.** This is an early Proposal. OSI itself has no spatial primitives yet, so the spatial fields here run
> ahead of the upstream standard. Field names, the schema, and the extension URL may change before any stable release.

## Design intent

The extension is deliberately thin. It does not re-describe column types, data contracts, or discovery metadata,
because existing standards already cover those and should be referenced instead of duplicated.

- Column typing comes from the [STAC Table extension](https://github.com/stac-extensions/table) (`table:columns`).
- Discovery stays native to STAC.
- Business meaning, metrics, dimensions, and relationships live in the linked OSI semantic model.

The only genuinely new surface this extension adds is the link from a STAC object to an OSI model, a small set of
searchable summary fields, and per-column semantic role annotations.

## Fields

These fields apply at the Collection level and in Item `properties`.

| Field Name | Type | Description |
| ----------------------- | --------- | ----------- |
| osi:version | string | **REQUIRED** when the extension is used. Version of the OSI specification the linked model and annotations conform to. |
| osi:semantic_model_href | string | Pointer to the OSI semantic model document, used when the model is not attached as an asset. |
| osi:metrics | \[object] | Denormalized summary of the model's metrics, surfaced for discovery. Each entry has a `name` and an optional `description`. |
| table:columns | \[object] | Column definitions from the STAC Table extension, optionally annotated with the OSI fields below. |

### Column annotations

These optional fields annotate each object inside `table:columns`. They sit alongside the Table extension's own
`name`, `type`, and `description`.

| Field Name | Type | Description |
| ----------------- | ------ | ----------- |
| osi:role | string | Semantic role of the column. One of `dimension`, `measure`, `time`, `spatial`. |
| osi:semantic_type | string | Optional richer semantic type, for example `currency`, `identifier`, or `email`. |
| osi:spatial | object | Spatial descriptor for a column whose role is `spatial`. See below. |

### osi:spatial object

A prototype of the OSI spatial dimension descriptor proposed in
[OSI Discussion 114](https://github.com/open-semantic-interchange/OSI/discussions/114).

| Field Name | Type | Description |
| ------------- | ------ | ----------- |
| geometry_type | string | One of `point`, `line`, `polygon`, `multipolygon`, `geometry`, `geography`, `raster`. Geometry is planar, geography is spherical. |
| srid | integer | EPSG spatial reference identifier, for example `4326`. |
| spatial_index | object | Discrete global grid index carried by the column. Has a `system` (`h3`, `quadbin`, `s2`, `geohash`) and an optional `resolution`. |

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
| `dataset.fields` (dimensions) | `table:columns` plus `osi:role` | Column typing is referenced, the role is added. |
| `metrics` | The attached OSI document, plus `osi:metrics` inline | No STAC analog, this is the new content. |
| `relationships` | The attached OSI document | Cross-collection joins, no STAC analog. |

## Relation to other extensions

- [STAC Table extension](https://github.com/stac-extensions/table) provides the `table:columns` schema this
  extension annotates. The Table extension is a dependency of any object that uses OSI column roles.
- [STAC Iceberg extension](https://github.com/portolan-sdi/stac-iceberg-extension) is the natural physical anchor.
  When a collection is Iceberg backed, the OSI dataset source and the Iceberg table identity line up.

## Examples

- [examples/collection.json](examples/collection.json) is a non-geospatial tabular collection with a semantic model.
- [examples/collection-spatial.json](examples/collection-spatial.json) is a geospatial collection demonstrating the
  `osi:spatial` column descriptor on an H3 index column and a WKB geometry column.

## Building and Testing

This repository uses [stac-node-validator](https://github.com/stac-utils/stac-node-validator) to validate the examples
against the schema, and [remark](https://github.com/remarkjs/remark) to lint the documentation.

```bash
npm install
npm test
```

## Contributing

This extension is maintained by the [Portolan SDI](https://github.com/portolan-sdi) project. Issues and pull requests
are welcome.
