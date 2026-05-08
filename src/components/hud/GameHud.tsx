interface GameHudProps {
  score: number;
  runCount: number;
  successStreak: number;
}

export function GameHud({ score, runCount, successStreak }: GameHudProps) {
  return (
    <header className="game-hud">
      <div className="glass-pill">
        <span>RUN</span>
        <strong>{runCount}</strong>
      </div>
      <div className="glass-pill">
        <span>SCORE</span>
        <strong>{score}</strong>
      </div>
      <div className="glass-pill combo-pill">
        <span>COMBO</span>
        <strong>{successStreak}</strong>
      </div>
    </header>
  );
}
