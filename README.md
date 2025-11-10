# Personal Portfolio

A modern, responsive portfolio site for Ujjwal Garud. Built with vanilla HTML/CSS/JS for easy hosting anywhere.

## Quick start

1. Open `index.html` in a browser (double click) or use a static server.
2. Edit content directly in `index.html` (name, links, projects, experience).
3. Customize styles in `styles.css` and behavior in `script.js`.

## Customize

- Update meta tags and `og:` tags in `index.html` with your domain and socials.
- Replace `your-username`, `your-domain.example`, and `you@example.com` placeholders.
- Add your `assets/resume.pdf` and any images (e.g., `assets/og-image.png`).

### Profile photo

- Place your PNG/JPG at `assets/profile.png` (recommended size: 800×800+).
- The home page references it here: `index.html` → `.profile-img` `src="assets/profile.png"`.
- Use a square image with your face centered; it will be cropped with rounded corners.

## Contact form

Default behavior opens a `mailto:` to your email. To switch to EmailJS:

1. Create an EmailJS account and a service/template.
2. Include EmailJS SDK in `index.html` before `script.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>emailjs.init('YOUR_PUBLIC_KEY');</script>
```

3. Replace the submit handler in `script.js` with an `emailjs.send(...)` call.

## SEO

- `robots.txt` is included. Add `sitemap.xml` when you deploy.
- Open Graph tags are set; update image and URL.

## Deploy

- GitHub Pages, Netlify, or Vercel can host this as static files.
- For GitHub Pages: push this folder, enable Pages on `main` in repo settings.


