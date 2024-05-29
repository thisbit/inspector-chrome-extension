let buttonElement = document.createElement("button");
buttonElement.classList.add("inspect-toggle");
buttonElement.innerText = "Inspect HTML";
document.body.appendChild(buttonElement);

let timeoutId;
let labelElement = null;
let targetElement = null;

function handleClick() {
    buttonElement.classList.toggle("active");
    document.body.classList.toggle("toggled");

    if (!labelElement) {
        labelElement = document.createElement("span");
        labelElement.classList.add("element-label");
        document.body.appendChild(labelElement);
    }

    if (document.body.classList.contains("toggled")) {
        document.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("scroll", updateLabelPosition);
    } else {
        document.removeEventListener("mouseover", handleMouseOver);
        window.removeEventListener("scroll", updateLabelPosition);
    }
}

function handleMouseOver(e) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        targetElement = e.target;

        if (targetElement.contains(labelElement) || targetElement.classList.contains("element-label") || targetElement.classList.contains("inspect-toggle") || !document.body.classList.contains("toggled")) {
            return;
        }

        updateLabelPosition();

        let con = targetElement.tagName;
        let suf = targetElement.className ? "." + targetElement.className.split(" ").join(".") : "";
        labelElement.textContent = con + suf;

        targetElement.appendChild(labelElement);
        targetElement.onmouseleave = handleMouseLeave;
    }, 50);
}

function handleMouseLeave() {
    document.body.appendChild(labelElement);
    targetElement = null;
}

function updateLabelPosition() {
    if (!targetElement) return;
    let rect = targetElement.getBoundingClientRect();
    labelElement.style.position = 'fixed';
    labelElement.style.top = `calc(${rect.top}px - 1.25em)`;
    labelElement.style.left = `${rect.left}px`;
}

buttonElement.addEventListener("click", handleClick, true);
