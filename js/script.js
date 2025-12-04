document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Mobile Nav + Smooth Scroll ---
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        // Toggle menu (dùng class "open" cho đúng với CSS trước đó của bạn)
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });

        // Đóng menu khi click link (mobile)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992 && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                }
            });
        });
    }

    // Smooth scroll cho tất cả link nội trang
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const el = document.querySelector(href);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                }
            }
        });
    });

    // --- 2. Hero Slider (Slideshow) ---
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 giây

    if (slider && slides.length > 0 && prevButton && nextButton && dotsContainer) {
        // Tạo dots theo số slide (5 slide cũng auto chạy)
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('type', 'button');
            dot.setAttribute('data-index', index);
            dot.setAttribute('aria-label', 'Chuyển tới slide ' + (index + 1));
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function showSlide(index) {
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            slides.forEach((slide, i) => {
                if (i === currentSlide) {
                    slide.classList.add('active');
                    slide.setAttribute('aria-hidden', 'false');
                    if (dots[i]) dots[i].classList.add('active');
                } else {
                    slide.classList.remove('active');
                    slide.setAttribute('aria-hidden', 'true');
                    if (dots[i]) dots[i].classList.remove('active');
                }
            });

            // announcer cho screen reader (nếu bạn có thêm <div class="sr-announcer"> trong HTML)
            const announcer = document.querySelector('.sr-announcer');
            if (announcer) {
                const title =
                    slides[currentSlide].dataset.title ||
                    (slides[currentSlide].querySelector('.slide-caption h2') ||
                        slides[currentSlide].querySelector('.slide-caption h1'))?.innerText ||
                    'Slide ' + (currentSlide + 1);
                announcer.textContent = title;
            }
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevButton.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        let isPaused = false;

        function startInterval() {
            if (isPaused) return;
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            if (!isPaused) startInterval();
        }

        // Keyboard navigation & pause/play
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetInterval();
            }
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetInterval();
            }
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                isPaused = !isPaused;
                if (isPaused) {
                    clearInterval(slideInterval);
                } else {
                    startInterval();
                }
            }
        });

        // Khởi động slideshow
        showSlide(currentSlide);
        startInterval();
    }

    // --- 3. Gallery Modal ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalImg && modalClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                modalImg.src = this.getAttribute('data-full') || this.src;
                modalImg.alt = this.alt || '';
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            modalImg.src = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                modalImg.src = '';
            }
        });
    }

    // --- 4. Landmark Detail Modal ---
    const detailButtons = document.querySelectorAll('.view-detail');
    const landmarkModal = document.getElementById('landmark-modal');
    const landmarkModalClose = document.getElementById('landmark-modal-close');
    const landmarkModalImg = document.getElementById('landmark-modal-img');
    const modalTitle = document.getElementById('landmark-modal-title');
    const modalBody = document.getElementById('landmark-modal-body');

    if (landmarkModal && landmarkModalClose && landmarkModalImg && modalTitle && modalBody) {
        detailButtons.forEach(button => {
            button.addEventListener('click', function () {
                const card = this.closest('.card');
                if (!card) return;

                const fullDetails = card.querySelectorAll('.full');
                const summary = card.querySelector('.summary');
                const cardImg = card.querySelector('img');
                const titleEl = card.querySelector('h3');
                const mapEmbed = card.querySelector('.map-embed');

                // Xóa nội dung cũ
                modalBody.innerHTML = '';

                // Đặt hình ảnh
                if (cardImg) {
                    landmarkModalImg.src = cardImg.src;
                    landmarkModalImg.alt = cardImg.alt || (titleEl ? titleEl.textContent : '');
                }

                // Đặt tiêu đề
                modalTitle.textContent = titleEl ? titleEl.textContent : '';

                // Thêm tóm tắt (nếu có)
                if (summary) {
                    const summaryP = document.createElement('p');
                    summaryP.innerHTML = summary.innerHTML;
                    modalBody.appendChild(summaryP);
                }

                // Thêm nội dung chi tiết
                fullDetails.forEach(detail => {
                    const p = document.createElement('p');
                    p.innerHTML = detail.innerHTML;
                    modalBody.appendChild(p);
                });

                // Thêm bản đồ (nếu có)
                if (mapEmbed) {
                    const mapClone = mapEmbed.cloneNode(true);
                    modalBody.appendChild(mapClone);
                }

                // Hiển thị modal
                landmarkModal.classList.add('active');
                landmarkModal.setAttribute('aria-hidden', 'false');
            });
        });

        landmarkModalClose.addEventListener('click', () => {
            landmarkModal.classList.remove('active');
            landmarkModal.setAttribute('aria-hidden', 'true');
        });

        landmarkModal.addEventListener('click', (e) => {
            if (e.target === landmarkModal) {
                landmarkModal.classList.remove('active');
                landmarkModal.setAttribute('aria-hidden', 'true');
            }
        });
    }
});
