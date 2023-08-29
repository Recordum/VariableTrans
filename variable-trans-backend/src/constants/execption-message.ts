export enum AuthErrorMessage {
  NEED_LOGIN = '로그인이 필요한 서비스 입니다',
  EXPIRES_SESSION = '만료된 세션입니다',
  REQUEST_LIMIT_EXCEEDED = '요청 횟수 추가',
  SESSION_NOT_FOUND = '존재하지 않는 세션입니다',
}

export enum UserErrorMessage {
  ALEADY_EXIST_EMAIL = '이미 존재하는 이메일입니다',
  WRONG_PASSWORD_OR_EMAIL = '잘못된 Email 혹은 비밀번호 입니다.',
}
