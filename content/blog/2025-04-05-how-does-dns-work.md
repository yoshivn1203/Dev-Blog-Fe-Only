---
layout: blog
title: "How does DNS work?"
date: 2025-04-05T07:25:53
author: Nguyen Nguyen
tags:
  - Cloud
  - DevOps
  - Security
reading_time: 11
category: technology
thumbnail: /images/uploads/what-is-dns.png
description: "Understanding DNS Records - A Focus on the Most Used Type "
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

### Bonus 1: Adding a www Subdomain

Want `www.myapp.com` to work too? Add another `A` record:

- **Record name**: `www`
- **Record type**: `A`
- **Value**: `203.0.113.10`
- Save it, and both `myapp.com` and `www.myapp.com` will point to your app.

Another option is to use CNAME to map `www.myapp.com` to `myapp.com`

### Bonus 2: Using alias with A record to mapping root domain

When you're using a CDN (Cloudflare, Akamai, or AWS CloudFront) for your website, it’s generally recommended to use an ALIAS (or equivalent, like ANAME) record for your root domain. It's because the IP addresses associated with their endpoints can change dynamically due to load balancing so a normal A record pointing to the IP won't work.

Also, you can’t use a CNAME record to map the domain to CDN host namebecause it violate DNS standards to use CNAME record for root domain. So this's how you should do it in Route 53 hosted zone:

- **Record name**: Leave blank for the root domain
- **Record Type**:  `A`
-  **Alias**: true
-  **Route Traffic to**: **Alias to Cloudfront distribution**
- **Value**: `example.cloudfront.net` (CDN host name)

Result: Resolves to the CDN’s current IP (e.g., 104.16.1.1) automatically.


## Conclusion

The `A` record is the workhorse of DNS—simple, essential, and ubiquitous. With it, you can connect your domain to your app’s server and get online in no time. AWS Route 53 makes the process straightforward, and once your `A` record is set, your users can access your app with a friendly domain name instead of a clunky IP address. Happy hosting!

Note: Need to add an example of using A record with alias to map to another domain, and why we do this instead of using CNAME record (because we setting this for root domain url)