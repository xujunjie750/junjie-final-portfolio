import "./App.css";
import { JourneySection } from "./components/JourneySection";
import { ShowcaseSection } from "./components/ShowcaseSection";
import { ChatWidget } from "./components/ChatWidget";

const AboutSection = () => (
  <section className="section" id="about">
    <div className="sectionHeader">
      <h2 className="sectionTitle">关于 MVP 构思与心得</h2>
    </div>
    <div className="glassCard aboutContent">
      <div className="aboutBlock">
        <h3 className="aboutSub">SuperCapture：解决真实痛点</h3>
        <p>我的 MVP 构思源于对日常办公中“信息碎片化”的观察。我发现频繁切换窗口进行截图、OCR、翻译和整理是极度低效的重复劳动。SuperCapture 不仅仅是一个截图工具，它集成了 OCR 提取、画笔标注、马赛克脱敏等功能，目标是实现“所见即所得，所得即所用”的一站式体验。</p>
      </div>
      <div className="aboutBlock">
        <h3 className="aboutSub">学习心得</h3>
        <p>在 Vibe Coding 的训练营中，我最大的收获是思维方式的转变。AI 并不是简单的代码生成器，它是思维的倍增器。通过合理地拆解需求、精准地编写提示词，我能够以前所未有的速度完成从想法到产品的闭环。这种“快步迭代、重视体感、闭环交付”的节奏，已经成为了我新的创作本能。</p>
      </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="heroInner">
          <div className="heroBadge">新中式数字美学 · Vibe Coding 毕业站</div>
          <h1 className="heroTitle">灵感之境：郡婕的 AI 创想实验室</h1>
          <p className="heroDesc">
            一份从痛点出发、用 AI 提速、以交付收尾的七周成长记录。
          </p>
          <div className="heroActions">
            <button
              className="ghostButton"
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            >
              看成长历程
            </button>
            <button
              className="ghostButton"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              MVP 构思
            </button>
            <button
              className="primaryLink"
              onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
            >
              看作品展示
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <JourneySection />
        <AboutSection />
        <ShowcaseSection />
      </main>

      <footer className="footer">
        <div className="footerText">© {new Date().getFullYear()} Junjie · 灵感之境</div>
      </footer>

      <ChatWidget />
    </div>
  );
}

export default App;
