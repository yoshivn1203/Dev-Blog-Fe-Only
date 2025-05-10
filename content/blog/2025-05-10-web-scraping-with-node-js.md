---
layout: blog
title: "Web Scraping with Node.js"
date: 2025-05-10T13:37:13
author: Nguyen Nguyen
tags:
  - Nodejs
reading_time: 15
category: Technology
thumbnail: /images/uploads/1745988931422-web-scraping.jpeg
description: "How to scrape a web using nodejs, differences between scrapping a SSR and CSR website, work around of dns anti bot"
---


# Web Scraping with Node.js: SSR vs. CSR Websites

Web scraping is a powerful technique for extracting data from websites, but the approach differs depending on whether you're targeting a Server-Side Rendered (SSR) website or a client-side rendered website, like one built with React. This article explores how to scrape both types using Node.js, highlighting the differences, challenges, and advanced techniques to bypass anti-bot protections.

## Scraping Server-Side Rendered (SSR) Websites

SSR websites generate HTML on the server and send a fully rendered page to the client. This makes scraping relatively straightforward because the data is embedded in the initial HTML response.

### How to Scrape SSR Websites

To scrape an SSR website, you can use libraries like `axios` or `node-fetch` to make HTTP requests and a parser like `cheerio` to extract data from the HTML.

#### Example: Scraping an SSR Website

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSSRWebsite(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const title = $('h1').text();
    console.log('Title:', title);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
  }
}

scrapeSSRWebsite('https://example.com');
```

### Challenges with SSR Websites

While SSR websites are easier to scrape, you might encounter a **403 Forbidden** error when making direct requests. This often happens because the server detects your request as coming from a bot. To bypass this, you need to make your request mimic a browser by setting appropriate headers, such as:

- **User-Agent**: Mimics a browser like Chrome or Firefox.
- **Accept**: Specifies the type of content (e.g., `text/html`).
- **Referer**: Simulates a request from a legitimate source.

#### Updating Axios with Browser-Like Headers

To avoid 403 errors, configure `axios` with headers that resemble a browser request:

```javascript
const axios = require('axios');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': 'https://www.google.com/',
  'Connection': 'keep-alive',
};

