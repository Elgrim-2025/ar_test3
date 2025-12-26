# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WebAR (Augmented Reality) project using encantar.js with A-Frame for image tracking. The application uses a declarative HTML-based approach to create AR experiences that track reference images through the device camera.

## Development Commands

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

Note: This project uses `rolldown-vite@7.2.5` as an override for the standard Vite bundler.

## Project Structure

- `index.html` - A-Frame AR scene with declarative AR setup
- `public/` - Static assets (reference images for tracking)
  - `sahur.webp` - Reference image for tracking
- `assets/` - encantar.js library and plugins
  - `encantar.min.js` - Core encantar.js library
  - `plugins/` - Rendering engine integrations
    - `aframe-with-encantar.js` - A-Frame integration plugin (currently used)
    - `three-with-encantar.js` - Three.js integration plugin
    - `babylon-with-encantar.js` - Babylon.js integration plugin
  - `addons/` - Custom A-Frame components
    - `gltf-anim.js` - Custom A-Frame component for GLTF animations
    - `ar-scan-gimmick.js` - Custom A-Frame component for scan UI overlay

## Architecture

This project uses a **declarative A-Frame approach** where AR is configured entirely through HTML elements and attributes. No manual JavaScript session management is required.

### A-Frame AR Scene Structure

The AR scene is structured using custom A-Frame elements provided by the encantar.js A-Frame plugin:

1. **AR Session Setup** (`<a-scene encantar>`)
   - The `encantar` attribute initializes the AR session
   - `stats: true; gizmos: true` enables performance stats and debugging gizmos
   - `loading-screen="enabled: false"` disables the default A-Frame loading screen

2. **AR Sources** (`<ar-sources>`)
   - Defines input sources for the AR session
   - `<ar-camera-source>` uses the device's webcam

3. **AR Trackers** (`<ar-trackers>`)
   - `<ar-image-tracker>` configures image tracking with resolution setting
   - `<ar-reference-image>` elements define trackable images with name and src

4. **AR Viewport** (`<ar-viewport>`)
   - Manages the AR camera view
   - `<ar-hud>` provides a 2D overlay layer in front of the AR scene
   - `<ar-scan-gimmick>` displays a scan prompt when no targets are tracked

5. **Virtual Content** (`<ar-root>`)
   - Acts as a container for 3D content anchored to tracked images
   - Content inside `<ar-root reference-image="sahur">` appears when "sahur" image is detected
   - Uses standard A-Frame entities for 3D models, lights, and audio

### Custom A-Frame Components

**`gltf-anim`** - GLTF animation controller
- Manages animation playback for GLTF models
- Schema properties:
  - `clip`: Animation clip name (defaults to first clip alphabetically)
  - `loop`: Whether to loop the animation (default: true)
  - `speed`: Playback speed multiplier (default: 1)
  - `transitionDuration`: Cross-fade duration between clips (default: 0)
- Uses Three.js AnimationMixer under the hood
- Example: `<a-entity gltf-model="#model" gltf-anim="clip: Walk; speed: 1.5">`

**`ar-scan-gimmick`** - Scan UI overlay
- Displays a scan prompt image when no AR targets are detected
- Automatically hides when a target is found
- Schema properties:
  - `src`: Custom image URL (defaults to built-in scan icon)
  - `opacity`: Image opacity (default: 1.0)
- Must be a direct child of `<ar-hud>`

### Event Handling

The A-Frame scene emits tracking events:
- `artargetfound` - Fired when a reference image is detected (auto-hides scan gimmick)
- `artargetlost` - Fired when tracking is lost (auto-shows scan gimmick)

## Adding Reference Images

To add new trackable reference images:

1. Add the image file to `public/` (use .webp format for best performance)
2. Add an `<ar-reference-image>` element inside `<ar-image-tracker>`:
   ```html
   <ar-reference-image name="my-image" src="public/my-image.webp"></ar-reference-image>
   ```
3. Create an `<ar-root>` element to display content when the image is tracked:
   ```html
   <ar-root reference-image="my-image">
     <!-- Your 3D content here -->
   </ar-root>
   ```

## Adding 3D Content to AR

Content inside `<ar-root>` uses standard A-Frame entities:

**Loading 3D models:**
```html
<a-assets>
  <a-asset-item id="my-model" src="https://example.com/model.glb"></a-asset-item>
  <!-- Or use local files: src="public/model.glb" -->
</a-assets>

<ar-root reference-image="sahur">
  <a-entity gltf-model="#my-model" position="0 0 0" scale="1 1 1"></a-entity>
</ar-root>
```

**Adding animated models:**
```html
<a-entity
  gltf-model="#my-model"
  gltf-anim="clip: Walk; loop: true; speed: 1"
>
</a-entity>
```

**Adding audio:**
```html
<a-assets>
  <audio id="my-sound" src="https://example.com/sound.wav"></audio>
  <!-- Or use local files: src="public/sound.wav" -->
</a-assets>

<ar-root reference-image="sahur">
  <a-entity>
    <a-sound src="#my-sound" autoplay="true" loop="true"></a-sound>
  </a-entity>
</ar-root>
```

Note: Assets can be loaded from remote URLs (as shown in the current `index.html`) or from the local `public/` directory.

## Available Rendering Approaches

While this project uses A-Frame, encantar.js also provides plugins for:
- **Three.js**: `assets/plugins/three-with-encantar.js`
- **Babylon.js**: `assets/plugins/babylon-with-encantar.js`

To switch to a different rendering approach, refer to the encantar.js documentation for imperative API usage.
