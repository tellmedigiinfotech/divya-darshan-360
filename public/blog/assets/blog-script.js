function carouselNav(btn, dir) {
	const carousel = btn.closest('.carousel');
	const slides = carousel.querySelectorAll('.carousel__slide');
	const dots = carousel.querySelectorAll('.carousel__dot');
	const counter = carousel.querySelector('.carousel__current');
	const total = parseInt(carousel.dataset.total);
	let current = 0;
	slides.forEach((s, i) => { if (s.classList.contains('carousel__slide--active')) current = i; });
	slides[current].classList.remove('carousel__slide--active');
	if (dots[current]) dots[current].classList.remove('carousel__dot--active');
	current = (current + dir + total) % total;
	slides[current].classList.add('carousel__slide--active');
	if (dots[current]) dots[current].classList.add('carousel__dot--active');
	if (counter) counter.textContent = current + 1;
}
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.carousel__dot').forEach(dot => {
		dot.addEventListener('click', function () {
			const carousel = this.closest('.carousel');
			const slides = carousel.querySelectorAll('.carousel__slide');
			const dots = carousel.querySelectorAll('.carousel__dot');
			const counter = carousel.querySelector('.carousel__current');
			const idx = parseInt(this.dataset.index);
			slides.forEach(s => s.classList.remove('carousel__slide--active'));
			dots.forEach(d => d.classList.remove('carousel__dot--active'));
			slides[idx].classList.add('carousel__slide--active');
			this.classList.add('carousel__dot--active');
			if (counter) counter.textContent = idx + 1;
		});
	});
	// Auto-advance carousel every 5 seconds
	document.querySelectorAll('.carousel[data-total]').forEach(carousel => {
		setInterval(() => {
			const nextBtn = carousel.querySelector('.carousel__btn--next');
			if (nextBtn) nextBtn.click();
		}, 5000);
	});
});
