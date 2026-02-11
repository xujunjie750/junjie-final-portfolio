import { showcase } from "../data";
import { CiYiShengHua } from "./CiYiShengHua";

export function ShowcaseSection() {
  return (
    <section className="section" id="showcase">
      <div className="sectionHeader">
        <div className="sectionKicker">作品展示</div>
        <h2 className="sectionTitle">从灵感到作品：一次完整交付</h2>
        <p className="sectionDesc">视频、复刻实验与复盘心得。</p>
      </div>

      <div className="twoCol">
        <div className="glassPanel">
          <div className="panelHeader">
            <div className="panelTitle">{showcase.video.title}</div>
            <div className="panelHint">视频来自 /public/20260129_211939.mp4</div>
          </div>
          <video className="video" controls preload="metadata" src={showcase.video.src} />
        </div>

        <CiYiShengHua />
      </div>

      <div className="glassPanel">
        <div className="panelHeader">
          <div className="panelTitle">Vibe Coding 复盘</div>
          <div className="panelHint">把节奏、体感与交付做成可复用的方法。</div>
        </div>
        <div className="bullets">
          {showcase.vibeReview.map((t, i) => (
            <div className="bullet" key={i}>
              <span className="dot" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

