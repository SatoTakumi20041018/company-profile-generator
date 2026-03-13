"use client";

import { useCompanyData } from "../lib/store";
import type { CompanyData } from "../lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">{title}</h3>
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

export default function FormEditor() {
  const { data, setData } = useCompanyData();

  function update(partial: Partial<CompanyData>) {
    setData({ ...data, ...partial });
  }

  function updateOverview(index: number, value: string) {
    const overview = [...data.overview];
    overview[index] = { ...overview[index], value };
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

  return (
    <div className="p-6 overflow-y-auto h-full">
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

      <Section title="ミッション・ビジョン・バリュー">
        <Field label="ミッション" value={data.mission} onChange={(v) => update({ mission: v })} multiline />
        <Field label="ビジョン" value={data.vision} onChange={(v) => update({ vision: v })} />
        {data.values.map((val, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Field label={`Value ${i + 1} 名前`} value={val.name} onChange={(v) => updateValue(i, "name", v)} small />
            <Field label={`Value ${i + 1} 説明`} value={val.description} onChange={(v) => updateValue(i, "description", v)} small />
          </div>
        ))}
      </Section>

      <Section title="会社概要">
        {data.overview.map((item, i) => (
          <Field key={i} label={item.label} value={item.value} onChange={(v) => updateOverview(i, v)} small />
        ))}
      </Section>

      <Section title="事業内容">
        {data.services.map((svc, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
            <Field label={`事業 ${i + 1} タイトル`} value={svc.title} onChange={(v) => updateService(i, "title", v)} small />
            <Field label="説明" value={svc.description} onChange={(v) => updateService(i, "description", v)} small />
            <Field label="ハイライト" value={svc.highlight} onChange={(v) => updateService(i, "highlight", v)} small />
          </div>
        ))}
      </Section>

      <Section title="実績数字">
        {data.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <Field label="数値" value={stat.value} onChange={(v) => updateStat(i, "value", v)} small />
            <Field label="単位" value={stat.unit} onChange={(v) => updateStat(i, "unit", v)} small />
            <Field label="ラベル" value={stat.label} onChange={(v) => updateStat(i, "label", v)} small />
          </div>
        ))}
        <Field label="クライアントロゴ（カンマ区切り）" value={data.clientLogos.join(", ")} onChange={(v) => update({ clientLogos: v.split(",").map(s => s.trim()).filter(Boolean) })} />
      </Section>

      <Section title="チーム">
        <Field label="チーム紹介文" value={data.teamIntro} onChange={(v) => update({ teamIntro: v })} />
        {data.team.map((member, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label="名前" value={member.name} onChange={(v) => updateTeam(i, "name", v)} small />
              <Field label="役職" value={member.role} onChange={(v) => updateTeam(i, "role", v)} small />
            </div>
            <Field label="経歴" value={member.bio} onChange={(v) => updateTeam(i, "bio", v)} small />
          </div>
        ))}
      </Section>

      <Section title="沿革">
        <Field label="沿革紹介文" value={data.timelineIntro} onChange={(v) => update({ timelineIntro: v })} />
        {data.timeline.map((event, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label="年月" value={event.year} onChange={(v) => updateTimeline(i, "year", v)} small />
              <Field label="タイトル" value={event.title} onChange={(v) => updateTimeline(i, "title", v)} small />
            </div>
            <Field label="説明" value={event.description} onChange={(v) => updateTimeline(i, "description", v)} small />
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={event.isHighlight} onChange={(e) => updateTimeline(i, "isHighlight", e.target.checked)} />
              ハイライト表示
            </label>
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
