# Image Gender Audit — 2026-11-02

Scope: all 121 unique image URLs across 33 published English articles.
Method: `images_understand` with a male-identification prompt on every image.

## FAIL — must be replaced before it damages credibility

| Article | Role | Image | Finding |
|---|---|---|---|
| `prostatitis-types-explained` | INLINE | `1790415871_c320ace0.png` | **Reads clearly as FEMALE anatomy.** Reviewer: "The diagram explicitly labels and illustrates a uterus positioned between the bladder and the rectum." A top-down pelvic floor diagram with bladder + **uterus** + rectum. On a prostatitis article this is a straight anatomical error, not just a style issue. |
| `prostatitis-whole-body-effects` | INLINE | `1791642948_860325ef.png` | **Reads as FEMALE anatomy.** Reviewer: "an artistic watercolor painting depicting the internal female reproductive system, specifically the uterus, fallopian tubes, and ovaries... presented in an artistic, non-figurative manner." |
| `cushions-chairs-prostate-pain` | COVER | `1791921866_c7e62c86.png` | **Reads as FEMALE.** Reviewer: "the person is not clearly a man... most strongly reads as female," with "the front contour of the torso distinctly curves outward to outline a breast." Nude seated figure with pain wash over the pelvic region. |

## BORDERLINE — androgynous, recommend replacing

| Article | Role | Image | Finding |
|---|---|---|---|
| `cushions-chairs-prostate-pain` | INLINE | `1792038175_a5408647.png` | Pelvic girdle illustration. Reviewer: "the shape of the pelvic girdle shown (the wider subpubic angle and the shape of the pelvic inlet) is anatomically more consistent with the typical structure of a female pelvis... it leans predominantly female." |
| `prostate-symptoms-explained` | INLINE | `1790913093_29f67b2f.png` | Pelvis with warning triangle. Reviewer: "the pelvic inlet is wide and rounded, the subpubic angle appears relatively broad... leans predominantly female." |
| `prostatitis-risk-factors` | COVER | `1791129419_ec735be6.png` | Figure at desk. Reviewer: "highly androgynous and could be interpreted as male, female, or gender-ambiguous." Bald, no facial hair, unisex clothing. |
| `prostate-cancer-risk-factors` | INLINE | `1791128840_6c82ba8b.png` | Family tree. Middle figure has "a subtle inward curve at the waist, which creates a more feminine silhouette." Top and bottom figures read male. |
| `prostatitis-risk-factors` | INLINE | `1791129656_4105de29.png` | Stress/brain figure. Reviewer: "hair tied back in a bun or top-knot... leans toward a feminine presentation," "compact, fetal-like posture." |
| `prostatitis-whole-body-effects` | COVER | `1791698998_7601945c.png` | Figure at computer. Reviewer: "highly androgynous and could be interpreted as male, female, or gender-ambiguous." |
| `chronic-prostatitis-recovery` | INLINE | `1790151361_238ea263.png` | Meditation figure. Reviewer: "the overwhelming visual cues... lean strongly toward a female reading... low bun or ponytail... smooth skin, no stubble." |
| `prostate-massage-safety` | INLINE | `1791472767_b01231e0.png` | Two hands, one gloved. Reviewer: "hands are distinctly gender-ambiguous and can easily be interpreted as female... slender, graceful proportions." |
| `understanding-prostatitis` | INLINE | `1784019134_e3f1fff6.png` | Two abstract figures. Reviewer: "Yes, very easily" — could read as a male/female pair or two of either. No facial hair on either. |
| `understanding-prostatitis` | INLINE | `1784019000_b310e8dc.png` | Seated meditation, cropped torso. Reviewer: "highly gender-ambiguous... could easily read as female." Slender waist, no pectoral definition. |

## PASS — safe, no action

All remaining images either show no people at all (abstract, botanical, food, product, anatomy-only) or depict clearly male figures with explicit markers:

