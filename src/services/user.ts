/** 解析JWT Payload */
export function parseUserInfo(jwt: string | null) {
  if (jwt) {
    const decode = JSON.parse(atob(jwt.split('.')[1]));
    return decode;
  }
  return null;
}
