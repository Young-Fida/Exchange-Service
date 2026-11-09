# QR 환전 서비스 프로토타입

공식 배포 주소: [환전 서비스 열기](https://exchange-service-ten.vercel.app/)

관리 프로젝트: Vercel `YoungK / exchange-service`. `Young-Fida/Exchange-Service`의 `main` 브랜치에 푸시하면 이 프로젝트로 자동 배포됩니다. 앞으로 공유 링크와 QR의 목적지는 `https://exchange-service-ten.vercel.app/`를 사용합니다. 이전 팀원의 배포 주소는 관리하지 않습니다.

외국인 관광객을 위한 모바일 웹 기반 환전·ATM 안내 UI입니다. PC에서도 중앙의 모바일 화면 폭을 유지합니다.

저장소: https://github.com/young-fida/Exchange-Service

## 실행

Node.js로 실행하며 별도 패키지 설치는 필요하지 않습니다.

```sh
npm run dev
```

기본 주소는 `http://127.0.0.1:4173`입니다. `PORT` 환경변수로 포트를 바꿀 수 있습니다. 다운로드한 저장소의 루트 `index.html`을 열면 `dist/index.html`로 이동합니다.

## 주요 화면

- `#/home`: 지구본과 환전 시작 화면. 기존 `#/exchange` 주소도 홈으로 표시됩니다.
- `#/apply`: 1단계 신청. 국가명·통화 코드 선택, 금액 입력, 통화 스왑, 고정 신청·환율 버튼.
- `#/loading`: 원화 색상의 인물 콜라주가 인쇄된 종이를 넘기는 플립북.
- `#/code`: 인출 코드 발급 시연.
- `#/map`: 지도 중심 ATM 탐색·길안내 시연.
- `#/done`: 완료 및 신청 정보 초기화.
- `loader-preview.html`: 로딩 재생, 시점 이동, 여섯 동작 비교.

한국어·영어·일본어·중국어 간체·중국어 번체를 지원합니다. 하단에는 홈·환전·지도 메뉴, 헤더에는 언어 선택과 더보기가 있습니다. 환전 진행 중 다른 화면으로 나가면 기록 삭제 경고를 표시하며, 취소하면 입력을 보존합니다.

## 배포

웹 배포 디렉터리는 `dist/`입니다. 현재 구조의 Vercel 설정은 다음과 같습니다.

| 항목 | 값 |
|---|---|
| Framework Preset | Other |
| Root Directory | 저장소 루트 |
| Build Command | Override 활성화 후 비워 두기 |
| Output Directory | dist |
| Install Command | 기본값 |
| Production Branch | main |
| Environment Variables | 현재 필수값 없음 |

`server.mjs`는 로컬 정적 서버입니다. 배포 빌드 명령에 `npm run dev` 또는 `node server.mjs`를 넣지 않습니다. Vercel 연결 후 공개 주소에서 주요 화면과 이미지 로딩을 확인합니다.

## 현재 파일

```text
dist/
  index.html               # 앱 셸, 아이콘, 언어/더보기, 하단 메뉴
  app.js                   # 다국어, 환전 양식, 이탈 보호, 지도 시연
  styles.css               # 모바일 레이아웃, 고정 액션과 대화상자
  playful-earth.js         # 홈 지구본과 지도 펼침 모션
  flipbook-loader-v20.js   # 현재 사용하는 플립북 렌더러
  loader-preview.html      # 로딩 검토 화면
  assets/
    currency-atlas/        # 홈에서 사용하는 지폐 이미지와 출처
    krw-collage-v11/       # 실제 만원 배경과 출처
    sejong-flipbook-v20/   # 현재 여섯 동작의 콜라주 이미지
```

콜라주 인물은 지폐 자료를 참고해 새로 생성한 그래픽입니다. 실제 지폐 스캔은 배경과 홈의 화폐 요소에 사용합니다. 최신 프레임의 생성 지시는 `dist/assets/sejong-flipbook-v20/generation-prompt.txt`에 있습니다.

## 구현 범위

실시간 환율 버튼은 서버의 `/api/rates`를 통해 한국수출입은행의 매매기준율을 조회합니다. 기준일과 조회 시각을 표시하며, 오늘 데이터가 없으면 최근 7일 이내의 가장 최신 데이터를 찾습니다. 서버는 조회 결과를 10분간 재사용합니다. JPY·IDR 등은 API가 제공한 100단위 기준을 그대로 표시합니다. CNH는 역외 위안으로 구분하고, 제공되지 않는 TWD는 미제공으로 표시합니다.

환전 신청의 예상금액 계산은 여전히 고정된 예시값 또는 직접 입력한 예시값을 사용합니다. 실제 은행·결제·본인확인·지도 API·소셜 로그인은 연결하지 않았습니다. 지도·거리·운영시간·인출 코드는 시연용입니다.

환전 신청 정보는 화면 내 메모리에만 보관합니다. 언어 선택만 브라우저 로컬 저장소에 보관합니다. 환율 서버는 신청자 정보나 신청 금액을 전송하지 않습니다.

## 환율 키 설정

로컬에서는 `powershell -NoProfile -ExecutionPolicy Bypass -File .\register-exim-key.ps1`로 키를 입력합니다. 키는 Git에서 제외된 루트 `.env.local`에 저장되며 서버 재시작 후 적용됩니다. `dist/`에는 키를 넣지 않습니다.

Vercel에서는 프로젝트 Environment Variables에 `EXIM_API_KEY`를 Production/Preview 용도로 등록하고 다시 배포합니다. 루트 `api/rates.js`가 서버 함수로 동작합니다. 로컬 `.env.local`은 Vercel로 올리지 않습니다. GitHub Pages는 서버 함수를 실행하지 못하므로 이 환율 조회에는 Vercel 또는 로컬 서버가 필요합니다.

환율 처리 검증: `node --test tests/rates.test.cjs`

## 문법 확인

```sh
node --check dist/app.js
node --check dist/playful-earth.js
node --check dist/flipbook-loader-v20.js
node --check server.mjs
```
