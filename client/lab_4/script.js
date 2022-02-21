let slidePosition = 0;
const slides = document.querySelectorAll('.carousel__item');
const totalSlides = slides.length;

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove('carousel__item--visible');
    slide.classList.add('carousel__item--hidden');
  }
  
  slides[slidePosition].classList.add('carousel__item--visible');
}
const next_button = document.querySelector('button#carousel__button--next');
next_button.addEventListener("click", () =>{
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else {
    slidePosition++;
  }
    
  updateSlidePosition();
});
const prev_button = document.querySelector('button#carousel__button--prev')
prev_button.addEventListener("click", () => {
  if (slidePosition === 0) {
    slidePosition = totalSlides - 1;
  } else {
    slidePosition--;
  }
    
  updateSlidePosition();
});

