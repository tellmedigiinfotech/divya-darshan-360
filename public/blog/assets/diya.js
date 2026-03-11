/**
 * Diya Component Injection
 * This script injects the Diya HTML structure into the page.
 * Version: 2.0 (Enhanced with Framer-style animations)
 */
(function () {
	const diyaTemplate = `
        <div class="diya__inner">
            <div class="diya__ambient"></div>
            
            <!-- Flame Container -->
            <div class="diya__flame-container">
                <div class="diya__aura"></div>
                <div class="diya__aura-secondary"></div>
                
                <div class="diya__flame-outer"></div>
                <div class="diya__flame-inner"></div>
                <div class="diya__flame-tip"></div>
                
                <div class="diya__wick"></div>
            </div>

            <!-- Oil Surface -->
            <div class="diya__oil">
                <div class="diya__oil-sheen"></div>
            </div>

            <!-- Diya Body -->
            <div class="diya__bowl-wrap">
                <div class="diya__bowl">
                    <div class="diya__bowl-shine"></div>
                    <div class="diya__bowl-highlight"></div>
                    <div class="diya__bowl-dots">
                        <div class="diya__bowl-dot"></div>
                        <div class="diya__bowl-dot"></div>
                        <div class="diya__bowl-dot"></div>
                        <div class="diya__bowl-dot"></div>
                        <div class="diya__bowl-dot"></div>
                    </div>
                </div>
                <div class="diya__spout"></div>
                <div class="diya__stem"></div>
                <div class="diya__plate"></div>
            </div>

            <div class="diya__reflection"></div>
        </div>
    `;

	const diyaHTML = `
        <div class="diya-wrap diya-wrap--left">
            <div class="diya diya--left">
                ${diyaTemplate}
            </div>
        </div>
        <div class="diya-wrap diya-wrap--right">
            <div class="diya diya--right">
                ${diyaTemplate}
            </div>
        </div>
    `;

	function injectDiya() {
		// Find the main element or body
		const main = document.querySelector('main') || document.body;
		main.insertAdjacentHTML('afterbegin', diyaHTML);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', injectDiya);
	} else {
		injectDiya();
	}
})();
