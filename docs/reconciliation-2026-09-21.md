# Work/Sites reconciliation — 21 September 2026

## Baseline and decisions

GitHub main at start: `e32bb1f5ac22737e8b0add502b4a07ff2d20f77f`.
Original Work/Sites source: `c1eff49e1c8b7770b94d8897acbdd05d61553fa9`.
The current catalogue JSON is byte-for-byte preserved: 178 records, 177 visible,
12 ice cream flavours and 39 local Drinks + Snacks images. The sandwich record
remains hidden/unavailable. Prices remain £3.50 / £6.50 / £8.00.

Preserved the forest-green identity, serif typography, lakeside-blue hero,
current logo, authentic assets, all product facts, the queue-based local list,
the full product navigation, separate Romney’s collection and local SEO work.
No hours or new closure messaging were introduced. Public location text uses
Waterhead, Ambleside; existing structured business-location data is retained.

## Design and accessibility

- More compact header and two-line mobile hero title.
- One deliberate separator before the secondary mobile links.
- Consistent product frames, card baselines, 44px add/quantity controls and
  readable metadata. Coffee photography fills its frame; Romney’s packshots
  have a white surface, avoiding visible white rectangles on tinted cards.
- Products without photographs use a single typographic card, removing the
  duplicated name and pretend image tile. There are 66 such visible records
  in the inherited catalogue (60 gifts, five Romney’s and one hot drink).
  No substitute or invented photographs were added.
- Real drinks packshots now appear in the homepage category tile.
- Range-maker prose follows the ice cream grid. Sandwich information is a
  concise note. Category introductions use natural visible copy, separate
  from search metadata.
- Intrinsic dimensions for all rendered images, high priority for logo/hero,
  lazy loading for supporting photography; persistent hero animation removed.
- Correct heading levels for catalogue cards and nutrition sections, visible
  focus, exposed filter state and stronger muted-text contrast.

## Build and SEO repairs

The newest build script contained literal escaped newlines outside a string
and failed Node syntax validation. Production therefore lagged recent source
SEO changes even though the independent package workflow showed success.

The repaired build reads only source, including the stylesheet. Shared category
selection now drives both visible cards and ItemList schema, fixing the empty
Gifts schema and missing Snacks in Drinks. Product prices match visible scoop
pricing; breadcrumbs include the actual parent category. Product social metadata
uses its own photograph, or omits the image if none exists. Thunder & Lightning
and Double Jersey descriptions address flavour intent; the homepage remains a
broad shop page. Utility pages remain noindex; robots allows the list page to
be crawled so its noindex can be observed. Alias metadata matches canonical pages.

The workflow validates source, builds, runs complete static and selection QA,
checks remote main, commits generated output and deploys the verified public
artifact. Pull requests cannot commit or deploy. The obsolete independent
manifest-refresh/verify workflows are superseded by this single gated build.
The former client-only catalogue-price upgrade patch was removed; every page
now embeds the same source catalogue. Old list normalization is retained.

## Validation

- TypeScript and static build pass.
- 196 pages, 540 packaged public files; 15,306 static checks pass.
- 178/177 catalogue counts, hidden sandwiches, 39 Drinks + Snacks images,
  all local links, image dimensions, duplicate IDs, schema/card counts,
  canonical/social metadata and manifest hashes checked.
- Automated axe WCAG A/AA + best-practice review: 45 views, comprising
  15 representative pages at 390, 768 and 1280px; zero violations,
  broken images or horizontal overflow after fixes.
- Selection-rule checks cover sizes, vessels, prices, multiple/repeated
  flavours, persisted list normalization, unavailable choices and quantity caps.
- All 111 existing public product photographs inspected in contact sheets;
  all 337 packaged raster images decoded successfully.
  No new product identity assumptions were made. Some inherited coffee images
  are shared between products; exact new photographs would need the owner’s
  authentic assets to replace them.
- PageSpeed Insights returned HTTP 429. No Lighthouse score or real-user
  Core Web Vitals pass is claimed. Current gzip sizes are approximately
  139KB JavaScript, 31KB CSS and 13KB homepage HTML. No font request is required.

Deployment and exact production verification are recorded in the completion
response and the associated GitHub Actions run.
