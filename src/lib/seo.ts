import type { Catalogue } from "./catalogue";
import {
  categoryProducts,
  categoryURL,
  establishedYear,
  productURL,
  optimizedImage,
} from "./catalogue";
import type { PageInfo } from "./routes";
export const origin = "https://www.lakesidepicnic.co.uk";

export function structuredData(c: Catalogue, page: PageInfo) {
  const store = {
    "@type": ["Store", "LocalBusiness"],
    "@id": origin + "/#store",
    name: "Lakeside Picnic",
    url: origin + "/",
    foundingDate: String(establishedYear),
    description:
      "Independent shop in Waterhead, Ambleside by Lake Windermere, serving Lakes Ice Cream, coffee, cold drinks and snacks, with Romney’s Kendal Mint Cake and Lake District gifts.",
    telephone: c.settings.phone,
    priceRange: "£",
    image: origin + "/brand/identity-board.jpeg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Borrans Road, Waterhead",
      addressLocality: "Ambleside",
      addressRegion: "Cumbria",
      postalCode: c.settings.postcode,
      addressCountry: "GB",
    },
    geo: { "@type": "GeoCoordinates", latitude: 54.4329, longitude: -2.9614 },
    areaServed: [
      "Waterhead, Ambleside",
      "Ambleside",
      "Lake Windermere",
      "Lake District",
    ].map((name) => ({ "@type": "Place", name })),
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=Lakeside+Picnic+Waterhead+Ambleside+LA22+0ES",
  };
  const graph: Record<string, unknown>[] = [
    store,
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: "Lakeside Picnic",
      publisher: { "@id": origin + "/#store" },
      inLanguage: "en-GB",
    },
    {
      "@type": "WebPage",
      "@id": origin + page.path + "#webpage",
      url: origin + page.path,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": origin + "/#website" },
      about: { "@id": origin + "/#store" },
      inLanguage: "en-GB",
    },
  ];
  const product =
    page.kind === "product"
      ? c.products.find((p) => p.id === page.productId)
      : undefined;
  if (page.path !== "/") {
    const crumbs = [{ name: "Home", item: origin + "/" }];
    if (product)
      crumbs.push({
        name:
          c.categories.find((cat) => cat.id === product.category)?.name ||
          "Our range",
        item: origin + categoryURL(product.category),
      });
    crumbs.push({
      name: product?.name || page.title,
      item: origin + page.path,
    });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": origin + page.path + "#breadcrumb",
      itemListElement: crumbs.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...crumb,
      })),
    });
  }
  if (product) {
    const price =
      product.category === "ice-cream"
        ? (c.settings.singlePrice ?? product.price)
        : product.price;
    graph.push({
      "@type": "Product",
      "@id": origin + page.path + "#product",
      name: product.name,
      sku: product.id,
      mpn: product.manufacturerSku,
      material: product.material,
      additionalProperty:
        product.diameterCm || product.packaging
          ? [
              ...(product.diameterCm
                ? [{ "@type": "PropertyValue", name: "Diameter", value: product.diameterCm, unitCode: "CMT" }]
                : []),
              ...(product.packaging
                ? [{ "@type": "PropertyValue", name: "Packaging", value: product.packaging }]
                : []),
            ]
          : undefined,
      category: product.category,
      description: product.description || page.description,
      image: product.gallery?.length
        ? product.gallery.map((item) => origin + optimizedImage(item.src))
        : product.image
          ? origin + optimizedImage(product.image)
          : undefined,
      brand: product.supplier
        ? { "@type": "Brand", name: product.supplier }
        : undefined,
      offers:
        price !== null
          ? {
              "@type": "Offer",
              price: String(price),
              priceCurrency: "GBP",
              availability: product.available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: origin + page.path,
              seller: { "@id": origin + "/#store" },
              availableAtOrFrom: { "@id": origin + "/#store" },
            }
          : undefined,
    });
  }
  if (page.kind === "catalogue") {
    const items = categoryProducts(c, page.category).sort(
      (a, b) => Number(b.featured) - Number(a.featured),
    );
    if (items.length)
      graph.push({
        "@type": "ItemList",
        "@id": origin + page.path + "#items",
        name: page.title,
        numberOfItems: items.length,
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: origin + productURL(p),
        })),
      });
  }
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
}
