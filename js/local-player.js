function setSpeed(speed) {
	document.getElementById("video").playbackRate = speed;
}

document.getElementById("file-input").addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) {
		alert("No file selected.");
		return;
	}
	const url = URL.createObjectURL(file);
	document.getElementById("video").src = url;
	document.getElementById("select-container").hidden = true;
	document.getElementById("video-container").hidden = false;
	document.getElementById("video").play();
});

document.getElementById("reset-speed").addEventListener("click", () => {
	const speed = 1.0;
	document.getElementById("speed-input").value = speed;
	document.getElementById("speed-range").value = speed;
	setSpeed(speed);
});

document.getElementById("select-video").addEventListener("click", () => {
	document.getElementById("file-input").click();
});

document.getElementById("speed-input").addEventListener("input", (event) => {
	const speed = event.target.value;
	document.getElementById("speed-range").value = speed;
	setSpeed(parseFloat(speed));
});

document.getElementById("speed-range").addEventListener("input", (event) => {
	const speed = event.target.value;
	document.getElementById("speed-input").value = speed;
	setSpeed(parseFloat(speed));
});
