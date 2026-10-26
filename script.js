const video = document.querySelector("#intro-video");
const invitation = document.querySelector("#invitation");
const question = document.querySelector("#invitation-question");
const answerButtons = document.querySelector("#answer-buttons");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const answerResponse = document.querySelector("#answer-response");
const reactionDialog = document.querySelector("#reaction-dialog");
const reactionGif = document.querySelector("#reaction-gif");
const reactionTitle = document.querySelector("#reaction-title");
const reactionStatus = document.querySelector("#reaction-status");
const closeReaction = document.querySelector("#close-reaction");
const formspreeEndpoint = "https://formspree.io/f/mwlpowwb";

if (!(video instanceof HTMLVideoElement)) {
  throw new Error('Could not find the video element with id "intro-video".');
}

if (!(invitation instanceof HTMLElement) || !(question instanceof HTMLElement)) {
  throw new Error("Could not find the invitation elements.");
}

if (
  !(answerButtons instanceof HTMLElement) ||
  !(yesButton instanceof HTMLButtonElement) ||
  !(noButton instanceof HTMLButtonElement) ||
  !(answerResponse instanceof HTMLElement) ||
  !(reactionDialog instanceof HTMLDialogElement) ||
  !(reactionGif instanceof HTMLImageElement) ||
  !(reactionTitle instanceof HTMLElement) ||
  !(reactionStatus instanceof HTMLElement) ||
  !(closeReaction instanceof HTMLButtonElement)
) {
  throw new Error("Could not find the invitation answer controls.");
}

video.addEventListener("ended", () => {
  invitation.hidden = false;
  question.focus();
});

function showReaction(response) {
  const isYes = response === "Yes";
  reactionGif.src = isYes
    ? "https://media1.tenor.com/m/k2v7leuqezQAAAAC/cat-dancing-celebrate.gif"
    : "https://media1.tenor.com/m/1MS-V6yjG-8AAAAC/cat-phone-sad-cry-lay-kitty.gif";
  reactionGif.alt = isYes
    ? "A cat dancing to celebrate the yes"
    : "A sad cat crying";
  reactionTitle.textContent = isYes
    ? "Yay! You said yes! ♥"
    : "Aww, I understand. ♡";
  reactionStatus.textContent = "Sending your answer...";
  reactionDialog.showModal();
}

async function submitAnswer(response, thankYouMessage) {
  answerResponse.hidden = false;
  answerResponse.textContent = "Sending your answer...";
  yesButton.disabled = true;
  noButton.disabled = true;
  showReaction(response);

  try {
    const result = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response,
        question: question.textContent.trim(),
        _subject: "Date invitation response",
      }),
    });

    if (!result.ok) {
      throw new Error(`Form submission failed with status ${result.status}.`);
    }

    answerButtons.hidden = true;
    answerResponse.textContent = thankYouMessage;
    reactionStatus.textContent = "Your answer was sent. Thank you!";
  } catch (error) {
    console.error("Could not send the invitation response:", error);
    answerResponse.textContent =
      "I couldn't send your answer just now. Please check your connection and try again.";
    reactionStatus.textContent =
      "I couldn't send your answer just now. Please close this popup and try again.";
    yesButton.disabled = false;
    noButton.disabled = false;
  }
}

closeReaction.addEventListener("click", () => {
  reactionDialog.close();
});

yesButton.addEventListener("click", () => {
  submitAnswer("Yes", "Yay! I can't wait to spend those days with you. ♥");
});

noButton.addEventListener("click", () => {
  submitAnswer("No", "Thank you for being honest with me. I appreciate you. ♡");
});
