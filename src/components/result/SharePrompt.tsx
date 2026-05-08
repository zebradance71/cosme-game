interface SharePromptProps {
  text: string;
  className?: string;
  variant?: 'card' | 'bare';
}

export function SharePrompt({ text, className = '', variant = 'card' }: SharePromptProps) {
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable environments are ignored gracefully.
    }
  };

  const nativeShare = async () => {
    if (!canNativeShare) {
      return;
    }
    try {
      await navigator.share({
        title: '美容液演出ゲーム',
        text,
      });
    } catch {
      // User cancelled or platform error; ignore silently.
    }
  };

  if (variant === 'bare') {
    return (
      <div className={`share-actions share-actions-bare ${className}`.trim()}>
        <button type="button" className="secondary-button share-pill" onClick={copyShareText}>
          COPY
        </button>
        {canNativeShare ? (
          <button type="button" className="secondary-button share-pill" onClick={nativeShare}>
            SHARE
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`share-prompt glass-card ${className}`.trim()}>
      <p className="micro-label">Share</p>
      <p>スクショして投稿しよう。コピー文も使えます。</p>
      <div className="share-actions">
        <button type="button" className="secondary-button" onClick={copyShareText}>
          投稿テキストをコピー
        </button>
        {canNativeShare ? (
          <button type="button" className="secondary-button" onClick={nativeShare}>
            共有メニューを開く
          </button>
        ) : null}
      </div>
    </div>
  );
}
