import CryptoJS from "crypto-js";

const config = {
  // 请求地址
  hostUrl: "https://itrans.xfyun.cn/v2/its",
  host: "itrans.xfyun.cn",
  //在控制台-我的应用-机器翻译获取
  appid: "2caa8030",
  //在控制台-我的应用-机器翻译获取
  apiSecret: "NzA2MDhjN2U3ZmZmZjFjYTgyNDNhNjNh",
  //在控制台-我的应用-机器翻译获取
  apiKey: "6178dd6820978de4d498ec4ecbfc0fea",
  uri: "/v2/its",
};

let transVar = {
  text: "穿充气服的橙发男孩", //待翻译文本
  from: "cn", //源语种
  to: "en", //目标语种
};
// 获取当前时间 RFC1123格式
let date = new Date().toUTCString();
let postBody = getPostBody(transVar.text, transVar.from, transVar.to);
let digest = getDigest(postBody);

let options = {
  url: config.hostUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json,version=1.0",
    Host: config.host,
    Date: date,
    Digest: digest,
    Authorization: getAuthStr(date, digest),
  },
  json: true,
  body: postBody,
};

// 生成请求body
function getPostBody(text, from, to) {
  let digestObj = {
    //填充common
    common: {
      app_id: config.appid,
    },
    //填充business
    business: {
      from: from,
      to: to,
    },
    //填充data
    data: {
      text: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)),
    },
  };
  return digestObj;
}

// 请求获取请求体签名
function getDigest(body) {
  return (
    "SHA-256=" +
    CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(JSON.stringify(body)))
  );
}

// 鉴权签名
function getAuthStr(date, digest) {
  let signatureOrigin = `host: ${config.host}\ndate: ${date}\nPOST ${config.uri} HTTP/1.1\ndigest: ${digest}`;
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret);
  let signature = CryptoJS.enc.Base64.stringify(signatureSha);
  let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line digest", signature="${signature}"`;
  return authorizationOrigin;
}
