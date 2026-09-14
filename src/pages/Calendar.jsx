import { events } from "../data/calendar";

export default function Calendar() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th>Date</th>
          <th>Heure</th>
          <th>Évènement</th>
          <th>Jeu</th>
          <th>Ladder</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e, i) => (
          <tr key={i}>
            <td>{e.date}</td>
            <td>{e.time}</td>
            <td>{e.title}</td>
            <td>{e.game}</td>
            <td>{e.ladder}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
