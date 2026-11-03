# QR 환전 서비스 프로토타입

외국인 관광객을 위한 모바일 웹 기반 환전·ATM 안내 UI 프로토타입입니다. PC에서도 중앙의 모바일 화면 폭을 유지합니다.

## 웹페이지 바로 열기

**[QR 환전 서비스 열기](https://kimdongyoung27.github.io/Exchange-Service/)**

설치 없이 브라우저에서 이용할 수 있습니다. 저장소를 다운로드한 경우 루트의 `index.html`을 열어도 됩니다.

## 실행

Node.js 18 이상이 필요합니다. 별도 패키지 설치 없이 실행할 수 있습니다.

```sh
npm run dev
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## 주요 화면

- `#/exchange`: 서비스 진입과 환전 시작
- `#/apply`: 1단계 신청, 통화 선택·스왑, 예시 환율 계산, 하단 실시간 환율 펼치기
- `#/loading`: 지폐 아래쪽을 축으로 빠르게 넘기는 로딩 애니메이션
- `#/code`: 2단계 시연용 인출 코드
- `#/map`: 3단계 지도 중심 ATM 탐색·길안내 시연
- `#/done`: 4단계 완료 및 화면 내 신청 정보 초기화

한국어·영어·일본어·중국어 간체·중국어 번체를 지원하며, 하단에 환전·지도·더보기 메뉴가 고정됩니다.

## 파일 구조

```text
dist/
  index.html       # 앱 셸, 아이콘, 언어 메뉴, 하단 내비게이션
  app.js           # 화면 이동, 다국어, 환전 양식, 예시 계산, 지도 상호작용
  paper-loader.js  # 유연한 지폐 넘김 Canvas 애니메이션
  styles.css       # 모바일 레이아웃 및 브랜드 스타일
  exchange.html    # 기존 신청 URL의 이동 안내
server.mjs        # 로컬 정적 서버
```

정적 호스팅에는 `dist/` 디렉터리를 배포하면 됩니다.

GitHub Pages는 `gh-pages` 브랜치의 루트에서 제공됩니다. `dist/`를 수정하고 `main`에 커밋한 뒤 다음 명령으로 사이트를 갱신합니다.

```sh
git push origin main
git subtree push --prefix dist origin gh-pages
```

## 구현 범위

실제 은행, 결제, 본인확인, 환율 API, 지도 API, 소셜 로그인은 연결하지 않았습니다. 환율 계산은 고정된 예시값 또는 사용자가 입력한 예시값을 사용하며, 실시간 환율 영역의 숫자는 API 연결 전까지 비워 둡니다. 지도·거리·운영시간과 인출 코드는 시연용이며 실제 거래나 ATM 출금에 사용할 수 없습니다.

이름과 신청 내용은 화면 내 메모리에서만 다루며 서버에 전송하지 않습니다. 언어 선택만 브라우저의 로컬 저장소에 보관합니다. 웹 글꼴은 Google Fonts를 사용하고, 연결할 수 없으면 시스템 글꼴로 표시합니다.

## 문법 확인

```sh
node --check dist/app.js
node --check dist/paper-loader.js
node --check server.mjs
```
