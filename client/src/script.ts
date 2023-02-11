import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import {chatContainer, form} from "./main";

const synth = window.speechSynthesis;

let loadInterval: any;

//! Create (...) for each question
const loader = (element: HTMLElement) => {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";
        if (element.textContent === "....") {
            element.textContent = "";
        }
    }, 300);
};

//! Make typing style to show the message comes from the server word by word
const typeText = (element: HTMLElement, text: string) => {
    let index: number = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
};

//! Generate Unique ID
const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
};

//! Make a stripe style on Question and Answer section
const chatStripe = (isAi: boolean, value?: unknown, uniqueId?: string) => {
    return (`
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
    `);
};

export const handleSubmit = async (e: SubmitEvent | KeyboardEvent) => {
    e.preventDefault();
    const data: FormData = new FormData(form);

    // user's chatStripe
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"), generateUniqueId());
    form.reset();

    // bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId) as HTMLDivElement;
    loader(messageDiv);

    //! Fetch data from server
    // const response = await fetch("http://localhost:5000", {
    const response = await fetch("https://chatgpt-28cb.onrender.com", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            prompt: data.get("prompt")
        })
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";
    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        typeText(messageDiv, parsedData);

        //! Speaking feature
        if (synth.speaking) {
            synth.cancel();
        }
        const utterThis = new SpeechSynthesisUtterance(parsedData);
        utterThis.addEventListener('error', () => {
            console.error('SpeechSynthesisUtterance error');
        });
        synth.speak(utterThis);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong!"
        alert(err);
    }
};

export const formSubmitHandler = () => {
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    });
}

