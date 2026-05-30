# Deployment Guide - ConvertAll

This guide covers how to deploy the Unit & Currency Converter website to various hosting platforms.

## Prerequisites

- No build step required - this is a static site
- All files in the project directory are ready to deploy
- Update `example.com` URLs in `sitemap.xml` and canonical tags to your actual domain

## Before Deploying

1. **Update domain references:**
   - Replace `https://example.com` with your actual domain in:
     - `sitemap.xml`
     - All HTML files (canonical URLs, Open Graph URLs)
     - `robots.txt`

2. **Google AdSense:**
   - After deployment and building traffic, apply for AdSense
   - Replace ad placeholder divs with actual AdSense code

## Deployment Options

### 1. Netlify (Recommended - Free)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up/Login
3. Drag and drop the entire project folder to the Netlify dashboard
4. Your site will be live at `your-site.netlify.app`
5. (Optional) Add a custom domain in Site Settings > Domain Management

**Or via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### 2. Vercel (Free)

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub/GitLab/Bitbucket
3. Import your repository
4. Vercel auto-detects it as a static site
5. Click Deploy

**Or via CLI:**
```bash
npm i -g vercel
vercel --prod
```

### 3. GitHub Pages (Free)

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings > Pages
4. Select source branch (usually `main`)
5. Your site will be at `username.github.io/repo-name`

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### 4. Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Connect your Git repository
3. Set build output directory to `/` (root)
4. Deploy

### 5. Firebase Hosting (Free tier)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select the project directory as public folder
# Choose "No" for single-page app
# Choose "No" for GitHub deploys
firebase deploy
```

### 6. Traditional Web Hosting (FTP)

1. Connect to your hosting via FTP/SFTP client (FileZilla, etc.)
2. Upload all files to the `public_html` or `www` directory
3. Ensure the file structure is preserved

### 7. AWS S3 + CloudFront

```bash
# Create S3 bucket
aws s3 mb s3://your-converter-site

# Upload files
aws s3 sync . s3://your-converter-site --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://your-converter-site --index-document index.html
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test dark mode toggle
- [ ] Test currency converter API (requires HTTPS for fetch)
- [ ] Test on mobile devices
- [ ] Verify all internal links work
- [ ] Submit sitemap to Google Search Console
- [ ] Submit site to Bing Webmaster Tools
- [ ] Set up Google Analytics
- [ ] Apply for Google AdSense (after building traffic)
- [ ] Monitor Core Web Vitals in Search Console

## SSL/HTTPS

Most modern hosting platforms provide free SSL certificates:
- **Netlify:** Automatic via Let's Encrypt
- **Vercel:** Automatic
- **GitHub Pages:** Automatic for custom domains
- **Cloudflare:** Automatic with their proxy

HTTPS is required for:
- The currency converter API (fetch to external API)
- Google AdSense eligibility
- SEO ranking benefits

## Custom Domain Setup

1. Purchase a domain from a registrar (Namecheap, Google Domains, Cloudflare Registrar)
2. Add DNS records pointing to your hosting:
   - **Netlify:** Add CNAME record pointing to `your-site.netlify.app`
   - **Vercel:** Add CNAME record pointing to `cname.vercel-dns.com`
   - **GitHub Pages:** Add A records to GitHub's IPs or CNAME to `username.github.io`
3. Configure the custom domain in your hosting dashboard
4. Wait for DNS propagation (up to 48 hours)
5. Verify SSL certificate is active

## Performance Optimization

The site is already optimized, but for production:
- Enable gzip/brotli compression on your server
- Set proper cache headers (1 year for CSS/JS, 1 week for HTML)
- Most hosting platforms handle this automatically

## Monitoring

- **Google Search Console:** Monitor search performance and indexing
- **Google Analytics:** Track visitor behavior and popular pages
- **PageSpeed Insights:** Monitor Core Web Vitals
