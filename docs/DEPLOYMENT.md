# Deployment Guide for BenHub Server

This document describes the automatic steps required to get the
`avgames` project running on the Debian host `benhub` (192.168.1.38) and
make it reachable over WireGuard (`10.8.0.1`).

## Pre‑requirements

* Debian-based OS (e.g. Debian 12 / Ubuntu 24.04)
* root / sudo access
* Git repository checked out to `/home/benemerito/VisualProjects/avgames`
* WireGuard kernel module installed (`wireguard` package)

## WireGuard setup

1. Copy `deploy/wg0-client.conf` to your laptop, edit as needed.
2. On server, open `/etc/wireguard/wg0.conf` and set a private key:
   ```bash
   wg genkey | tee /etc/wireguard/wg0.server.key | wg pubkey
   ```
   paste the generated public key into the `[Interface]` section.
3. Bring up interface manually or enable service:
   ```bash
   systemctl enable wg-quick@wg0
   systemctl start wg-quick@wg0
   ```
4. Verify with `wg show` and `ip a show wg0`.

## Bootstrap the application

Run the provided shell script as root from the project root:

```bash
cd /home/benemerito/VisualProjects/avgames
sudo bash deploy/setup-server.sh
```

This will:

* install PHP, MariaDB, Nginx, Node and other packages
* generate the database and user `avgames`/`secret-pass`
* configure Laravel `.env` (APP_URL and DB_* values)
* install composer/npm dependencies and build assets
* run migrations and seed the default admin
* configure Nginx to serve the application on 10.8.0.1:80

After the script completes, the site will be live on the VPN address.

## Usage

* On your laptop: `sudo wg-quick up wg0` then browse to
  `http://10.8.0.1` or SSH with `ssh benemerito@10.8.0.1`.
* The default admin credentials are `admin@avgames.com` / `password`.
* To change the DB password or other settings edit `.env` and run
  `php artisan config:cache`.

## Security notes

* Keep `database/database.sqlite` can be removed if you switched to
  MariaDB.
* The WireGuard endpoint is bound only to the local network; the router
  does not need any port forwarding.
* Use `certbot` to obtain a TLS certificate for `10.8.0.1` if you want
  HTTPS (use `--standalone` while the VPN is up).

That's everything scripted – just execute the setup script on your
server and the site will be configured end-to-end.