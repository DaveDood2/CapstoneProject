let slideIndex = 1;

// Next/previous controls
export function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
export function currentSlide(n) {
  showSlides((slideIndex = n));
}

export function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  // Safeguard against slides not being loaded
  if (slides.length < 1) return;
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

export function initializeSlides() {
  showSlides(1);
  document.querySelector(".prev").addEventListener("click", event => {
    plusSlides(-1);
  });
  document.querySelector(".next").addEventListener("click", event => {
    plusSlides(1);
  });
  // let dots = document.getElementsByClassName("dot");
  // let dotCount = 0;
  // console.log(dots);
  // for (const key in dots) {
  //   dotCount += 1;
  //   console.log(dots[key])
  //   dots[key].addEventListener("click", event => {
  //     showSlides(dotCount);
  //   });
  // }
}
