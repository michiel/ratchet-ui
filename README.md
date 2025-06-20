# Ratchet UI CDN Assets

Built from commit: a1ec2c61693148b3332b89f6581b4fd87563db46
Built at: Fri Jun 20 13:29:25 UTC 2025

## Usage
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/michiel/ratchet-ui@main-build/style.css?v=a1ec2c6">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/michiel/ratchet-ui@main-build/script.js?v=a1ec2c6"></script>
```

## Cache Busting
Use version.json to get current version for cache busting:
```javascript
fetch("https://cdn.jsdelivr.net/gh/michiel/ratchet-ui@main-build/version.json")
  .then(r => r.json())
  .then(v => console.log("Current version:", v.version));
```
