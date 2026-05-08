import { useMemo, useState } from 'react';
import type { RecoveryItem } from './recoveryItems';

interface RecoverySuggestionCardProps {
  imagePath: string | null;
  item: RecoveryItem;
}

export function RecoverySuggestionCard({ imagePath, item }: RecoverySuggestionCardProps) {
  const selectedItem = useMemo(() => item, [item]);
  const [imageIndex, setImageIndex] = useState(0);
  const currentImageUrl = selectedItem.imageUrls[imageIndex] ?? null;

  return (
    <a
      href={selectedItem.url}
      target="_blank"
      rel="noreferrer"
      className="recovery-suggestion-card glass-card recovery-suggestion-link"
      aria-label={`${selectedItem.name} を開く`}
    >
      <p className="recovery-kicker">RECOVERY提案</p>
      <div className="recovery-item-row">
        <div className="recovery-thumb-wrap" aria-hidden>
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt={selectedItem.name}
              className="recovery-thumb"
              onError={() => setImageIndex((prev) => prev + 1)}
            />
          ) : imagePath ? (
            <img src={imagePath} alt={selectedItem.name} className="recovery-thumb" />
          ) : (
            <span className="recovery-thumb-fallback">{selectedItem.iconLabel}</span>
          )}
        </div>
        <div className="recovery-item-copy">
          <p className="recovery-item-name">{selectedItem.name}</p>
          <p className="recovery-item-note">{selectedItem.note}</p>
        </div>
        <span className="recovery-item-button">
          VIEW
        </span>
      </div>
    </a>
  );
}
