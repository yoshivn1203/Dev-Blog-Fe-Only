---
layout: blog
title: "Using Nginx to secure a NestJS App with Let's Encrypt"
date: 2025-04-12T07:39:41
author: Nguyen Nguyen
tags:
  - Cloud
  - DevOps
reading_time: 10
category: Technology
thumbnail: /images/uploads/1744443575561-8d3d5afaf51d392.jpg
description: "How To Install Nginx and Secure a NestJS App with Let's Encrypt on Ubuntu 20.04"
---

## Introduction

NestJS is a powerful Node.js framework for building server-side applications, often deployed on platforms like AWS EC2. To serve a NestJS app securely, you can use Nginx as a reverse proxy to handle incoming requests and Let’s Encrypt to provide free SSL/TLS certificates for HTTPS. This ensures encrypted communication between your app and its users.

Unlike static websites, NestJS apps generate dynamic content, so you don’t need to serve files like `index.html`. Instead, Nginx forwards requests to your NestJS app running on a local port (e.g., `3000`). This guide will walk you through installing Nginx, deploying a NestJS app on an EC2 Ubuntu 20.04 instance, and securing it with Let’s Encrypt, with automatic certificate renewals.

## Prerequisites

Before starting, ensure you have:

- An Ubuntu 20.04 EC2 instance set up with a non-root user (sudo privileges) and a firewall (UFW)
- A registered domain (e.g., `example.com`) with an A record in your DNS provider (like Route 53) pointing to your EC2 instance’s public IP. Include `www.example.com` if desired. 
- Node.js and npm installed on your EC2 instance.
- A NestJS app ready to deploy, either cloned from a repository or created locally.

## Step 1 — Installing Nginx

Nginx will act as a reverse proxy, forwarding requests to your NestJS app. Install it on your EC2 instance.

Update the package index:

```bash
sudo apt update
```

Install Nginx:

```bash
sudo apt install -y nginx
```

Nginx starts automatically. Verify it’s running:

```bash
sudo systemctl status nginx
```

You should see:

```
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since ...
```

If it’s not running, start it:

```bash
sudo systemctl start nginx
```

Enable Nginx to start on boot:

```bash
sudo systemctl enable nginx
```

Allow HTTP traffic through UFW:

```bash
sudo ufw allow 'Nginx HTTP'
```

Check the firewall:

```bash
sudo ufw status
```

Expected output includes:

```
To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx HTTP                 ALLOW       Anywhere
```

Visit `http://your_server_ip` to see Nginx’s default page, confirming it’s installed. You don’t need to test `http://example.com` yet, as we’ll configure that next.

## Step 2 — Deploying Your NestJS App

Deploy your NestJS app to run on the EC2 instance. This guide assumes your app listens on port `3000` (NestJS’s default), but you can adjust as needed.

1. **Install Node.js (if not already installed)**:

   ```bash
   sudo apt install -y nodejs npm
   ```

   Verify:

   ```bash
   node -v
   npm -v
   ```

2. **Copy Your NestJS App**:
   - Clone your app’s repository or upload it to the server. For example:

     ```bash
     git clone https://github.com/your-repo/your-nestjs-app.git /home/ubuntu/nestjs-app
     cd /home/ubuntu/nestjs-app
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

3. **Build the App** (if using TypeScript):

     ```bash
     npm run build
     ```

4. **Start the App**:
   - Run it temporarily to test:

     ```bash
     npm run start:prod
     ```

   - You should see output indicating the app is listening on `http://localhost:3000`. Press `Ctrl+C` to stop for now.
   - For production, use a process manager like PM2 to keep the app running:

     ```bash
     sudo npm install -g pm2
     pm2 start dist/main.js --name nestjs-app
     ```

   - Save the PM2 process list to restart on reboot:

     ```bash
     pm2 save
     pm2 startup
     ```

     Follow the outputted command to enable PM2 on boot.

5. **Test Locally**:
   - From the EC2 instance, run:

     ```bash
     curl http://localhost:3000
     ```

   - If your app has a root endpoint (e.g., returning “Hello World”), you’ll see the response. If not, check your app’s routes or logs (`pm2 logs nestjs-app`).

You don’t need to create static files (like `index.html`) because NestJS serves dynamic content, similar to how your OpenProject setup relied on the app’s internal server.

## Step 3 — Configuring Nginx as a Reverse Proxy

Set up Nginx to forward requests for `example.com` to your NestJS app on `localhost:3000`. This is similar to your OpenProject setup, where Nginx proxied to a Docker container.

Create a configuration file:

```bash
sudo nano /etc/nginx/sites-available/nestjs
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

This config:
- Listens on port 80 for `example.com` and `www.example.com`.
- Proxies requests to `http://127.0.0.1:3000`, where NestJS runs.
- Sets headers to preserve client information and support WebSockets (if used).

Save and close (`Ctrl+O`, `ENTER`, `Ctrl+X`).

Enable the config:

```bash
sudo ln -s /etc/nginx/sites-available/nestjs /etc/nginx/sites-enabled/
```

Test the configuration:

```bash
sudo nginx -t
```

Expect:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

Visit `http://example.com`. If your NestJS app is running, you should see its response (e.g., your API’s root endpoint). If it’s not working, check:
- PM2 status: `pm2 status`.
- Nginx logs: `sudo tail /var/log/nginx/error.log`.
- DNS propagation for `example.com`.

## Step 4 — Installing Certbot

Install Certbot to obtain an SSL certificate from Let’s Encrypt.

Add the Certbot PPA for the latest version:

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:certbot/certbot
```

Press `ENTER` to confirm.

Install Certbot with the Nginx plugin:

```bash
sudo apt install -y python3-certbot-nginx
```

Verify:

```bash
certbot --version
```

## Step 5 — Obtaining an SSL Certificate

Use Certbot’s Nginx plugin to get and install the SSL certificate automatically, similar to your OpenProject setup but leveraging `--nginx` for simplicity (unlike your `--standalone` approach).

Run:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Follow the prompts:
- **Email**: Enter a valid email for renewal notices.
- **Terms of Service**: Type `A` to agree.
- **EFF Newsletter**: Choose `Y` or `N`.
- **Redirect**: Select `2` to redirect HTTP to HTTPS.

Certbot will:
- Obtain a certificate for `example.com` and `www.example.com`.
- Modify `/etc/nginx/sites-available/nestjs` to add SSL settings.
- Set up an HTTP-to-HTTPS redirect.

You’ll see:

```
Congratulations! You have successfully enabled HTTPS on https://example.com and https://www.example.com
```

Your updated Nginx config will look like:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

Visit `https://example.com` to confirm the padlock icon appears. Test with [SSL Labs](https://www.ssllabs.com/ssltest/) if desired.

## Step 6 — Updating the Firewall

Allow HTTPS traffic:

```bash
sudo ufw allow 'Nginx HTTPS'
```

Verify:

```bash
sudo ufw status
```

Output includes:

```
To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx HTTP                 ALLOW       Anywhere
Nginx HTTPS                ALLOW       Anywhere
```

Since you chose redirection, you can remove HTTP:

```bash
sudo ufw delete allow 'Nginx HTTP'
```

## Step 7 — Verifying Auto-Renewal

Let’s Encrypt certificates expire every 90 days, but Certbot automates renewals. Test it:

```bash
sudo certbot renew --dry-run
```

Look for:

```
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/example.com/fullchain.pem (success)
```

Check the renewal timer:

```bash
sudo systemctl status certbot.timer
```

If inactive, enable it:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Your certificates will renew automatically.
