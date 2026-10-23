# Next.X 배포 준비 및 현재 확인 결과

## 확인된 상태

- 봇 코드는 이 폴더의 Node.js 프로젝트입니다.
- `.env.example`과 Google 서비스 계정 키 파일은 이 작업 폴더에 있습니다. 비밀값은 출력하거나 문서에 복사하지 않습니다.
- `deploy/discord-report-bot.service`는 공용 예시 서비스 파일입니다. Next.X 전용 경로를 사용하는 `deploy/nextx-discord-bot.service`를 추가했습니다.
- 디스코드 서버 설정은 `/settings`에서 확인되며, 실제 실행 서버의 `data/guilds/1560248154207555605.json`은 이 작업 폴더에 없습니다.
- 현재 확인 가능한 Railway 계정에는 게임 개발 프로젝트만 있고 Next.X 봇 서비스는 없습니다. Google Cloud 콘솔은 프로젝트가 선택되지 않았고, 현재 보이는 계정의 프로젝트 목록도 비어 있습니다.
- 따라서 실제 운영 서버의 주소, 실행 프로세스, 배포 로그는 아직 확인되지 않았습니다. 이 파일을 추가했다고 서버에 배포된 것은 아닙니다.

## Next.X 서버 준비 순서

1. Next.X 전용 GitHub 저장소를 정하고 이 프로젝트 복사본을 그 저장소에 연결합니다. 현재 로컬 `upstream`은 게임 개발 원본 저장소이므로 이 상태로 Next.X 운영 코드를 올리지 않습니다.
2. 회사에서 승인한 호스팅 계정에 Ubuntu 서버를 준비합니다. Railway나 Google Cloud에 새 서버를 만들 때는 회사 계정과 결제 설정을 먼저 확인합니다.
3. 서버의 `/opt/nextx-discord-bot`에 코드와 의존성을 설치합니다.
4. `.env`와 `secrets/service-account.json`은 서버에만 안전하게 올립니다. 두 파일을 GitHub에 커밋하거나 채팅에 붙이지 않습니다.
5. 이 폴더의 `nextx-discord-bot.service`를 `/etc/systemd/system/`에 설치하고 서비스를 시작합니다.
6. Discord에서 `/settings`를 확인한 뒤, 누락된 서버별 시트와 채널 설정을 넣고 `/reload`를 실행합니다.
7. 로그에서 명단을 읽었다는 메시지를 확인하고, 운영진이 테스트 계정으로 보고를 제출해 Discord 메시지와 시트 기록을 검증합니다.

## Ubuntu 설치/재시작 명령

서비스 파일을 서버에 복사한 다음 아래 명령을 실행합니다.

```bash
sudo cp /opt/nextx-discord-bot/deploy/nextx-discord-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nextx-discord-bot
sudo systemctl status nextx-discord-bot --no-pager
```

최근 실행 기록은 다음처럼 확인합니다.

```bash
sudo journalctl -u nextx-discord-bot -n 100 --no-pager
```

코드를 갱신한 뒤에는 다음 명령으로 재시작합니다.

```bash
sudo systemctl restart nextx-discord-bot
```

## 현재 오류와 배포본 비교

디스코드 `/settings`에 리뷰어 작업 시트가 `없음`으로 나오는데도 `/reload` 결과에 리뷰어 작업 현황 읽기 실패가 포함됩니다. 현재 로컬 코드는 리뷰어 시트가 비어 있으면 해당 시트를 읽지 않도록 되어 있으므로, 실제 실행본과 로컬 복사본의 코드/설정이 다를 가능성이 높습니다. 실제 서버 로그와 실행 경로를 확보한 뒤 이 차이를 확인해야 합니다.
