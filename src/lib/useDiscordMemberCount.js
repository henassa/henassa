import { useEffect, useState } from "react";

// Nombre de membres Discord en direct, sans bot ni clé API — Discord
// expose le compte approximatif d'un serveur via son code d'invitation
// publiquement : https://discord.com/api/invites/{code}?with_counts=true
export function useDiscordMemberCount(inviteUrl) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const code = (inviteUrl || "").split("/").filter(Boolean).pop();
    if (!code || code === "TON_CODE") return;

    let cancelled = false;
    fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && typeof data.approximate_member_count === "number") {
          setCount(data.approximate_member_count);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [inviteUrl]);

  return count;
}
