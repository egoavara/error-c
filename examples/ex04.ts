import errorc from "../src/lib";

const DEFINE_ERRORS = {
  [-1]: "not found data",
  [-2]: "pw not match",
  [-3]: "already signed up",
  [-4]: "signed up fail",
  [-5]: "fail get KakaoToken",
  [-6]: "fail get KakaoId",
  [-7]: "fail save Kakao User",
  [-8]: "fail select data",
  [-9]: "fail insert data",
  [-10]: "fail update data",
  [-11]: "fail delete data",
  [-12]: "No auth token",
  [-13]: "fail get Kakao AccessToken From RefreshToken",
  [-14]: "Kakao Logout Error",
  [-15]: "already product detail",
} as const;

const fail = errorc(
  DEFINE_ERRORS,
  process.env.NODE_ENV === "production" ? "release" : "debug",
  (msg) => msg
);
console.log(fail(-1, {}));
