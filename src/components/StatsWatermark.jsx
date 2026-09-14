import { players } from "../data/players";
import { matches } from "../data/matches";
import { discordInviteUrl } from "../data/config";
import { useDiscordMemberCount } from "../lib/useDiscordMemberCount";

export default function StatsWatermark() {
  // Participants = pseudos uniques tous jeux/ladders confondus.
  const participants = new Set(players.map((p) => p.pseudo)).size;
  const matchesPlayed = matches.length;
  const discordMembers = useDiscordMemberCount(discordInviteUrl);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        right: 14,
        textAlign: "right",
        color: "rgba(255,255,255,0.75)",
        fontSize: 11,
        lineHeight: 1.5,
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div>{participants} participants</div>
      <div>{matchesPlayed} matchs joués</div>
      {discordMembers != null && <div>{discordMembers} membres Discord</div>}
    </div>
  );
}
