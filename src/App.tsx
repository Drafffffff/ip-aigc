import type { Component } from "solid-js";

import popData from "./assets/cuteBlindBox.json";
import { createSignal, Show } from "solid-js";

// import "normalize.css";
import "./style.css";

const App: Component = () => {
  const [imgList, setImgList] = createSignal<string[]>([]);
  const [isShowResult, setIsShowResult] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [customPrompt, setCustomPrompt] = createSignal("");
  async function getImg() {
    setIsLoading(true);
    const transReq = await fetch(import.meta.env.VITE_TRANS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: customPrompt() }),
    }).then((res) => res.json());

    const reqData = JSON.parse(JSON.stringify(popData));
    const prompt = transReq["tran"] + reqData["prompt"];
    console.log(prompt);
    reqData["prompt"] = prompt;
    const res = await fetch(import.meta.env.VITE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });
    const json = await res.json();
    setImgList(json.images.splice(0, json.images.length));
    setIsShowResult(true);
    setIsLoading(false);
  }
  return (
    <div class={"App"}>
      <div class="topbar">
        <p class="AppTitle">一键生成IP</p>
        <hr />
      </div>
      <Show when={!isShowResult()} fallback={<ImageShow imgList={imgList()} />}>
        <div class="middle">
          <p>选择你喜欢的风格，一键配置。</p>
          <div class="styleSelect">
            <div class="slut">
              <img src="./01.jpg" />
            </div>
            <div class="slut">
              <img src="./02.jpg" />
            </div>
            <div class="slut">
              <img src="./03.jpg" />
            </div>
            <div class="slut">
              <img src="./04.jpg" />
            </div>
            <div class="slut">
              <img src="./05.jpg" />
            </div>
            <div class="slut">
              <img src="./06.jpg" />
            </div>
          </div>
        </div>
      </Show>

      <div class="inputField">
        <div class="container">
          <div class="randomPrompt">
            <div class="content">穿充气服的橙发男孩</div>
            <div class="buttom">
              <img src="/refresh.svg" alt="" />
            </div>
          </div>
          <div class="input">
            <input
              type="text"
              value={customPrompt()}
              onInput={(e) => setCustomPrompt(e.currentTarget.value)}
              placeholder="输入关键词..."
            />
          </div>
          <div class="getImgBtn" onClick={getImg}>
            开始召唤
          </div>
        </div>
      </div>
      <Show when={isLoading()}>
        <div class="loading">
          <span class="loader"></span>
          <p>正在召唤中...</p>
        </div>
      </Show>
    </div>
  );
};

export default App;
interface imgshowProps {
  imgList: string[];
}
function ImageShow(props: imgshowProps) {
  return (
    <div class="imgShow">
      {props.imgList.map((img) => (
        <div class="img">
          <img src={`data:image/png;base64,${img}`} />
        </div>
      ))}
    </div>
  );
}
