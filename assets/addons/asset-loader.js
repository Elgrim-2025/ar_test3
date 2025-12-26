/*!
 * Asset Loader with Loading Screen
 * @version 2.0.0
 * @author Created for encantar.js AR project
 * @license LGPL-3.0-or-later
 */

(function() {

'use strict';

/**
 * Asset Loader Component
 * Displays a loading screen while preloading AR assets using AssetManager
 * The loading screen must exist in HTML with id="asset-loading-screen"
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
        }
    },

    init: function() {
        this.assetManager = new AssetManager();
        this.loadingScreen = document.getElementById('asset-loading-screen');
        this.progressBar = document.getElementById('asset-progress-bar');
        this.progressText = document.getElementById('asset-progress-text');
        this.totalAssets = 0;
        this.loadedAssets = 0;

        // Start loading immediately
        this.startLoading();
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
                }, 300);
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

})();
