import { useMemo, useState } from 'react';
import type { RecoveryItem } from './recoveryItems';

interface RecoverySuggestionCardProps {
  imagePath: string | null;
  item: RecoveryItem;
  /** レア結果帯などで余白を詰める */
  compact?: boolean;
  kickerText?: string;
  /** 指定時は item の name の代わりに表示 */
  displayTitle?: string;
  /** 指定時は item.note（PR 一言）の代わりに表示 */
  displaySubtitle?: string;
}

export function RecoverySuggestionCard({
  imagePath,
  item,
  compact = false,
  kickerText = 'RECOVERY提案',
  displayTitle,
  displaySubtitle,
}: RecoverySuggestionCardProps) {
  const selectedItem = useMemo(() => item, [item]);
  const [imageIndex, setImageIndex] = useState(0);
  const currentImageUrl = selectedItem.imageUrls[imageIndex] ?? null;
  const title = displayTitle ?? selectedItem.name;
  const subtitle = displaySubtitle ?? selectedItem.note;

  return (
    <a
      href={selectedItem.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`recovery-suggestion-card glass-card recovery-suggestion-link${compact ? ' recovery-suggestion-card--compact' : ''}`}
      aria-label={`${title} を開く`}
    >
      <p className="recovery-kicker">{kickerText}</p>
      <div className="recovery-item-row">
        <div className="recovery-thumb-wrap" aria-hidden>
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt=""
              className="recovery-thumb"
              onError={() => setImageIndex((prev) => prev + 1)}
            />
          ) : imagePath ? (
            <img src={imagePath} alt="" className="recovery-thumb" />
          ) : (
            <span className="recovery-thumb-fallback">{selectedItem.iconLabel}</span>
          )}
        </div>
        <div className="recovery-item-copy">
          <p className="recovery-item-name">{title}</p>
          <p className="recovery-item-note recovery-item-note--pr-line" title={subtitle}>
            {subtitle}
          </p>
        </div>
        <span className="recovery-item-button">
          VIEW
        </span>
      </div>
    </a>
  );
}
