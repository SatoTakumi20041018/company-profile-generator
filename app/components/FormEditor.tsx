"use client";

import { useCompanyData } from "../lib/store";
import type { CompanyData } from "../lib/types";
import { useRef } from "react";

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition">
            + 追加
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, small }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; small?: boolean }) {
  const cls = `w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${small ? "text-xs" : ""}`;
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {multiline ? (
        <textarea className={cls} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
      <div>
        <div className="text-xs font-medium text-slate-600">{label}</div>
        <div className="text-xs text-slate-400">{value}</div>
      </div>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition" title="削除">
      ✕
    </button>
  );
}

export default function FormEditor() {
  const { data, setData } = useCompanyData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<CompanyData>) {
    setData({ ...data, ...partial });
  }

  function updateOverview(index: number, field: "label" | "value", value: string) {
    const overview = [...data.overview];
    overview[index] = { ...overview[index], [field]: value };
    update({ overview });
  }

  function updateService(index: number, field: keyof CompanyData["services"][0], value: string) {
    const services = [...data.services];
    services[index] = { ...services[index], [field]: value };
    update({ services });
  }

  function updateStat(index: number, field: keyof CompanyData["stats"][0], value: string) {
    const stats = [...data.stats];
    stats[index] = { ...stats[index], [field]: value };
    update({ stats });
  }

  function updateTeam(index: number, field: keyof CompanyData["team"][0], value: string) {
    const team = [...data.team];
    team[index] = { ...team[index], [field]: value };
    update({ team });
  }

  function updateTimeline(index: number, field: keyof CompanyData["timeline"][0], value: string | boolean) {
    const timeline = [...data.timeline];
    timeline[index] = { ...timeline[index], [field]: value };
    update({ timeline });
  }

  function updateValue(index: number, field: "name" | "description", value: string) {
    const values = [...data.values];
    values[index] = { ...values[index], [field]: value };
    update({ values });
  }

  function updateOrgStat(index: number, field: keyof CompanyData["orgStats"][0], value: string) {
    const orgStats = [...data.orgStats];
    orgStats[index] = { ...orgStats[index], [field]: value };
    update({ orgStats });
  }

  // Export JSON
  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.companyName || "company-profile"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import JSON
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        setData(imported);
      } catch {
        alert("JSONファイルの解析に失敗しました。");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      {/* Import/Export */}
      <div className="mb-6 flex gap-2">
        <button onClick={handleExport} className="flex-1 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition">
          JSON エクスポート
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition">
          JSON インポート
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      <Section title="テーマカラー">
        <div className="flex gap-4">
          <ColorField label="プライマリー" value={data.primaryColor} onChange={(v) => update({ primaryColor: v })} />
          <ColorField label="セカンダリー" value={data.secondaryColor} onChange={(v) => update({ secondaryColor: v })} />
        </div>
      </Section>

      <Section title="表紙">
        <Field label="会社名" value={data.companyName} onChange={(v) => update({ companyName: v })} />
        <Field label="ロゴテキスト" value={data.logoText} onChange={(v) => update({ logoText: v })} />
        <Field label="キャッチコピー" value={data.tagline} onChange={(v) => update({ tagline: v })} multiline />
        <Field label="サブタイトル" value={data.subtitle} onChange={(v) => update({ subtitle: v })} multiline />
      </Section>

      <Section title="ミッション・ビジョン・バリュー" onAdd={() => update({ values: [...data.values, { name: "", description: "" }] })}>
        <Field label="ミッション" value={data.mission} onChange={(v) => update({ mission: v })} multiline />
        <Field label="ビジョン" value={data.vision} onChange={(v) => update({ vision: v })} />
        {data.values.map((val, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-2 gap-2">
              <Field label={`Value ${i + 1} 名前`} value={val.name} onChange={(v) => updateValue(i, "name", v)} small />
              <Field label={`Value ${i + 1} 説明`} value={val.description} onChange={(v) => updateValue(i, "description", v)} small />
            </div>
            {data.values.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ values: data.values.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="会社概要" onAdd={() => update({ overview: [...data.overview, { label: "", value: "" }] })}>
        {data.overview.map((item, i) => (
          <div key={i} className="relative grid grid-cols-[100px_1fr] gap-2">
            <Field label="項目名" value={item.label} onChange={(v) => updateOverview(i, "label", v)} small />
            <Field label="内容" value={item.value} onChange={(v) => updateOverview(i, "value", v)} small />
            {data.overview.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ overview: data.overview.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="事業内容" onAdd={() => update({ services: [...data.services, { title: "", description: "", highlight: "" }] })}>
        {data.services.map((svc, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2 relative">
            <Field label={`事業 ${i + 1} タイトル`} value={svc.title} onChange={(v) => updateService(i, "title", v)} small />
            <Field label="説明" value={svc.description} onChange={(v) => updateService(i, "description", v)} small />
            <Field label="ハイライト" value={svc.highlight} onChange={(v) => updateService(i, "highlight", v)} small />
            {data.services.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ services: data.services.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="実績数字" onAdd={() => update({ stats: [...data.stats, { value: "", unit: "", label: "" }] })}>
        {data.stats.map((stat, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-3 gap-2">
              <Field label="数値" value={stat.value} onChange={(v) => updateStat(i, "value", v)} small />
              <Field label="単位" value={stat.unit} onChange={(v) => updateStat(i, "unit", v)} small />
              <Field label="ラベル" value={stat.label} onChange={(v) => updateStat(i, "label", v)} small />
            </div>
            {data.stats.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ stats: data.stats.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
        <Field label="クライアントロゴ（カンマ区切り）" value={data.clientLogos.join(", ")} onChange={(v) => update({ clientLogos: v.split(",").map(s => s.trim()).filter(Boolean) })} />
      </Section>

      <Section title="チーム" onAdd={() => update({ team: [...data.team, { name: "", role: "", bio: "" }] })}>
        <Field label="チーム紹介文" value={data.teamIntro} onChange={(v) => update({ teamIntro: v })} />
        {data.team.map((member, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2 relative">
            <div className="grid grid-cols-2 gap-2">
              <Field label="名前" value={member.name} onChange={(v) => updateTeam(i, "name", v)} small />
              <Field label="役職" value={member.role} onChange={(v) => updateTeam(i, "role", v)} small />
            </div>
            <Field label="経歴" value={member.bio} onChange={(v) => updateTeam(i, "bio", v)} small />
            {data.team.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ team: data.team.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="組織データ" onAdd={() => update({ orgStats: [...data.orgStats, { value: "", unit: "", label: "" }] })}>
        {data.orgStats.map((stat, i) => (
          <div key={i} className="relative">
            <div className="grid grid-cols-3 gap-2">
              <Field label="数値" value={stat.value} onChange={(v) => updateOrgStat(i, "value", v)} small />
              <Field label="単位" value={stat.unit} onChange={(v) => updateOrgStat(i, "unit", v)} small />
              <Field label="ラベル" value={stat.label} onChange={(v) => updateOrgStat(i, "label", v)} small />
            </div>
            {data.orgStats.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <RemoveButton onClick={() => update({ orgStats: data.orgStats.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="沿革" onAdd={() => update({ timeline: [...data.timeline, { year: "", title: "", description: "", isHighlight: false }] })}>
        <Field label="沿革紹介文" value={data.timelineIntro} onChange={(v) => update({ timelineIntro: v })} />
        {data.timeline.map((event, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2 relative">
            <div className="grid grid-cols-2 gap-2">
              <Field label="年月" value={event.year} onChange={(v) => updateTimeline(i, "year", v)} small />
              <Field label="タイトル" value={event.title} onChange={(v) => updateTimeline(i, "title", v)} small />
            </div>
            <Field label="説明" value={event.description} onChange={(v) => updateTimeline(i, "description", v)} small />
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={event.isHighlight} onChange={(e) => updateTimeline(i, "isHighlight", e.target.checked)} />
              ハイライト表示
            </label>
            {data.timeline.length > 1 && (
              <div className="absolute top-1 right-1">
                <RemoveButton onClick={() => update({ timeline: data.timeline.filter((_, j) => j !== i) })} />
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="CTA（お問い合わせ）">
        <Field label="見出し" value={data.ctaHeading} onChange={(v) => update({ ctaHeading: v })} multiline />
        <Field label="サブテキスト" value={data.ctaSubtext} onChange={(v) => update({ ctaSubtext: v })} multiline />
        <Field label="ボタンテキスト" value={data.ctaButtonText} onChange={(v) => update({ ctaButtonText: v })} />
        <Field label="メール" value={data.contactEmail} onChange={(v) => update({ contactEmail: v })} />
        <Field label="電話番号" value={data.contactPhone} onChange={(v) => update({ contactPhone: v })} />
        <Field label="Webサイト" value={data.contactWeb} onChange={(v) => update({ contactWeb: v })} />
      </Section>
    </div>
  );
}
