# Menu and catalogue update — reviewed 15 September 2026

- Drinks & sandwiches and Romney’s are in product navigation. Our story and
  Find us appear below product links and at the bottom of the mobile menu.
- Gifts includes only gift categories; Romney’s biscuits, fudge, Kendal Mint
  Cake and traditional sweets remain under Romney’s.
- The new drinks.html includes the 29 drinks from the Google menu transcription
  dated 6 September 2026, preserving names, stated sizes and prices. The ten
  existing chocolate-bar/crisp products remain under a separate Snacks category.
  They have not been relabelled as Romney’s.
- A prominent notice explains sandwiches are temporarily unavailable due to
  supply issues. They remain unavailable and cannot be added to a list.
- coca-cola.html still works and has a canonical link to drinks.html. Product
  breadcrumbs now return to the corresponding category.
- Product pages now show “Add to my list” for ordinary products and keep
  “Choose size & flavours” for ice cream. Food and drinks no longer use the
  fallback text about gift designs.
- The mobile header and filter row fit the screen without horizontal overflow.
  The sandwich notice uses clearer letter spacing on small screens.
- Removed an obsolete privacy-page sentence about a hosted administration area,
  which this static GitHub Pages site does not have.
- The public source and repeatable static build are included. All product
  pages contain their content before JavaScript loads and use portable relative
  paths. The existing logo, all images and ice cream information are preserved.

## Verification

The production build, TypeScript check and all 7,984 local link, asset and
package-manifest checks passed across 196 generated pages. All 298 retained
raster image files were decoded and verified successfully.

Browser review covered the desktop homepage/navigation, Gifts categories,
drinks filtering and search, product detail links, the corrected Add to my
list button, item removal and list persistence when moving between pages.
A 390 × 844 iframe viewport was used for the mobile drinks page and navigation.
The header and filter overflow was corrected and the document width now equals
the viewport width. Our story and Find us appear at the bottom of the mobile
menu; navigation from that menu to Gifts was verified. Existing logo and ice
cream content are preserved. This is representative browser QA, not an
exhaustive device or accessibility audit.

## Pending gift photographs

Google Maps was checked again on 15 September 2026. It shows a limited,
signed-out listing without a Menu tab; opening See more photos explicitly
requests sign-in. The saved menu transcription has no original image URLs.
No new gift photos or substitute images have been added. Google sign-in or the
original gift image files are needed to complete this request. Drinks retain
the previously captured names, sizes and prices; prices were not reverified
against the live Google menu.
