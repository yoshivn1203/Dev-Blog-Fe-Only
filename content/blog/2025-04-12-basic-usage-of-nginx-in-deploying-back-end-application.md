---
layout: blog
title: "Basic Usage of Nginx in deploying back end application"
date: 2025-04-12T07:16:01
author: Nguyen Nguyen
tags:
  - Cloud
  - DevOps
reading_time: 10
category: Technology
thumbnail: /images/uploads/1744442158936-nginx-la-gi-2.webp
description: "Using Nginx to Deploy NestJS Applications on an EC2 Instance"
---

A **proxy** is a server that acts as an intermediary between clients and another server, forwarding requests and responses. In the context of web applications, a proxy like Nginx can enhance security, performance, and scalability by managing traffic, shielding backend servers, and adding features like caching or load balancing. For **NestJS**, a Node.js framework for building server-side applications (typically APIs), Nginx serves as a powerful web server and reverse proxy. This article outlines the primary use cases of Nginx for deploying NestJS on an EC2 instance: reverse proxying, static file serving, load balancing, and SSL handling.

## 1. Reverse Proxying for NestJS APIs
**Use Case**: Forward client requests to the NestJS application server.

NestJS runs as a Node.js process, often on a port like `3000`. Nginx acts as a reverse proxy, receiving client requests and forwarding them to the NestJS server, improving security and performance.

- **How It Works**: Nginx listens for HTTP requests and proxies them to the NestJS app, managing headers and connection upgrades (e.g., for WebSockets).
- **Benefits**: Shields the Node.js server from direct exposure and enables features like compression.

**Example Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name backend.example.com;

    location / {
        proxy_pass http://localhost:3000; # Proxy to NestJS
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 2. Static File Serving
**Use Case**: Deliver static assets directly to reduce load on the NestJS server.

NestJS apps may include static files like images, CSS, or client-side JavaScript. Nginx can serve these files directly, bypassing the Node.js server for efficiency.

- **How It Works**: Nginx maps a URL path (e.g., `/static/`) to a directory on the EC2 instance, serving files like images or bundled frontend assets.
- **Benefits**: Frees up the NestJS server to focus on dynamic API requests, improving response times.

**Example Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name backend.example.com;

    location /static/ {
        root /path/to/nestjs; # Serve files from /path/to/nestjs/static/
        expires 1y; # Cache static files
    }

    location / {
        proxy_pass http://localhost:3000; # Proxy API requests
        proxy_set_header Host $host;
    }
}
```

## 3. Load Balancing
**Use Case**: Distribute traffic across multiple NestJS instances for scalability.

For high-traffic NestJS applications, Nginx can balance requests across multiple Node.js instances running on the same or different EC2 instances.

- **How It Works**: Nginx defines an upstream group of NestJS servers and distributes requests using strategies like round-robin or least connections.
- **Benefits**: Increases reliability and handles traffic spikes by leveraging multiple servers.

**Example Nginx Configuration**:
```nginx
upstream nestjs_backend {
    server localhost:3000; # Instance 1
    server localhost:3001; # Instance 2
}

server {
    listen 80;
    server_name backend.example.com;

    location / {
        proxy_pass http://nestjs_backend; # Load balance across instances
        proxy_set_header Host $host;
    }
}
```

## 4. SSL Handling
**Use Case**: Secure client connections with HTTPS.

Nginx can terminate SSL/TLS connections for NestJS, encrypting communication between clients and the server using a certificate (e.g., from Let’s Encrypt).

- **How It Works**: Nginx listens on port 443, uses SSL certificates, and proxies decrypted requests to the NestJS server. It also redirects HTTP to HTTPS for consistent security.
- **Benefits**: Ensures secure data transfer and builds trust with users.

**Example Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name backend.example.com;
    return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl;
    server_name backend.example.com;

    ssl_certificate /etc/letsencrypt/live/backend.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/backend.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000; # Proxy to NestJS
        proxy_set_header Host $host;
    }
}
```


## Why Nginx for NestJS?
Nginx enhances NestJS deployments by:
- **Optimizing Performance**: Serves static files and balances load efficiently.
- **Improving Security**: Manages SSL/TLS for secure HTTPS connections.
- **Ensuring Scalability**: Proxies and distributes traffic across multiple instances.

Each use case—reverse proxying, static file serving, load balancing, and SSL handling—makes Nginx an essential tool for deploying NestJS on an EC2 instance.

## Should we use Nginx for scalling?
Scaling a NestJS application with Nginx on a single EC2 instance is constrained by the server’s resources, which can become overloaded under high traffic. Adding new NestJS instances requires updating Nginx’s configuration to include them in load balancing, which can be manual in basic setups. For more automated scaling and load balancing, a solution like Amazon ECS with an Application Load Balancer (ALB) can dynamically manage and distribute traffic across multiple instances.