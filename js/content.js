const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
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
	let beatCountInterval = null;
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

	const startBeatCount = (interval) => {
		if (beatCountInterval) {
			clearInterval(beatCountInterval);
		}
		let beatNumber = 1;
		let leadingNumber = 1;
		beatCountInterval = setInterval(() => {
			if (!video.paused && !video.ended) {
				speak(beatNumber === 1 ? leadingNumber : beatNumber);
				beatNumber++;
				if (beatNumber > 8) {
					beatNumber = 1;
					if (leadingNumber === 8) {
						leadingNumber = 1;
					} else {
						leadingNumber++;
					}
				}
			}
		}, interval);
	};

	const stopBeatCount = () => {
		clearInterval(beatCountInterval);
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

	chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
		switch (request.action) {
			case "cancelLoop": {
				cancelLoop();
				break;
			}
			case "getCurrentTime": {
				sendResponse(video.currentTime);
				break;
			}
			case "getPlaybackSpeed": {
				sendResponse(video.playbackRate);
				break;
			}
			case "setLoop": {
				setLoop(request.start, request.end);
				break;
			}
			case "setSpeed": {
				setPlaybackSpeed(request.speed);
				break;
			}
			case "startBeatCount": {
				startBeatCount(request.interval);
				break;
			}
			case "stopBeatCount": {
				stopBeatCount();
				break;
			}
			default:
				break;
		}
		return true;
	});
}

function speak(text) {
	const utterance = new SpeechSynthesisUtterance(text);
	speechSynthesis.speak(utterance);
}

const existingVideo = document.querySelector("video");
if (existingVideo) {
	initializeVideoController(existingVideo);
}
