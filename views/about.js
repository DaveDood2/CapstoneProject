import MMIRL1 from "/assets/img/MMIRL1.jpg";
import MMIRL2 from "/assets/img/MMIRL2.jpg";
import MMIRL3 from "/assets/img/MMIRL7.jpg";
import MMIRL4 from "/assets/img/MMIRL4.jpg";
import MMIRL5 from "/assets/img/MMIRL5.jpg";
import MMIRL6 from "/assets/img/MMIRL6.jpg";
import MMIRL7 from "/assets/img/MMIRL8.jpg";
import MMIRL8 from "/assets/img/MLMonsterMaker.png";

import html from "html-literal";
export default () => html`
  <p class="roboto-mono">
    Monster Maker is based on the cooperative art game: <b>Exquisite Corpse</b>.
    The game involves a canvas split up into 3 parts, with 3 artists taking
    turns to draw the head, torso, and legs of a creature. <br /><br />The
    catch: most of the drawing is obscured so you cannot see what the previous
    player drew (except for 2 lines where you are meant to continue the
    drawing). <br /><br /><a
      href="https://www.artsy.net/article/artsy-editorial-explaining-exquisite-corpse-surrealist-drawing-game-die"
      >Click here for an in-depth article about the game!</a
    >
  </p>

  <h2>Here's some examples of Exquisite Corpse I played in real life!</h2>

  <div class="slideshow-container">
    <!-- Slideshow code lifted from: -->
    <!-- https://www.w3schools.com/howto/howto_js_slideshow.asp -->
    <!-- Full-width images with number and caption text -->
    <div class="mySlides fade">
      <div class="numbertext">1 / 8</div>
      <img src=${MMIRL1} style="width:100%" />
      <div class="text">
        I drew the torso on this one. I love the tiny head juxtaposed with the
        huge body and legs.
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">2 / 8</div>
      <img src=${MMIRL2} style="width:100%" />
      <div class="text">
        I drew legs. The "Do Not Feed!" sign at the bottom gives new context to
        the dog's expression. They're kinda cute, though, surely it's fine to
        break the rules just this once?
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">3 / 8</div>
      <img src=${MMIRL3} style="width:100%" />
      <div class="text">I drew head. Slug butt the magnificent!</div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">4 / 8</div>
      <img src=${MMIRL4} style="width:100%" />
      <div class="text">
        I drew head. This creature is somehow overweight and anorexic at the
        same time.
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">5 / 8</div>
      <img src=${MMIRL5} style="width:100%" />
      <div class="text">
        I drew torso. It's fun to draw things other than arms for the torso.
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">6 / 8</div>
      <img src=${MMIRL6} style="width:100%" />
      <div class="text">
        I drew torso, the head and legs were drawn by the same kid. This one is
        cute, makes me think of a mother and child.
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">7 / 8</div>
      <img src=${MMIRL7} style="width:100%" />
      <div class="text">
        I drew legs. Each morning I like to start my day with a delicious The
        Creature (tm) smoothie.
      </div>
    </div>

    <div class="mySlides fade">
      <div class="numbertext">8 / 8</div>
      <img src=${MMIRL8} style="width:100%" />
      <div class="text">
        Monster Maker played with some artist friends in the (now defunct) pixel
        art game: Manyland. From left to right, I drew the head, legs, and
        torso.
      </div>
    </div>

    <!-- Next and previous buttons -->
    <a class="prev">&#10094;</a>
    <a class="next">&#10095;</a>
  </div>
  <br />

  <!-- The dots/circles -->
  <div style="text-align:center">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
`;
