---
layout: blog
title: "Ingress and Egress in AWS EC2: Differences and Examples"
date: 2025-03-28T16:53:00
author: Nguyen Nguyen
tags:
  - Cloud
  - DevOps
reading_time: 8
category: technology
thumbnail: /images/uploads/amazon-ec2.jpg
description: "Ingress and Egress in AWS EC2\r"
---
When managing Amazon EC2 instances, controlling network traffic is critical for security and functionality. Two key concepts in this context are **ingress** and **egress**, which define the direction of traffic relative to your EC2 instance. In this article, we’ll explain what ingress and egress mean, how they differ, and provide practical examples—including why SSH requires both—to help you configure your EC2 instances effectively.

## What is Ingress?

**Ingress** refers to inbound traffic—data flowing _into_ your EC2 instance from an external source, such as the internet, another instance, or a service. In AWS, ingress rules are defined in a security group to specify what traffic is allowed to reach the instance.

For example:

- Allowing a web browser to access a web server on port 80 (HTTP) is an ingress rule.
- Permitting SSH access from your local machine to the EC2 instance is also ingress.

Ingress is about _who can talk to your instance_ and under what conditions.

## What is Egress?

**Egress** refers to outbound traffic—data flowing _out_ of your EC2 instance to an external destination, like the internet, another AWS resource, or a database. Egress rules, also set in a security group, control what traffic your instance can send.

For example:

- An EC2 instance fetching updates from a package repository (e.g., `yum update`) requires egress.
- Sending a response back to a client after an SSH request is also egress.

Egress is about _where your instance can send data_.

## Key Differences Between Ingress and Egress

|Aspect |Ingress |Egress |
|---|---|---|
|Direction | Inbound (to the instance)|Outbound (from the instance) |
|Purpose |Controls who can access the instance|Controls what the instance can access|
|Example Use|Allowing HTTP requests from users| Fetching data from an external API|
|Security Focus|Protecting against unauthorized access|Limiting unintended outbound connections|

In AWS security groups, ingress and egress are managed separately, but they’re **stateful**. This means if you allow ingress traffic (e.g., an SSH request), the corresponding egress traffic (e.g., the SSH response) is automatically permitted, even if no explicit egress rule exists for it. However, for outbound-initiated connections (e.g., the instance contacting an external server), you need explicit egress rules.

## Why SSH Requires Both Ingress and Egress

SSH (Secure Shell) is a common protocol for remotely managing EC2 instances, and it illustrates how ingress and egress work together. Here’s why both are involved:

1. **Ingress for SSH**:
   1. You want to connect from your local machine (e.g., IP `192.168.1.10`) to the EC2 instance.
   1. You configure a security group rule:
      1. Type: SSH
      1. Protocol: TCP
      1. Port: 22
      1. Source: `192.168.1.10/32` (your IP)
   1. This allows your SSH client to send a connection request _into_ the EC2 instance.
1. **Egress for SSH**:
   1. Once connected, the EC2 instance sends responses (e.g., terminal output) back to your machine.
   1. Because security groups are stateful, this egress traffic is automatically allowed as a response to the ingress request.
   1. However, if your instance needs to _initiate_ an SSH connection to another server (e.g., `git clone` from GitHub), you’d need an explicit egress rule:
      1. Type: SSH
      1. Protocol: TCP
      1. Port: 22
      1. Destination: `0.0.0.0/0` (or a specific IP)

Without ingress, you couldn’t start the SSH session. Without egress (or its stateful allowance), the instance couldn’t respond, breaking the connection.

## Practical Example: Web Server on EC2

Let’s set up an EC2 instance running a web server (e.g., Nginx) to see ingress and egress in action:

### Security Group Configuration

- **Ingress Rules**:
  - Type: HTTP
  - Protocol: TCP
  - Port: 80
  - Source: `0.0.0.0/0` (allow all inbound web traffic)
  - Purpose: Lets users access the web server from their browsers.
- **Egress Rules**:
  - Type: All Traffic
  - Protocol: All
  - Port Range: All
  - Destination: `0.0.0.0/0`
  - Purpose: Allows the instance to fetch updates (e.g., `sudo apt update`) or connect to an external database.

### Scenario

1. A user visits `http://ec2-public-ip`
   1. Ingress: The browser’s request hits port 80, permitted by the ingress rule.
   1. Egress: The web server sends the HTML response back (stateful, no explicit egress rule needed for this).
1. The instance updates itself:
   1. Egress: The instance sends a request to an external repository (e.g., Ubuntu servers), allowed by the egress rule.
   1. Ingress: The repository sends data back (stateful, no explicit ingress rule needed).

If you removed the egress rule, the instance couldn’t fetch updates or contact external services, even though the web server would still respond to inbound requests.
