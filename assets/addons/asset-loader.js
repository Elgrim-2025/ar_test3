/*!
 * Asset Loader with Loading Screen
 * @version 1.0.0
 * @author Created for encantar.js AR project
 * @license LGPL-3.0-or-later
 */

/**
 * Asset Loader Component
 * Displays a loading screen while preloading AR assets using AssetManager
 *
 * Usage:
 * <a-scene asset-loader="assets: url1, url2, url3; timeout: 30">
 */
AFRAME.registerComponent('asset-loader', {
    schema: {
        assets: {
            type: 'array',
            default: []
        },
        timeout: {
            type: 'number',
            default: 30
        },
        backgroundColor: {
            type: 'color',
            default: '#1a1a1a'
        },
        progressColor: {
            type: 'color',
            default: '#00d4ff'
        },
        textColor: {
            type: 'color',
            default: '#ffffff'
        }
    },

    init: function() {
        this.assetManager = new AssetManager();
        this.loadingScreen = null;
        this.progressBar = null;
        this.progressText = null;
        this.totalAssets = 0;
        this.loadedAssets = 0;

        this.createLoadingScreen();
        this.startLoading();
    },

    createLoadingScreen: function() {
        const screen = document.createElement('div');
        screen.id = 'asset-loading-screen';
        screen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${this.data.backgroundColor};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            transition: opacity 0.5s ease-out;
        `;

        const title = document.createElement('div');
        title.textContent = 'Loading AR Experience';
        title.style.cssText = `
            color: ${this.data.textColor};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            text-align: center;
        `;

        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 300px;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 15px;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background-color: ${this.data.progressColor};
            border-radius: 4px;
            transition: width 0.3s ease-out;
        `;

        const progressText = document.createElement('div');
        progressText.textContent = '0%';
        progressText.style.cssText = `
            color: ${this.data.textColor};
            font-size: 16px;
            margin-top: 10px;
        `;

        const loadingText = document.createElement('div');
        loadingText.textContent = 'Please wait...';
        loadingText.style.cssText = `
            color: ${this.data.textColor};
            font-size: 14px;
            margin-top: 20px;
            opacity: 0.7;
        `;

        progressContainer.appendChild(progressBar);
        screen.appendChild(title);
        screen.appendChild(progressContainer);
        screen.appendChild(progressText);
        screen.appendChild(loadingText);

        document.body.appendChild(screen);

        this.loadingScreen = screen;
        this.progressBar = progressBar;
        this.progressText = progressText;
    },

    updateProgress: function() {
        this.loadedAssets++;
        const progress = Math.round((this.loadedAssets / this.totalAssets) * 100);

        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }

        if (this.progressText) {
            this.progressText.textContent = progress + '%';
        }
    },

    startLoading: function() {
        const assets = this.data.assets;

        if (!assets || assets.length === 0) {
            console.warn('No assets to load');
            this.hideLoadingScreen();
            return;
        }

        this.totalAssets = assets.length;

        const loadPromises = assets.map(url => {
            return this.assetManager.preload(url, { timeout: this.data.timeout })
                .then(() => {
                    this.updateProgress();
                })
                .catch(error => {
                    console.error(`Failed to load asset: ${url}`, error);
                    this.updateProgress();
                });
        });

        Promise.all(loadPromises)
            .then(() => {
                console.log('All assets loaded successfully');
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            })
            .catch(error => {
                console.error('Error loading assets:', error);
                this.hideLoadingScreen();
            });
    },

    hideLoadingScreen: function() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
                this.el.emit('assets-loaded', { assetManager: this.assetManager });
            }, 500);
        }
    },

    remove: function() {
        if (this.loadingScreen && this.loadingScreen.parentNode) {
            this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
    }
});
