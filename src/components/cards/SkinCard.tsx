import { skinProfiles } from '../../data/skins';
import type { SkinType } from '../../core/game/types';

interface SkinCardProps {
  skin: SkinType | null;
  dailySeed: string;
}

export function SkinCard({ skin, dailySeed }: SkinCardProps) {
  const profile = skinProfiles.find((item) => item.id === skin);

  return (
    <article className="glass-card skin-card">
      <div className="skin-card-head">
        <p className="micro-label">今日の肌質</p>
        {dailySeed ? <span className="daily-badge">DAILY {dailySeed.slice(5)}</span> : null}
      </div>
      <h2>{profile?.label ?? 'タップして診断開始'}</h2>
      <p>{profile?.description ?? '日替わりで肌質カードを引きます'}</p>
    </article>
  );
}
