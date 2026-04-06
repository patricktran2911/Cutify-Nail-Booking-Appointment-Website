# Cutify Nails — Project Instructions

## Tech Stack
- Next.js 16.2.2, React 19, TypeScript 5, Tailwind 4
- No database — file-based storage (gallery images on disk, schedule as JSON)
- Google Calendar API (service account), Gmail SMTP, PayPal (disabled)

## Deployment

**Server**: Hetzner Ubuntu 24.04, IP `5.78.76.197`, SSH as `root` via `~/.ssh/id_ed25519`
**Project path on server**: `/opt/cutify-nails`
**Domain**: `https://cutifynail.tramsbeauty.com`

### Deploy steps:
```bash
# 1. Commit and push
git add -A && git commit -m "description" && git push origin main

# 2. SSH in and pull
ssh root@5.78.76.197 "cd /opt/cutify-nails && git pull origin main"

# 3. Rebuild + restart
ssh root@5.78.76.197 "cd /opt/cutify-nails && docker compose up --build -d"

# 4. Verify
ssh root@5.78.76.197 "docker logs cutify-nails --tail 5"
```

### Docker setup:
- `docker-compose.yml` maps port 3000, env from `.env.local`
- Volumes: `./public/assets:/app/public/assets` (gallery), `./data:/app/data` (schedule)
- Container runs as `nextjs` user (uid 1001)
- New host directories need `chown 1001:1001`

### Infrastructure notes:
- 2GB RAM + 4GB swap; Docker build uses `NODE_OPTIONS=--max-old-space-size=1536`
- Nginx reverse proxy with Certbot SSL
- Nginx serves `/assets/` directly from host volume (bypasses Next.js image optimizer)
- `images.unoptimized: true` in next.config.ts — required because standalone builds can't optimize runtime-uploaded files. Instead, images are compressed with Sharp on upload.
- SMTP uses port 587 STARTTLS (Hetzner blocks port 465)
- File-based storage: gallery in `public/assets/Tier_{1,2,3}/`, schedule in `data/availability.json`
