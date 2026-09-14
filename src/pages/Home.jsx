import { intro } from "../data/intro";
import { cs2Servers } from "../data/servers";
import { players } from "../data/players";
import { matches } from "../data/matches";
import { discordInviteUrl } from "../data/config";
import { useDiscordMemberCount } from "../lib/useDiscordMemberCount";
import { useServerStatus } from "../lib/useServerStatus";

function ServerRow({ server }) {
  const status = useServerStatus(server.battlemetricsId);

  return (
    <div className="home-server-row">
      <span className={"home-dot " + (status?.online ? "online" : status ? "offline" : "unknown")} />
      <span className="home-server-name">{server.name}</span>
      <span className="home-server-status">
        {!server.battlemetricsId
          ? "non configuré"
          : status == null
          ? "…"
          : status.online
          ? `en ligne · ${status.players}/${status.maxPlayers}`
          : "hors ligne"}
      </span>
    </div>
  );
}

export default function Home() {
  const participants = new Set(players.map((p) => p.pseudo)).size;
  const matchesPlayed = matches.length;
  const discordMembers = useDiscordMemberCount(discordInviteUrl);

  return (
    <div className="home-card">
      <div className="home-header">
        {intro.logo ? (
          <img src={intro.logo} alt="" className="home-avatar" />
        ) : (
          <div className="home-avatar home-avatar-placeholder" />
        )}
        <p className="home-title">{intro.title || "TRAPHOUSE"}</p>
        {intro.tagline && <p className="home-tagline">{intro.tagline}</p>}
      </div>

      {intro.paragraphs.length > 0 ? (
        <div className="home-bio">
          {intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="home-bio text-xs text-muted">
          remplis <code>src/data/intro.js</code> pour la présentation du projet.
        </p>
      )}

      <fieldset>
        <legend>Serveurs CS2</legend>
        {cs2Servers.map((s, i) => (
          <ServerRow key={i} server={s} />
        ))}
      </fieldset>

      <fieldset>
        <legend>Stats</legend>
        <div className="home-stats">
          <div>
            <strong>{participants}</strong>
            <span>participants</span>
          </div>
          <div>
            <strong>{matchesPlayed}</strong>
            <span>matchs joués</span>
          </div>
          <div>
            <strong>{discordMembers ?? "…"}</strong>
            <span>membres Discord</span>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
