img_animation_secondaryCover = img_secondaryCover.animate([
	{ transform: "translateX(-50%) rotate(0deg)", },
	{ transform: "translateX(-50%) rotate(360deg)", }
], {
	duration: 20000,
	easing: "linear",
	iterations: Infinity,
});
img_animation_secondaryCover.cancel();
