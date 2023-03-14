'use strict';

///////////////////////////////////////

//Selectors
const header = document.querySelector('header');
const navigation = document.querySelector('.nav__links');
const learnMore = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//Tab element selectotr
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

//Navigation selector
const nav = document.querySelector('.nav');

/* Reveal Section */

const allSections = document.querySelectorAll('.section');

//Somth Scrolling

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scrolling
learnMore.addEventListener('click', e => {
  const s1Coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});

navigation.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/*Tab Content*/

//Event Handler

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //remove Classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Active Tab
  clicked.classList.add('operations__tab--active');

  //Active content area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Navigator Animation

//function
const handlerFunction = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handlerFunction.bind(0.5));
nav.addEventListener('mouseout', handlerFunction.bind(1));

//Sticky nav
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserber = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserber.observe(header);

/* Reveal Section */

//Remove Class
const sectionHandler = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

//API
const sectionObserver = new IntersectionObserver(sectionHandler, {
  root: null,
  //When Section will visible
  threshold: 0.15,
});

//Add Class
allSections.forEach(section => {
  sectionObserver.observe(section);
});

//LAZY Loading

const loadImg = document.querySelectorAll('img[data-src]');

const lazyLoadHandler = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observe.unobserve(entry.target);
};

const imgLoadingObserve = new IntersectionObserver(lazyLoadHandler, {
  root: null,
  threshold: 0,
});

loadImg.forEach(img => {
  imgLoadingObserve.observe(img);
});

//Slider

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    ?.classList.add('dots__dot--active');
};
activeDot(0);

//Next Slide

let curSlide = 0;
const maxSlide = slides.length;
const goToSilde = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSilde(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSilde(curSlide);
  activeDot(curSlide);
};
btnRight.addEventListener('click', nextSlide);

//Previous Slide

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else curSlide--;
  goToSilde(curSlide);
  activeDot(curSlide);
};
btnLeft.addEventListener('click', prevSlide);

//Keyboad Event

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
  activeDot();
});

//Dots
const dotContainer = document.querySelector('.dots');

const creatDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide ="${i}"></button>`
    );
  });
};
creatDots();

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSilde(slide);
    activeDot(slide);
  }
});
