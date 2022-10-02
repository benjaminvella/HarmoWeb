let isFocusModeOn = false;

window.addEventListener('load', function () {
    exo1();
    exo2();
    revertExo2();
    exo3();
    exo4();
});

function exo1() {
    console.log("Hello World");
}

function exo2() {
    // Get all descendants of elements with solved class that are not h2.
    const solvedItemsToHide = document.querySelectorAll(".solved :not(h2)");
    // Stop displaying them.
    for (let item of solvedItemsToHide) {
        item.style.display = "none";
    }

    // Get all section that are not solved.
    const remainingExercisesToHide = document.querySelectorAll("section:not(.solved)");
    // Hide them all, except for the first one (start counting at 1 instead of 0).
    for (let i=1 ; i<remainingExercisesToHide.length ; i++) {
        remainingExercisesToHide[i].style.display = "none";
    }

    // Note: we could have gotten all elements in one array by using something like [...document.querySelectorAll("section:not(.solved)"), ...document.querySelectorAll(".solved :not(h2)")].
    // document.querySelectorAll("section:not(.solved), .solved :not(h2)") would have also worked, but it would have been harder to remove from that list the first not solved section.
}

function revertExo2() {
    // Get all descendants of elements with solved class that are not h2.
    const solvedItemsToDisplay = document.querySelectorAll(".solved :not(h2)");
    // Stop hiding them.
    for (let item of solvedItemsToDisplay) {
        item.style.display = "unset";
    }

    // Get all section that are not solved.
    const remainingExercisesToHide = document.querySelectorAll("section:not(.solved)");
    // Stop Hiding them all, except for the first one (start counting at 1 instead of 0).
    for (let i=1 ; i<remainingExercisesToHide.length ; i++) {
        remainingExercisesToHide[i].style.display = "unset";
    }
}

function exo3() {
    document.querySelector("button").addEventListener('click', function () {
        isFocusModeOn = !isFocusModeOn;
        setFocus();
        // Below is an addition from Exercise 4.
        window.localStorage.setItem("focusMode", isFocusModeOn);
    });
}

function setFocus() {
    const button = document.querySelector("button");
    if (isFocusModeOn) {
        button.innerText = "Stop focus";
        exo2();
    } else {
        button.innerText = "Start focus";
        revertExo2();
    }
}

function exo4() {
    isFocusModeOn = window.localStorage.getItem("focusMode") === "true";
    setFocus();
}