function sendQuery(message) {
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, message, () => {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError.message);
				}
			});
		},
	);
}

document.getElementById("speed-range").addEventListener("input", (event) => {
	const speed = event.target.value;
	document.getElementById("speed-input").value = speed;
	sendQuery({
		action: "setSpeed",
		speed: parseFloat(speed),
	});
});

document.getElementById("speed-input").addEventListener("input", (event) => {
	const speed = event.target.value;
	document.getElementById("speed-range").value = speed;
	sendQuery({
		action: "setSpeed",
		speed: parseFloat(speed),
	});
});

document.getElementById("resetSpeed").addEventListener("click", () => {
	const speed = 1.0;
	document.getElementById("speed-range").value = speed;
	document.getElementById("speed-input").value = speed;
	sendQuery({
		action: "setSpeed",
		speed: speed,
	});
});

document.getElementById("set-loop").addEventListener("click", () => {
	const startParts = document
		.getElementById("loop-start")
		.value.replaceAll("：", ":")
		.split(":");
	const endParts = document
		.getElementById("loop-end")
		.value.replaceAll("：", ":")
		.split(":");
	const startSeconds = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
	const endSeconds = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
	if (startSeconds >= endSeconds) {
		alert("Invalid loop range");
		return;
	}
	sendQuery({
		action: "setLoop",
		start: startSeconds,
		end: endSeconds,
	});
});

document.getElementById("cancel-loop").addEventListener("click", () => {
	document.getElementById("loop-start").value = "00:00";
	document.getElementById("loop-end").value = "00:00";
	sendQuery({
		action: "cancelLoop",
	});
});
