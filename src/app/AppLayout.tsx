import { GameScreen } from '../components/game/GameScreen';

export function AppLayout() {
  return (
    <div className="app-bg">
      <div className="app-frame">
        <GameScreen />
      </div>
    </div>
  );
}
