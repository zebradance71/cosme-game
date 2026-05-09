export interface RecoveryItem {
  name: string;
  /** カード用 PR 一言（1 行表示・長い場合は省略） */
  note: string;
  url: string;
  iconLabel: string;
  asin?: string;
  imageUrls: string[];
}

function buildPageShotUrl(url: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=120&h=120`;
}

function buildAmazonImageUrls(asin: string) {
  return [
    `https://images-fe.ssl-images-amazon.com/images/P/${asin}.09.MAIN._SX110_.jpg`,
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.09.MAIN._SX110_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.09.MAIN._SX110_.jpg`,
    `https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL110_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1`,
  ];
}

const recoveryItemsMaster: RecoveryItem[] = [
  {
    name: 'ONE BY KOSE ポアクリア オイル',
    note: '毛穴汚れをオフしながら、うるおいキープ。',
    url: 'https://amzn.to/3RtDl2k',
    iconLabel: 'KB',
    asin: 'B0BXSHJ3XS',
    imageUrls: [...buildAmazonImageUrls('B0BXSHJ3XS'), buildPageShotUrl('https://amzn.to/3RtDl2k')],
  },
  {
    name: 'トゥヴェール バリアショット',
    note: 'ゆらぎやすい肌を、しっとりバリアケア。',
    url: 'https://www.amazon.co.jp/%E3%80%90NEW%E3%80%91%E3%83%88%E3%82%A5%E3%83%B4%E3%82%A7%E3%83%BC%E3%83%AB-%E3%83%90%E3%83%AA%E3%82%A2%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%E3%83%AD%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-120mL-%E3%82%BB%E3%83%A9%E3%83%9F%E3%83%89-%E3%83%AF%E3%82%BB%E3%83%AA%E3%83%B3/dp/B0FSRZCL24/ref=sxin_14_pa_sp_search_thematic_sspa?content-id=amzn1.sym.e574a040-02f1-41c6-8564-38df80fe61cb%3Aamzn1.sym.e574a040-02f1-41c6-8564-38df80fe61cb&crid=35JDPXBDV0XXN&cv_ct_cx=%E3%83%AF%E3%83%B3%E3%83%90%E3%82%A4%E3%82%B3%E3%83%BC%E3%82%BB%E3%83%BC&keywords=%E3%83%AF%E3%83%B3%E3%83%90%E3%82%A4%E3%82%B3%E3%83%BC%E3%82%BB%E3%83%BC&pd_rd_i=B0FSRZCL24&pd_rd_r=6d815aa7-efa6-4b6f-80be-e16c651eac19&pd_rd_w=C9opu&pd_rd_wg=ltyqb&pf_rd_p=e574a040-02f1-41c6-8564-38df80fe61cb&pf_rd_r=46HWN9RCX7G8MG5H98X3&qid=1778239935&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=%E3%83%AF%E3%83%B3%E5%80%8D%2Caps%2C222&sr=1-2-a44f0a3e-30fe-4108-aa5d-436918dfd66f-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9zZWFyY2hfdGhlbWF0aWM&psc=1',
    iconLabel: 'TV',
    asin: 'B0FSRZCL24',
    imageUrls: [...buildAmazonImageUrls('B0FSRZCL24'), buildPageShotUrl('https://www.amazon.co.jp/dp/B0FSRZCL24')],
  },
  {
    name: 'The Ordinary N10+Z1',
    note: '肌を整え、テカリと毛穴をすっきりケア。',
    url: 'https://www.amazon.co.jp/Ordinary-%E3%82%AA%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8A%E3%83%AA%E3%83%BC-Z1%E3%83%95%E3%82%A7%E3%82%A4%E3%82%B9%E3%82%BB%E3%83%A9%E3%83%A0%EF%BC%88%E3%83%8A%E3%82%A4%E3%82%A2%E3%82%B7%E3%83%B3%E3%82%A2%E3%83%9F%E3%83%89-%E4%BA%9C%E9%89%9B1-60ml/dp/B0DC61XNLX?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=EK4G1ZT7ZZG5&dib=eyJ2IjoiMSJ9.QoUnp_7IYal3CzLfoRIThTbkXNsheubLvaNIITLTYj9OobOP1516wICGgyB7jV4jnePdBqZYAJHuDKcWxgv2lCzyJGSH7qkTLgXuA5EvRxOeLdpCEPQRS6wyjzHuopxv7B-AjYg7kUsOeH6lpM0U0vOhoQAE-hqXiGJPY7lkEi5QcZAalwi53M5A0VBUHx3H7dq9GtX5vPr7E5osRESZ4oyxaEhef8HFYkIBjSLNPKrXL4c0txU3qJiYQcN7klCM4GT-kvxtLCe-Cr5cCPJZOXKWCGj1lhC16aBDvOeiIpA.Q73VGjguWHWImAawEy-1EE8I3dAx6ekLdPckFkDiHtI&dib_tag=se&keywords=%E7%BE%8E%E5%AE%B9%E6%B6%B2&qid=1778240140&sprefix=%E7%BE%8E%E5%AE%B9%E6%B6%B2,aps,188&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=sl2&tag=zebradance-22&linkId=7d3f7e09ff27c98fa1368e6e5c2d2042&ref_=as_li_ss_tl',
    iconLabel: 'TO',
    asin: 'B0DC61XNLX',
    imageUrls: [...buildAmazonImageUrls('B0DC61XNLX'), buildPageShotUrl('https://www.amazon.co.jp/dp/B0DC61XNLX')],
  },
  {
    name: 'ORBIS クレンジングオイル',
    note: 'メイクも毛穴汚れも、するんとオフ。',
    url: 'https://amzn.to/4tsu883',
    iconLabel: 'OR',
    asin: 'B0F785ZK2M',
    imageUrls: [...buildAmazonImageUrls('B0F785ZK2M'), buildPageShotUrl('https://amzn.to/4tsu883')],
  },
  {
    name: "d'Alba スプレーセラム",
    note: 'うるおいミストで、ツヤ肌チャージ。',
    url: 'https://amzn.to/4desTTG',
    iconLabel: 'DA',
    asin: 'B0BFQ9RD5B',
    imageUrls: [...buildAmazonImageUrls('B0BFQ9RD5B'), buildPageShotUrl('https://amzn.to/4desTTG')],
  },
  { name: 'ANUA PDRNセラム', note: '高密度うるおいで、しっとり肌へ。', url: 'https://amzn.to/4d08seA', iconLabel: 'AP', imageUrls: [buildPageShotUrl('https://amzn.to/4d08seA')] },
  { name: 'medicube PDRNアンプル', note: 'PDRNケアで、ハリ感とうるおいを補給。', url: 'https://amzn.to/498N2tp', iconLabel: 'MC', imageUrls: [buildPageShotUrl('https://amzn.to/498N2tp')] },
  { name: 'メラノCC プレミアム美容液', note: 'ビタミンCケアで、透明感をサポート。', url: 'https://amzn.to/49vdJbx', iconLabel: 'UL', imageUrls: [buildPageShotUrl('https://amzn.to/49vdJbx')] },
  { name: 'NILE パーフェクトセラム', note: 'レチノール配合で、なめらか肌へ。', url: 'https://amzn.to/4uD3eLD', iconLabel: 'MJ', imageUrls: [buildPageShotUrl('https://amzn.to/4uD3eLD')] },
  { name: 'Klairs ビタミンドロップ', note: 'ビタミンC配合で、キメをなめらかに。', url: 'https://amzn.to/48RYNUS', iconLabel: 'BR', imageUrls: [buildPageShotUrl('https://amzn.to/48RYNUS')] },
  { name: 'ANUA レチノール0.3セラム', note: 'レチノール×ナイアシンで、毛穴印象をケア。', url: 'https://amzn.to/4wjfVwA', iconLabel: 'MS', imageUrls: [buildPageShotUrl('https://amzn.to/4wjfVwA')] },
  { name: 'ANUA ビタミン10 セラム', note: 'ビタミン配合で、透明感ケアを強化。', url: 'https://amzn.to/42VgfUV', iconLabel: 'AN', imageUrls: [buildPageShotUrl('https://amzn.to/42VgfUV')] },
  { name: 'unlabel Vエッセンス', note: 'ビタミンC誘導体で、毛穴とくすみをケア。', url: 'https://amzn.to/4tYGYf8', iconLabel: 'PS', imageUrls: [buildPageShotUrl('https://amzn.to/4tYGYf8')] },
  { name: 'unlabel Rエッセンス', note: 'レチノール誘導体で、ハリ感をサポート。', url: 'https://amzn.to/3QTwQpy', iconLabel: 'BE', imageUrls: [buildPageShotUrl('https://amzn.to/3QTwQpy')] },
  { name: '無印良品 発酵導入美容液', note: '洗顔後すぐの導入ケアに。', url: 'https://amzn.to/4euTBKa', iconLabel: 'SS', imageUrls: [buildPageShotUrl('https://amzn.to/4euTBKa')] },
  { name: 'フィスホワイト 美白美容液', note: 'ビタミンC系配合で、明るい印象へ。', url: 'https://amzn.to/4tjBZob', iconLabel: 'FW', imageUrls: [buildPageShotUrl('https://amzn.to/4tjBZob')] },
  { name: 'ラロッシュポゼ メラB3', note: 'ナイアシンアミド配合で、くすみケア。', url: 'https://amzn.to/3PduMYX', iconLabel: 'LR', imageUrls: [buildPageShotUrl('https://amzn.to/3PduMYX')] },
  { name: 'celimax ビタA ブースター', note: 'ビタA系で、ハリ感ケアをサポート。', url: 'https://amzn.to/4trF1H4', iconLabel: 'CX', imageUrls: [buildPageShotUrl('https://amzn.to/4trF1H4')] },
  { name: 'エリクシール レチノパワー', note: '純粋レチノールで、ハリ密度ケア。', url: 'https://amzn.to/4f9NKtS', iconLabel: 'EX', imageUrls: [buildPageShotUrl('https://amzn.to/4f9NKtS')] },
];

export function pickUniqueRecoveryItems(count: number): RecoveryItem[] {
  const pool = [...recoveryItemsMaster];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(1, Math.min(count, pool.length)));
}
