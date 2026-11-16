# data

Dataset download and import scripts for populating the store.

```text
data/
├── raw/        # Downloaded datasets (git-ignored)
└── processed/  # Cleaned, import-ready files (git-ignored)
```

Planned sources:

| Need | Source | Notes |
| --- | --- | --- |
| Product catalog | Amazon Reviews 2023 (item metadata) | Titles, descriptions, images, reviews. Non-commercial research license. |
| Order lifecycle distributions | Olist Brazilian E-Commerce | Delivery delays, cancellations, basket sizes. CC BY-NC-SA 4.0. |
| Customers | Synthetic | No real personal data. |

Downloaded files are untrusted input: keep them under `raw/` and never commit them.
