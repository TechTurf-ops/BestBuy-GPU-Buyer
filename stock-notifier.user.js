// ==UserScript==
// @name         Simplified Stock Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Checks stock status, clicks 'Add to Cart' if available, refreshes if out of stock, opens URL when button is clicked
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let addToCartClicked = false; // Flag to track if clicked

    function openUrlInNewTab(url) {
        window.open(url, '_blank');
    }

    function waitForElement(xpath, callback, maxAttempts = 30, interval = 1000) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                clearInterval(checkInterval);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn(`Element not found after ${maxAttempts} attempts: ${xpath}`);
            }
            attempts++;
        }, interval);
    }

    function checkStockAndClick() {
        const keywords = ["Out of Stock", "Sold Out", "Unavailable", "Coming Sooon"];
        const isOutOfStock = keywords.some(keyword => document.body.innerText.includes(keyword));

        if (isOutOfStock) {
            console.log("Item out of stock! Refreshing...");
            setTimeout(() => location.reload(), 1000);
        } else if (!addToCartClicked) {
            const addToCartXPath = '/html/body/div[4]/main/div[6]/div/div/div/div/div/div/div[7]/div[1]/div/div[15]/div[1]/div/div/div/div/div/button';
            waitForElement(addToCartXPath, (button) => {
                if (button) {
                    console.log("Clicking Add to Cart and opening URL");
                    button.click();
                    addToCartClicked = true;
                    openUrlInNewTab("https://youtu.be/fpQHabt6e-w?si=kTJadsHj_0-OjNwP");
                }
            });
        }
    }

    // Initial check
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', checkStockAndClick);
    } else {
        checkStockAndClick();
    }

    // Periodic check
    setInterval(checkStockAndClick,2000);
})();
