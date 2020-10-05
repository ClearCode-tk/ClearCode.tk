const socket = io.connect();

// Navbar //

const mobileLinks = document.querySelector("#mobile-links");
const navBurger = document.querySelector(".nav-burger");

navBurger?.addEventListener(
	"click",
	() => {
		mobileLinks.style.setProperty(
			"display",
			mobileLinks.style.getPropertyValue("display")
				? ""
				: "block"
		);
	}, {
		passive: true
	}
);


// Signup Page //

function signupPage() {
  const signupForm = document.querySelector("#signup-form");

  // TODO
}

// Signin Page //

function signinPage() {
  // TODO
}

// Code association //

if (location.pathname == "/signup") signupPage();
if (location.pathname == "/signin") signinPage();