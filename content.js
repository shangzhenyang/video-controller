const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList" && mutation.addedNodes.length) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeName === "VIDEO") {
					initializeVideoController(node);
				} else if (node.querySelector && node.querySelector("video")) {
					initializeVideoController(node.querySelector("video"));
				}
			});
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

function initializeVideoController(videoElement) {
	const video = videoElement;
	let loopStart = 0;
	let loopEnd = 0;
	let isLooping = false;

	const cancelLoop = () => {
		isLooping = false;
		console.log("Loop cancelled");
	};

	const setLoop = (start, end) => {
		loopStart = start;
		loopEnd = end;
		isLooping = true;
		console.log(`Loop set from ${loopStart} to ${loopEnd}`);
		video.currentTime = loopStart;
		video.play();
	};

	const setPlaybackSpeed = (speed) => {
		if (video) {
			video.playbackRate = speed;
		}
	};

	video.addEventListener("timeupdate", () => {
		if (
			isLooping &&
			(video.currentTime >= loopEnd || video.currentTime < loopStart)
		) {
			video.currentTime = loopStart;
			video.play();
		}
	});

	chrome.runtime.onMessage.addListener((request) => {
		if (request.action === "setSpeed") {
			setPlaybackSpeed(request.speed);
		} else if (request.action === "setLoop") {
			setLoop(request.start, request.end);
		} else if (request.action === "cancelLoop") {
			cancelLoop();
		}
	});
}

const existingVideo = document.querySelector("video");
if (existingVideo) {
	initializeVideoController(existingVideo);
}
