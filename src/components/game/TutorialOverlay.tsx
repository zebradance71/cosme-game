interface TutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function TutorialOverlay({ visible, onClose }: TutorialOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="tutorial-overlay" role="dialog" aria-modal="true" aria-label="遊び方ガイド">
      <div className="tutorial-card glass-card">
        <p className="micro-label">はじめての方向け</p>
        <h3>遊び方 3ステップ</h3>
        <ol>
          <li>今日の肌質カードを確認</li>
          <li>美容液を1つ選んで塗る</li>
          <li>派手な結果をスクショしてシェア</li>
        </ol>
        <button type="button" className="primary-button" onClick={onClose}>
          はじめる
        </button>
      </div>
    </section>
  );
}
