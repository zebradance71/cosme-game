import clsx from 'clsx';
import { serumProfiles } from '../../data/serums';
import type { SerumType, SkinType } from '../../core/game/types';

interface SkinImageLayout {
  imagePath: string;
  hotspots: Array<{
    serum: SerumType;
    left: string;
    top: string;
    width: string;
    height: string;
  }>;
}

interface SerumCardProps {
  skin: SkinType | null;
  selectedSerum: SerumType | null;
  disabled: boolean;
  isApplying: boolean;
  onSelect: (serum: SerumType) => void;
}

export function SerumCard({ skin, selectedSerum, disabled, isApplying, onSelect }: SerumCardProps) {
  // 他の肌質画像はここに追加すれば同じ方式で差し込みできます。
  const skinImageLayouts: Partial<Record<SkinType, SkinImageLayout>> = {
    dry: {
      imagePath: '/assets/images/skins/dry-screen.png',
      hotspots: [
        { serum: 'retinol', left: '2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'vitamin_c', left: '21.4%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'niacinamide', left: '40.8%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'ceramide', left: '60.2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'aha_bha', left: '79.6%', top: '67.25%', width: '18.8%', height: '31.35%' },
      ],
    },
    oily: {
      imagePath: '/assets/images/skins/oily-screen.png',
      hotspots: [
        { serum: 'retinol', left: '2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'vitamin_c', left: '21.4%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'niacinamide', left: '40.8%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'ceramide', left: '60.2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'aha_bha', left: '79.6%', top: '67.25%', width: '18.8%', height: '31.35%' },
      ],
    },
    sensitive: {
      imagePath: '/assets/images/skins/sensitive-screen.png',
      hotspots: [
        { serum: 'retinol', left: '2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'vitamin_c', left: '21.4%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'niacinamide', left: '40.8%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'ceramide', left: '60.2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'aha_bha', left: '79.6%', top: '67.25%', width: '18.8%', height: '31.35%' },
      ],
    },
    pores: {
      imagePath: '/assets/images/skins/pores-screen.png',
      hotspots: [
        { serum: 'retinol', left: '2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'vitamin_c', left: '21.4%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'niacinamide', left: '40.8%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'ceramide', left: '60.2%', top: '67.25%', width: '18.8%', height: '31.35%' },
        { serum: 'aha_bha', left: '79.6%', top: '67.25%', width: '18.8%', height: '31.35%' },
      ],
    },
  };

  const activeLayout = skin ? skinImageLayouts[skin] : undefined;

  if (activeLayout) {
    return (
      <section className={clsx('skin-image-map', isApplying && 'is-applying')} data-skin-map>
        <img src={activeLayout.imagePath} alt="肌質専用の選択画面" />
        {activeLayout.hotspots.map((spot) => (
          <button
            key={spot.serum}
            type="button"
            disabled={disabled}
            aria-label={`${serumProfiles.find((serum) => serum.id === spot.serum)?.label ?? spot.serum}を選択`}
            className={clsx('skin-hotspot', selectedSerum === spot.serum && 'is-selected')}
            data-serum-id={spot.serum}
            style={{
              left: spot.left,
              top: spot.top,
              width: spot.width,
              height: spot.height,
            }}
            onClick={() => onSelect(spot.serum)}
          />
        ))}
      </section>
    );
  }

  return (
    <section className={clsx('serum-grid', isApplying && 'is-applying')}>
      {serumProfiles.map((serum) => (
        <button
          key={serum.id}
          type="button"
          disabled={disabled}
          className={clsx('glass-card serum-card', selectedSerum === serum.id && 'is-selected')}
          data-serum-id={serum.id}
          onClick={() => onSelect(serum.id)}
        >
          <div className="serum-bottle" aria-hidden />
          <strong>{serum.label}</strong>
          <small>{serum.description}</small>
        </button>
      ))}
    </section>
  );
}
