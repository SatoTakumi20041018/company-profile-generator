export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface Service {
  title: string;
  description: string;
  highlight: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  isHighlight: boolean;
}

export interface NumberStat {
  value: string;
  unit: string;
  label: string;
}

export interface Product {
  name: string;
  description: string;
  price: string;
  features: string;
  targetAudience: string;
  sourceUrl: string;
}

export interface CompanyData {
  // Cover
  companyName: string;
  logoText: string;
  tagline: string;
  subtitle: string;

  // MVV
  mission: string;
  vision: string;
  values: { name: string; description: string }[];

  // Overview
  overview: { label: string; value: string }[];

  // Products
  products: Product[];

  // Services
  services: Service[];

  // Numbers
  stats: NumberStat[];
  clientLogos: string[];

  // Team
  teamIntro: string;
  team: TeamMember[];
  orgStats: { value: string; unit: string; label: string }[];

  // Timeline
  timelineIntro: string;
  timeline: TimelineEvent[];

  // CTA
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText: string;
  contactEmail: string;
  contactPhone: string;
  contactWeb: string;

  // Theme
  primaryColor: string;
  secondaryColor: string;
}

export const defaultCompanyData: CompanyData = {
  companyName: "株式会社サンプルテック",
  logoText: "SAMPLETECH",
  tagline: "テクノロジーで、\nビジネスの未来を\n加速する。",
  subtitle: "AI・クラウド・データを駆使して、企業のDX推進を包括的に支援。導入企業の業務効率を平均68%改善しています。",

  mission: "すべての企業に、\nテクノロジーの恩恵を届ける。",
  vision: "2030年までに、日本企業のDX成功率を10倍にする",
  values: [
    { name: "Speed", description: "意思決定から実行まで最速で動く" },
    { name: "Trust", description: "透明性と約束を守る姿勢で信頼構築" },
    { name: "Impact", description: "数値で語れる成果にこだわる" },
  ],

  overview: [
    { label: "会社名", value: "株式会社サンプルテック" },
    { label: "代表者", value: "代表取締役CEO 山田 太郎" },
    { label: "設立", value: "2018年4月1日" },
    { label: "資本金", value: "3億5,000万円" },
    { label: "従業員数", value: "248名（2026年1月現在）" },
    { label: "売上高", value: "42億円（2025年度）" },
    { label: "所在地", value: "東京都渋谷区神宮前5-1-1" },
    { label: "事業内容", value: "DXコンサルティング / AIソリューション開発 / クラウドインフラ構築" },
  ],

  products: [
    { name: "AI業務自動化パッケージ", description: "定型業務をAIで自動化。書類処理、データ入力、レポート生成を90%効率化します。", price: "月額30万円〜", features: "OCR自動読取 / チャットボット連携 / ダッシュボード / API連携", targetAudience: "業務効率化を目指す中〜大企業", sourceUrl: "" },
    { name: "DX診断サービス", description: "現状の業務プロセスを可視化し、DX推進の優先度とロードマップを策定します。", price: "50万円（初回診断）", features: "現状分析レポート / 改善提案書 / ROI試算 / 3ヶ年ロードマップ", targetAudience: "DX推進を検討中の経営層", sourceUrl: "" },
  ],

  services: [
    { title: "DXコンサルティング", description: "現状分析からロードマップ策定、実行支援まで。業界知見と技術力で実現可能なDX戦略を共創します。", highlight: "導入企業の85%が1年以内にROI達成" },
    { title: "AIソリューション開発", description: "自然言語処理、画像認識、予測分析。ビジネス課題に最適なAIモデルを一気通貫で提供します。", highlight: "平均68%の業務効率改善を実現" },
    { title: "クラウドインフラ構築", description: "AWS / GCP / Azure のマルチクラウド環境を最適設計。セキュリティと可用性を両立します。", highlight: "99.99%のシステム稼働率を保証" },
    { title: "DX人材育成", description: "社内DX推進チームの立ち上げから実践型研修プログラムまで。自走できる組織づくりを支援します。", highlight: "受講者満足度98.2%の研修プログラム" },
  ],

  stats: [
    { value: "520", unit: "社+", label: "累計導入企業数" },
    { value: "98.4", unit: "%", label: "顧客満足度" },
    { value: "68", unit: "%", label: "平均業務効率改善率" },
    { value: "42", unit: "億円", label: "2025年度売上高" },
    { value: "248", unit: "名", label: "従業員数" },
    { value: "4.8", unit: "/5.0", label: "エンゲージメントスコア" },
  ],
  clientLogos: ["TOYOTA", "NTT DATA", "MITSUBISHI", "HITACHI", "SONY", "SoftBank"],

  teamIntro: "テクノロジー×ビジネスの両面を知る経営チームが、顧客の成功にコミットします。",
  team: [
    { name: "山田 太郎", role: "代表取締役CEO", bio: "東京大学工学部卒。Google Japan、McKinseyを経て2018年に創業。" },
    { name: "鈴木 花子", role: "取締役CTO", bio: "MIT CS修士。AWS、LINE AIカンパニーで10年以上のAI/ML開発経験。" },
    { name: "田中 健一", role: "取締役COO", bio: "慶應義塾大学卒。アクセンチュア、リクルートを経て参画。DX戦略策定100件以上。" },
  ],
  orgStats: [
    { value: "32", unit: "歳", label: "平均年齢" },
    { value: "42", unit: "%", label: "女性比率" },
    { value: "15", unit: "カ国", label: "出身国籍数" },
    { value: "87", unit: "%", label: "エンジニア比率" },
  ],

  timelineIntro: "7年間で従業員2名から248名へ。挑戦を続けるスタートアップの軌跡。",
  timeline: [
    { year: "2018年 4月", title: "株式会社サンプルテック設立", description: "渋谷のシェアオフィスで2名で創業。", isHighlight: false },
    { year: "2019年 8月", title: "シリーズA 5億円の資金調達", description: "DNX Ventures、JAFCOから調達。", isHighlight: false },
    { year: "2022年 3月", title: "シリーズB 20億円の資金調達", description: "Sequoia Capital Japan等から調達。", isHighlight: true },
    { year: "2025年 4月", title: "売上高42億円達成・導入500社突破", description: "前年比168%成長。", isHighlight: true },
  ],

  ctaHeading: "テクノロジーで、\nビジネスの未来を\n共に加速しませんか。",
  ctaSubtext: "まずはお気軽にご相談ください。貴社の課題に合わせた最適なDXプランをご提案いたします。",
  ctaButtonText: "無料相談を予約する",
  contactEmail: "contact@sampletech.co.jp",
  contactPhone: "03-1234-5678",
  contactWeb: "sampletech.co.jp",

  primaryColor: "#2563EB",
  secondaryColor: "#7C3AED",
};
