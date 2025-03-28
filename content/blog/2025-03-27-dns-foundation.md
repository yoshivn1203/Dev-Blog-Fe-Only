---
layout: blog
title: How does DNS work?
date: 2025-03-27T20:51:15
author: Nguyen Nguyen
tags:
  - Cloud
  - DevOps
  - Security
reading_time: 12
category: technology
thumbnail: /images/uploads/what-is-dns.png
description: "Understanding DNS Records - A Focus on the Most Used Type\r"
---
DNS (Domain Name System) is like the internet's phonebook—it translates human-friendly domain names (e.g., `example.com`) into machine-readable IP addresses (e.g., `192.0.2.1`). To make this magic happen, DNS relies on various types of records. While there are many DNS record types—each serving a unique purpose—the **A record** stands out as the most commonly used. In this post, we'll explore what an `A` record is and walk through how to set it up in AWS Route 53 to get your app online.

## What Are DNS Records?

DNS records are instructions stored in a domain's DNS configuration that tell the internet what to do when someone tries to access your domain. Different record types handle different tasks, such as pointing to a server, routing email, or verifying ownership. Here's a quick rundown of some common ones:

- **A (Address)**: Maps a domain to an IPv4 address (e.g., `192.0.2.1`).
- **CNAME (Canonical Name)**: Aliases one domain to another (e.g., mapping `www.example.com` to `example.com`).
- **MX (Mail Exchange)**: Directs email to a mail server.
- **TXT (Text)**: Stores text info, often for verification or security (e.g., SPF records).

## The Mighty A Record

The `A` record, short for "Address," is the most fundamental and widely used DNS record. It links your domain (or subdomain) to an IPv4 address, telling browsers and apps where to find your server. For example:

- Domain: `example.com`
- A Record: `192.0.2.1`

When someone types `example.com` into their browser, the DNS system uses the `A` record to locate the server at `192.0.2.1` and serve your app or website.

## Setting Up an A Record in AWS Route 53

Let’s say you’ve registered a domain (e.g., `myapp.com`) and have an app running on a server with a public IP address (e.g., `203.0.113.10`). Now, you need to connect the two using an `A` record in AWS Route 53, Amazon’s DNS service. Here’s how to do it step-by-step.

### Prerequisites

1. **A registered domain**: You’ve purchased `myapp.com` (either through Route 53 or another registrar).
1. **An IP address**: Your app is running on a server with a static public IP (e.g., `203.0.113.10`).
1. **Access to Route 53**: You’re logged into the AWS Management Console.

If you registered your domain elsewhere, ensure its nameservers point to Route 53 by updating them to the values provided when you create a hosted zone (more on that below).

### Step-by-Step Guide

#### 1. Create a Hosted Zone in Route 53

- Open the **Route 53** console in AWS.
- Click **Hosted zones** in the sidebar, then **Create hosted zone**.
- Enter your domain name (e.g., `myapp.com`) in the "Domain name" field.
- Leave the type as **Public hosted zone**.
- Click **Create hosted zone**.
- Route 53 will generate a set of nameservers (e.g., `ns-123.awsdns-01.com`). If your domain isn’t registered with Route 53, update your registrar’s nameserver settings to these values.

#### 2. Add an A Record

- In the Route 53 console, select your new hosted zone (`myapp.com`).
- Click **Create record**.
- Configure the record:
  - **Record name**: Leave blank for the root domain (`myapp.com`) or enter a subdomain (e.g., `www` for `www.myapp.com`).
  - **Record type**: Select `A – IPv4 address`.
  - **Value**: Enter your server’s IP address (e.g., `203.0.113.10`).
  - **TTL (Time to Live)**: Set to `300` seconds (5 minutes) or your preferred value.
  - **Routing policy**: Choose **Simple routing** (default).
- Click **Create records**.

### Bonus: Adding a www Subdomain

Want `www.myapp.com` to work too? Add another `A` record:

- **Record name**: `www`
- **Record type**: `A`
- **Value**: `203.0.113.10`
- Save it, and both `myapp.com` and `www.myapp.com` will point to your app.

Another option is to use CNAME to map `www.myapp.com` to `myapp.com`

## Conclusion

The `A` record is the workhorse of DNS—simple, essential, and ubiquitous. With it, you can connect your domain to your app’s server and get online in no time. AWS Route 53 makes the process straightforward, and once your `A` record is set, your users can access your app with a friendly domain name instead of a clunky IP address. Happy hosting!