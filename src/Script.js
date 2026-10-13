const form = document.getElementById("point-inp");
const rBoxes = form.querySelectorAll('input[name="r"]');

function checkR() {
    const anyChecked = [...rBoxes].some(box => box.checked);
    rBoxes[0].setCustomValidity(anyChecked ? "" : "Выберите хотя бы одно значение R");
}

rBoxes.forEach(box => box.addEventListener("change", checkR));
form.addEventListener("reset", () => setTimeout(checkR));
checkR();