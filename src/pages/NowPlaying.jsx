import { about } from "../data/about";
import { useLanyard } from "../lib/useLanyard";

function formatTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function NowPlaying() {
  const { data } = useLanyard(about.discordId);
  const spotify = data?.spotify || null;

  if (!about.discordId) {
    return (
      <p className="text-xs text-muted p-3">
        renseigne <code>discordId</code> dans <code>src/data/about.js</code> pour activer ce
        widget (nécessite le statut Spotify actif dans Discord).
      </p>
    );
  }

  if (!spotify) {
    return (
      <div className="mp-outer">
        <div id="mp-idle">
          <img
            src="https://win98icons.alexmeub.com/icons/png/cd_music-3.png"
            alt=""
          />
          <span>not playing anything</span>
        </div>
      </div>
    );
  }

  const now = Date.now();
  const elapsed = now - spotify.timestamps.start;
  const total = spotify.timestamps.end - spotify.timestamps.start;
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

  return (
    <div className="mp-outer">
      <div className="mp-content">
        <div className="mp-center">
          <img src={spotify.album_art_url} alt="" className="mp-art" />
        </div>
        <div className="mp-bottom">
          <div className="mp-meta">
            <div className="mp-song">{spotify.song}</div>
            <div className="mp-artist">{spotify.artist}</div>
            <div className="mp-album">{spotify.album}</div>
          </div>
          <div className="mp-seek-track">
            <div className="mp-seek-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="mp-time-row">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
