import './style.scss'
import sendImg from "./assets/send.svg";
import {formSubmitHandler} from "./script";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div id="chat_container"></div>
    <form>
        <textarea name="prompt" id="" cols="1" rows="1" placeholder="Ask Codex..."></textarea>
        <button type="submit"><img src="${sendImg}" alt="Send"></button>
    </form>
`;
export const form = document.querySelector("form") as HTMLFormElement;
export const chatContainer = document.getElementById("chat_container") as HTMLDivElement;

//! Form submitter
formSubmitHandler();
