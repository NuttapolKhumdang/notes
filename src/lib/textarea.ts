export function autoTextareaSize(obj: HTMLTextAreaElement, fitbox: boolean = true) {
    if (fitbox) obj.style.height = obj.scrollHeight / 2 + "px";
    else obj.style.height = obj.scrollHeight + "px";
    obj.style.overflowY = "hidden";

    obj.addEventListener("input", function () {
        obj.style.height = "auto";
        obj.style.height = obj.scrollHeight + "px";
    });
}