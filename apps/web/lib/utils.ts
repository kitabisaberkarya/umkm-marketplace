export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}rb`;
  return String(n);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function productImage(id: string, _size = 400): string {
  const prefix = id.slice(0, 3);
  const num = parseInt(id.slice(3), 10) - 1;
  const pools: Record<string, number[]> = {
    mkm: [1640777,376464,1099680,312418,1860208,958545,1437269,2097090,1410235,699953,3763847,357756,1199957,2116094,1556688],
    fas: [996329,1536619,1055691,934070,3690933,2220316,1379618,1143974,3622608,3622609,5264866,3622607,4614241],
    kra: [1194775,3094230,137059,1093671,3679924,3680896,1031641,2747446,1616035,4210040,3862357],
    kec: [3762875,3685530,2253840,4041392,4465124,3785147,2688392,3762877,3785145,5849581],
    agr: [931177,4033078,1581484,1656666,4226418,2255801,3862143,955360,4041386,4033148],
    ele: [1591062,393047,699122,205421,356056,1029757,3184405,3573351,1779487,4526254],
  };
  const pool = pools[prefix];
  if (pool && pool.length > 0) {
    const photoId = pool[num % pool.length];
    return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;
  }
  return `https://fastly.picsum.photos/seed/${id}/400/400`;
}