async function scrapeWithHeaders(url) {
  try {
    const response = await axios.get(url, { headers });
    console.log('HTML:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
  }
}
```

By setting these headers, your request is more likely to be treated as a legitimate browser request, reducing the chances of a 403 error. if this still not work, consider using **Puppeteer** similar to how we use it for **CSR** website below. 

## Scraping CSR Websites

CSR websites, which rely on client-side rendering, present a different challenge. The initial HTML response is often minimal, containing mostly JavaScript that renders the content in the browser. To scrape such websites, you need to execute the JavaScript to obtain the fully rendered HTML.

### Why Puppeteer is Necessary

For React websites, tools like `axios` alone are insufficient because they only retrieve the raw HTML without executing JavaScript. This is where **Puppeteer**, a headless browser automation tool, comes in. Puppeteer launches a browser instance, renders the page (including JavaScript), and allows you to extract the final HTML.

#### Example: Scraping a React Website with Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function scrapeReactWebsite(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set User-Agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    
    // Example: Extract title
    const title = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log('Title:', title);
    
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeReactWebsite('https://react-website-example.com');
```

### Key Points About Puppeteer

- **Headless Mode**: Runs the browser without a visible UI, making it suitable for scraping.
- **Network Idle**: The `waitUntil: 'networkidle2'` option ensures the page is fully loaded before scraping.
- **Performance**: Puppeteer is resource-intensive compared to `axios`, so use it only when necessary (e.g., for client-side rendered websites).

## SSR vs. CSR: Key Differences in Scraping

| Aspect                  | SSR Website                            | React Website                          |
|-------------------------|---------------------------------------|---------------------------------------|
| **Rendering**           | HTML rendered on the server           | HTML rendered in the browser via JS   |
| **Tool Required**       | `axios` + `cheerio`                   | `puppeteer`                           |
| **Complexity**          | Simpler, direct HTTP request          | Complex, requires JS execution        |
| **Common Issues**       | 403 errors (fix with headers)         | Missing content without JS rendering  |
| **Performance**         | Faster, lightweight                   | Slower, resource-intensive            |

## Advanced Techniques: Bypassing Anti-Bot and Rate Limiting (Cloudflare, Akamai, etc.)

Many websites employ anti-bot protections like **Cloudflare**, **Akamai**, or other DNS-based security systems to block scrapers. These systems use techniques like rate limiting, JavaScript challenges, and browser fingerprinting to detect bots. Below are advanced strategies to bypass such protections.

### 1. **Rotating User-Agents**

Anti-bot systems often flag requests with static or suspicious User-Agents. Use a library like `fake-useragent` to rotate User-Agents dynamically.

#### Example: Rotating User-Agents

```javascript
const axios = require('axios');
const UserAgent = require('fake-useragent');

async function scrapeWithRotatingUA(url) {
  const ua = new UserAgent();
  const headers = {
    'User-Agent': ua.random,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };
  try {
    const response = await axios.get(url, { headers });
    console.log('HTML:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
  }
}
```

### 2. **Using Proxies**

Cloudflare and similar systems may block requests from a single IP address if they detect excessive activity. Rotating proxies can help distribute requests across multiple IPs, reducing the likelihood of rate limiting or IP bans.

#### Example: Using Proxies with Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function scrapeWithProxy(url) {
  const proxy = 'http://proxy-provider.com:port'; // Replace with a real proxy
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--proxy-server=${proxy}`],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log('Title:', title);
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

**Note**: Use reputable proxy providers (e.g., Bright Data, Oxylabs) and consider residential proxies, as they are less likely to be flagged than datacenter proxies.

### 3. **Handling JavaScript Challenges**

Cloudflare often serves a JavaScript challenge page that requires browser-like behavior to pass. Puppeteer can handle these challenges automatically by rendering the page and executing the JavaScript.

#### Tips for Handling JS Challenges

- Enable JavaScript in Puppeteer: Ensure `page.setJavaScriptEnabled(true)` (default).
- Wait for Navigation: Use `page.goto(url, { waitUntil: 'networkidle0' })` to wait for all network activity, including challenge resolution.
- Solve CAPTCHAs: If a CAPTCHA appears, consider services like 2Captcha or Anti-Captcha to automate solving, though this adds cost and complexity.

### 4. **Rate Limiting Mitigation**

To avoid triggering rate limits, implement delays between requests and mimic human-like behavior.

#### Example: Adding Delays with Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function scrapeWithDelay(urls) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log('Title:', title);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
  }

  await browser.close();
}
```

### 5. **Browser Fingerprinting Evasion**

Advanced anti-bot systems analyze browser fingerprints (e.g., screen resolution, WebGL, canvas rendering). To evade detection:

- **Randomize Viewport**: Set random viewport sizes in Puppeteer.
- **Disable WebGL**: Use Puppeteer’s `--disable-webgl` flag if not needed.
- **Stealth Plugins**: Use `puppeteer-extra-plugin-stealth` to make Puppeteer less detectable.

#### Example: Using Stealth Plugin

```javascript
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeWithStealth(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const title = await page.evaluate(() => document.querySelector('h1')?.innerText);
  console.log('Title:', title);
  await browser.close();
}
```

### 6. **Cloudflare-Specific Workarounds**

Cloudflare’s protections are particularly robust. In addition to the above, consider:

- **TLS Fingerprinting**: Use libraries like `axios` with custom TLS settings or Puppeteer to match Chrome’s TLS fingerprint.
- **Undetected-Chromedriver**: For Node.js, libraries like `undetected-chromedriver` (a Puppeteer alternative) can help bypass Cloudflare by mimicking a real Chrome browser more closely.

## Best Practices for Web Scraping

1. **Respect Robots.txt**: Check the website’s `robots.txt` file to ensure scraping is allowed.
2. **Rate Limiting**: Avoid overwhelming the server by adding delays between requests.
3. **Error Handling**: Implement robust error handling for network issues or blocked requests.
4. **Dynamic Headers**: Rotate User-Agents or use libraries like `fake-useragent` to avoid detection.
5. **Legal Considerations**: Ensure compliance with the website’s terms of service and applicable laws.
6. **Monitor Responses**: Regularly check for anti-bot triggers (e.g., CAPTCHA pages) and adjust strategies accordingly.

## Conclusion

Scraping SSR websites is generally simpler, requiring only HTTP requests and proper headers to bypass restrictions like 403 errors. React websites, however, demand tools like Puppeteer to render JavaScript and access the full content. Advanced anti-bot protections, such as those from Cloudflare, require sophisticated techniques like proxy rotation, stealth plugins, and JavaScript challenge handling. By combining these strategies with ethical scraping practices, you can effectively scrape both SSR and React websites while minimizing detection and rate-limiting issues.