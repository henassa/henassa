import { useState } from "react";
import { playlists } from "../data/playlists";

export default function Playlist() {
  // screen: "playlists" (liste des playlists) ou "tracks" (pistes de la playlist choisie)
  const [screen, setScreen] = useState("playlists");
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  const items = screen === "playlists" ? playlists : playlists[playlistIndex]?.tracks || [];
  const selected = screen === "playlists" ? playlistIndex : trackIndex;
  const setSelected = screen === "playlists" ? setPlaylistIndex : setTrackIndex;

  function move(delta) {
    if (items.length === 0) return;
    setSelected((i) => (i + delta + items.length) % items.length);
  }

  function pressMenu() {
    if (screen === "tracks") {
      setScreen("playlists");
      setTrackIndex(0);
    }
  }

  function pressCenter() {
    if (screen === "playlists") {
      if (playlists.length === 0) return;
      setScreen("tracks");
      setTrackIndex(0);
    } else {
      const track = playlists[playlistIndex]?.tracks[trackIndex];
      if (track) window.open(track.youtubeUrl, "_blank");
    }
  }

  const title = screen === "playlists" ? "Playlists" : playlists[playlistIndex]?.label || "";

  return (
    <div className="ipod-widget">
      <div className="widget-drag" />
      <div className="ipod">
        <div className="ipod-screen">
          <div className="ipod-statusbar">
            <span>{title}</span>
            <span className="ipod-battery" />
          </div>
          <div className="ipod-list">
            {items.length === 0 && <p className="ipod-empty">vide</p>}

            {screen === "playlists" &&
              playlists.map((pl, i) => (
                <button
                  key={pl.id}
                  type="button"
                  className={"ipod-row" + (i === selected ? " selected" : "")}
                  onMouseEnter={() => setPlaylistIndex(i)}
                  onClick={() => {
                    setPlaylistIndex(i);
                    setScreen("tracks");
                    setTrackIndex(0);
                  }}
                >
                  <span className="ipod-row-text">{pl.label}</span>
                  <span className="ipod-chevron">›</span>
                </button>
              ))}

            {screen === "tracks" &&
              (playlists[playlistIndex]?.tracks || []).map((track, i) => (
                <button
                  key={i}
                  type="button"
                  className={"ipod-row" + (i === selected ? " selected" : "")}
                  onMouseEnter={() => setTrackIndex(i)}
                  onClick={() => {
                    setTrackIndex(i);
                    window.open(track.youtubeUrl, "_blank");
                  }}
                >
                  <span className="ipod-row-text">
                    {track.artist} – {track.title}
                  </span>
                </button>
              ))}
          </div>
        </div>

        <div className="ipod-wheel">
          <button type="button" className="ipod-label ipod-label-menu" onClick={pressMenu}>
            MENU
          </button>
          <button type="button" className="ipod-label ipod-label-prev" onClick={() => move(-1)}>
            ⏮
          </button>
          <button type="button" className="ipod-label ipod-label-next" onClick={() => move(1)}>
            ⏭
          </button>
          <span className="ipod-label ipod-label-play">⏯</span>
          <button type="button" className="ipod-center" onClick={pressCenter} aria-label="select" />
        </div>
      </div>
    </div>
  );
}