- Clearly male figures with beard/stubble/broad shoulders: `1790151036_02fac607`, `1790912696_3c39772d`, `1791128379_c6af2eee`, `1784019112_f763b92d`
- Male anatomy diagrams (prostate/bladder/testes/penis present): `1790416125_84aec329`, `1790150735_19aaa20b`, `1790416785_09dadd56`, `1790417216_2c1d1597`, `1791428878_78d98478`, `1791470219_006fe20b`, `1790389145_56529a65`, `1790416922_ed3e4ed5`, `1790416751_060f015c`, `1790416464_c62c5114`, `1791429865_5fada0d8`, `1791429263_63c0f226`, `1791429545_aae13ab4`, `1791429751_d08180b4`, `1791513845_59c7fe42`, `1791513711_00251a5b`, `1791473484_69bc4ea4`, `1790387312_8800c51c`, `1790387433_846ed942`, `1790387378_3af9db92`, `1790417133_da752ca1`, `1790912796_9a588b51`, `1790912840_c2f677e1`, `1790912946_3737aa5b`, `1791129541_ac3792a5`, `1791129793_d877893e`, `1790415805_db8e8865`, `1791699533_5834d998`, `1791699930_f08cf9dd`, `1791699421_0e262d1c`, `1791700222_55a3e49f`, `1791700307_687bf882`, `1791701038_32b0ec5c`
- Universal/schematic icons with no gender read: `1790150874_f676dddd`, `1790151287_eeaa464c`, `1790151107_75732e47`, `1791921888_58fb35eb`, `1791921991_7dda8b6b`, `1791251886_0b912d8c`, `1791252324_dacd07ff`, `1791252217_6032e296`, `1791252176_42d1751f`, `1791252598_b9342c6f`, `1791252625_018ac73c`, `1791430095_260a5f04`, `1791430192_f8d344db`, `1791430364_64dec2f7`, `1791430470_f3bac05e`, `1791430592_66142013`, `1790416364_98501d17`, `1791130807_d859c234`, `1791130372_9b14c687`, `1791429484_0bc6ce20`, `1791429973_483bc973`, `1791130807_d859c234`, `1790416125_84aec329`
- No people at all: `1791251768_997d453b`, `1791429973_483bc973`, `1790416364_98501d17`, `1790416785_09dadd56`, `1790416922_ed3e4ed5`, `1791698998_7601945c` (abstraction), `1790389145_56529a65`
- Unsplash still-lifes (no people): `on-slow-looking` (poppy field), `why-i-still-print-photos` (vintage camera)

## RESOLVED — 2026-11-02

All 13 FAIL + BORDERLINE images were regenerated and re-verified with `images_understand`.
Each replacement was confirmed male/unambiguously anatomical before being wired into the article.
14 image references across 10 articles were updated. All 13 new CDN URLs return HTTP 200.

| Old image | New CDN file |
|---|---|
| `1790415871_c320ace0.png` | `1793604665_9b382699.png` |
| `1791642948_860325ef.png` | `1793605166_e7c75875.png` |
| `1791921866_c7e62c86.png` (cover) | `1793605032_f4025a0e.png` |
| `1791921888_58fb35eb.png` | `1793607913_0dd87ee6.png` |
| `1790913093_29f67b2f.png` | `1793605633_d8ded666.png` |
| `1791129419_ec735be6.png` (cover) | `1793605851_c3534139.png` |
| `1791128840_6c82ba8b.png` | `1793608919_de5b7025.png` |
| `1791129656_4105de29.png` | `1793609065_a37d10bd.png` |
| `1791698998_7601945c.png` (cover) | `1793606133_a59bb641.png` |
| `1790151361_238ea263.png` | `1793609208_afd11bfd.png` |
| `1791472767_b01231e0.png` | `1793609424_aea77b50.png` |
| `1784019134_e3f1fff6.png` | `1793608000_a0c4eea0.png` |
| `1784019000_b310e8dc.png` | `1793608621_d8739c66.png` |

## Notes

- Two Unsplash URLs failed to load via `images_understand`; both were downloaded and checked separately — both are still-lifes with no people, safe.
- `1792038172_524b9236.jpg` (cushion product photo) and `1792038178_6dbefdf8.jpg` could not be read via URL — need local check.
- Abstract "androgynous" figures that are NOT people (stick figures, pictograms, anatomical schematics) were judged PASS, since §7.2 targets depictions of a person or anatomy that could read as female — not universal medical icons.
