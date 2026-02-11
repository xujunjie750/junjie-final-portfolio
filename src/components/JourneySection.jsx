import { useMemo, useState } from "react";
import { journeyLessons } from "../data";
import { Modal } from "./Modal";

export function JourneySection() {
  const lessons = useMemo(() => journeyLessons, []);
  const [activeId, setActiveId] = useState(null);

  const active = lessons.find((l) => l.id === activeId) ?? null;

  return (
    <section className="section" id="journey">
      <div className="sectionHeader">
        <div className="sectionKicker">成长历程</div>
        <h2 className="sectionTitle">七周进化：从痛点到交付</h2>
        <p className="sectionDesc">点击卡片查看当周复盘。</p>
      </div>

      <div className="grid">
        {lessons.map((l) => (
          <button key={l.id} className="glassCard" onClick={() => setActiveId(l.id)} type="button">
            <div className="cardTop">
              <div className="badge">W{l.id}</div>
              <div className="cardTitle">{l.title}</div>
            </div>
            <div className="cardSub">{l.subtitle}</div>
          </button>
        ))}
      </div>

      {active ? (
        <Modal title={active.title} onClose={() => setActiveId(null)}>
          <div className="recap">
            {active.recap.map((p, idx) => (
              <p key={idx} className="recapP">
                {p}
              </p>
            ))}
          </div>
        </Modal>
      ) : null}
    </section>
  );
}

