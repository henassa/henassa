import { about } from "../data/about";
import { useLanyard } from "../lib/useLanyard";

const STATUS_LABELS = {
  online: "en ligne",
  idle: "absent",
  dnd: "ne pas déranger",
  offline: "hors ligne",
};

export default function AboutMe() {
  const { data } = useLanyard(about.discordId);

  const status = data?.discord_status || "offline";
  const avatarUrl =
    data?.discord_user?.id && data?.discord_user?.avatar
      ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=64`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <div className="has-space p-2">
      <div className="flex items-start gap-3">
        {about.discordId && (
          <div className="avatar-wrap">
            <img src={avatarUrl} width={52} height={52} alt="" />
            <span className={`avatar-badge s-${status}`} />
          </div>
        )}

        <div>
          {about.name && (
            <div style={{ fontWeight: 700 }}>
              hello im <span style={{ color: "navy" }}>{about.name}</span>
            </div>
          )}
          {about.pronouns && <div style={{ color: "#555" }}>{about.pronouns}</div>}
          {about.discordId && (
            <div className="mt-1">
              <span className={`sdot s-${status}`} />
              <span className="ml-1 align-middle">{STATUS_LABELS[status]}</span>
            </div>
          )}
        </div>
      </div>

      {about.bio && <p className="mt-3 text-sm">{about.bio}</p>}

      {about.socials.length > 0 && (
        <div className="social-btn-grid mt-3">
          {about.socials.map((s) => (
            <button key={s.label} type="button" onClick={() => window.open(s.url, "_blank")}>
              {s.icon && <img src={s.icon} alt="" />}
              {s.label}
            </button>
          ))}
        </div>
      )}

      {!about.name && !about.bio && about.socials.length === 0 && (
        <p className="text-xs text-muted">
          remplis <code>src/data/about.js</code> pour faire apparaître le contenu ici.
        </p>
      )}
    </div>
  );
}
