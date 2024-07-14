async function getCurrentTime() {
	const currentTime = await sendQuery({
		action: "getCurrentTime",
	});
	const minutes = Math.floor(currentTime / 60);
	const seconds = Math.floor(currentTime % 60);
	return (
		String(minutes).padStart(2, "0") +
		":" +
		String(seconds).padStart(2, "0")
	);
}

async function getPlaybackSpeed() {
	const speed = await sendQuery({
		action: "getPlaybackSpeed",
	});
	document.getElementById("speed-range").value = speed;
	document.getElementById("speed-input").value = speed;
}

function sendQuery(message) {
	return new Promise((resolve) => {
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			(tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
					if (chrome.runtime.lastError) {
						const errorMessage = chrome.runtime.lastError.message;
						console.log(errorMessage);
					} else {
						resolve(response);
					}
				});
			},
		);
	});
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

document.getElementById("reset-speed").addEventListener("click", () => {
	const speed = 1.0;
	document.getElementById("speed-range").value = speed;
	document.getElementById("speed-input").value = speed;
	sendQuery({
		action: "setSpeed",
		speed: speed,
	});
});

document.getElementById("start-current").addEventListener("click", () => {
	getCurrentTime()
		.then((currentTime) => {
			console.log(currentTime);
			document.getElementById("loop-start").value = currentTime;
		})
		.catch(console.error);
});

document.getElementById("end-current").addEventListener("click", () => {
	getCurrentTime()
		.then((currentTime) => {
			console.log(currentTime);
			document.getElementById("loop-end").value = currentTime;
		})
		.catch(console.error);
});

document.getElementById("beat-range").addEventListener("input", (event) => {
	document.getElementById("beat-input").value = event.target.value;
});

document.getElementById("beat-input").addEventListener("input", (event) => {
	document.getElementById("beat-range").value = event.target.value;
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

document.getElementById("start-beat-count").addEventListener("click", () => {
	sendQuery({
		action: "startBeatCount",
		interval: parseInt(document.getElementById("beat-input").value),
	});
});

document.getElementById("stop-beat-count").addEventListener("click", () => {
	sendQuery({
		action: "stopBeatCount",
	});
});

document.addEventListener("DOMContentLoaded", () => {
	void getPlaybackSpeed();
});
