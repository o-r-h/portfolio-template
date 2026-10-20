# 3D Portfolio Template

A single-page, interactive portfolio template built with Three.js, Vite, and vanilla HTML, CSS, and JavaScript. It presents portfolio sections as cards in a 3D carousel, with keyboard and pointer navigation and a responsive information panel.

The project was created with **Claude Opus 5.5 + GLM 5.3**. The original project prompt is included in [`prompt.md`](./prompt.md).

## Features

- Interactive 3D carousel with five editable portfolio sections
- Animated visual effects and a motion toggle that respects reduced-motion preferences
- Keyboard navigation: use the arrow keys to navigate, Enter to open a section, and Escape to close it
- Responsive HTML details panel and a navigation fallback
- Placeholder copy and sample images ready to replace with your own content

## Screenshot

![Screenshot of the 3D portfolio template](https://i.ibb.co/LDJ4bVQq/portfolio-template.png)

## Getting started

You’ll need Node.js and npm. The project’s scripts use Vite; install it as a development dependency if it is not already available:

```bash
npm install
npm install --save-dev vite
npm run dev
```

Open the local URL printed by Vite. To create a production build, run:

```bash
npm run build
```

To run the app: on portfolio-template folder run
```bash mac
python3 -m http.server 8080   
```
```bash windows
py -m http.server 8080  
```

## Customize

- Edit the `sections` array near the beginning of [`main.js`](./main.js) to update titles, descriptions, bullets, links, and tags.
- Replace the sample images in [`images/`](./images/) or update the image paths in the section data.
- Adjust the interface styling in [`styles.css`](./styles.css).

## Use

You are free to use, customize, and adapt this template for your own portfolio.
