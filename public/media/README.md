# Media Assets

This directory contains all media assets (images and videos) for the Space Sustainability page.

## Structure

```
/public/media/
├── images/          # Static images
│   ├── fielding.jpg
│   ├── moriba.jpg
│   └── wozniak.jpg
└── video/           # Video files
    └── objects.mp4
```

## Images

- **fielding.jpg** - Portrait of Alex Fielding (CEO + CHAIRMAN)
- **moriba.jpg** - Portrait of Dr. Moriba Jah (CHIEF SCIENTIST)
- **wozniak.jpg** - Portrait of Steve Wozniak (PRESIDENT)

## Videos

- **objects.mp4** - Animation showing space objects/debris orbiting Earth

## Cache Configuration

All media files are configured with long-term caching (1 year) in vercel.json:
- Cache-Control: `public, max-age=31536000, immutable`

## Notes

- All media files are served from `/public/media/` path
- Original files are preserved with their original filenames
- Images are optimized for web delivery
- Video is configured for autoplay with muted audio and loop playback
