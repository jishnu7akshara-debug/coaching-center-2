# Sri Saraswathi Academy website

A static, single-page website for a coaching institute in Kukatpally, Hyderabad. No build step and no dependencies.

## Folder layout

```
public/                  <- the website. Deploy this folder only.
  index.html             page markup, SEO tags, structured data
  privacy.html           privacy policy (DPDP Act 2023)
  404.html               "page not found" page
  styles.css             all styles and colour tokens
  script.js              menu, header, tabs, FAQ, animations, enquiry form (settings at the top)
  images/                photos, plus og-image.jpg for link previews
  favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png
  site.webmanifest       app icon and colour info for phones
  robots.txt, sitemap.xml
  _headers               security and caching headers (Netlify, Cloudflare Pages)
backup/original-2026-11-17/   the original single-file version, untouched
```

## Preview locally

```
cd public
python -m http.server 8002
```

Then open http://localhost:8002. (Python's server shows its own 404 page; real hosts use `404.html`.)

## Deploy

Any static host works. Point it at the `public` folder.

- **Netlify**: drag the `public` folder onto app.netlify.com/drop, or set the publish directory to `public`. `_headers` and `404.html` are used automatically.
- **Cloudflare Pages**: set the build output directory to `public`, with no build command.
- **Vercel, GitHub Pages or shared hosting**: upload `public`. Copy the headers from `_headers` into that host's config.

## Go-live checklist

1. **Domain.** Replace `https://www.saraswathiacademy.example` in `index.html` (canonical, Open Graph, structured data), `privacy.html`, `robots.txt` and `sitemap.xml`. Replace the email `hello@saraswathiacademy.example` everywhere.
2. **Phone and WhatsApp.** In `script.js`, set `WHATSAPP_NUMBER` (digits only, with 91), `PHONE_DISPLAY` and `PHONE_DIAL`. Also replace `+919000000000` in the footer `tel:` links of all three HTML files and the `telephone` in the JSON-LD.
3. **Address and hours.** Replace "Plot 00, Road No 1" and the map coordinates in the JSON-LD and on the page. Check the batch timings and opening hours match.
4. **Faculty.** The four faculty names, credentials and photos are placeholders (stock photos). Replace them with the real teachers and real photos, with their consent. The page promises "named senior faculty teach", so this must be true.
5. **Fees and batch sizes.** Confirm every fee, the instalment plan and the sibling concession are accurate.
6. **Photos.** Replace stock photos with the institute's own or properly licensed ones, at the same sizes. Regenerate `images/og-image.jpg` (1200 x 630).
7. **Privacy policy.** Read `privacy.html` and adjust the retention periods and contact details to what the institute actually does.
8. **After launch.** Submit `sitemap.xml` in Google Search Console, set up a Google Business Profile, and test the enquiry form on a real phone.

### Cache busting

`styles.css` and `script.js` are linked with `?v=1`. Bump the number whenever you change either file.

### The one-line script in `<head>`

`_headers` allows `document.documentElement.classList.add("js");` by its SHA-256 hash. If you change it, recompute:

```
python -c "import hashlib,base64;print(base64.b64encode(hashlib.sha256(b'document.documentElement.classList.add(\"js\");').digest()).decode())"
```

If you forget, nothing breaks: animations are skipped and content stays visible.
