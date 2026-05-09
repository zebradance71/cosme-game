import { useMemo } from 'react';
import { showResultAffiliateCards } from '../../config/featureFlags';
import { pickUniqueRecoveryItems } from './recoveryItems';
import { RecoverySuggestionCard } from './RecoverySuggestionCard';

interface ResultAffiliateStripProps {
  /** 同じ結果画面内で候補が変わらないようにするキー */
  pickSeed: string | number;
}

export function ResultAffiliateStrip({ pickSeed }: ResultAffiliateStripProps) {
  const items = useMemo(() => pickUniqueRecoveryItems(2), [pickSeed]);

  if (!showResultAffiliateCards) {
    return null;
  }

  return (
    <div className="result-affiliate-strip" aria-label="おすすめ商品（PR）">
      {items.map((item, index) => (
        <RecoverySuggestionCard
          key={`${pickSeed}-${index}-${item.url}`}
          imagePath={null}
          item={item}
          compact
        />
      ))}
    </div>
  );
}
