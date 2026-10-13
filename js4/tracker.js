
const missionInput = document.getElementById("missionInput");
const addButton = document.getElementById("addButton");
const missionList = document.getElementById("missionList");
const message = document.getElementById("message");

addButton.addEventListener("click", function () {

    const missionName = missionInput.value.trim();

    if (missionName === "") {
        message.textContent = "Please enter a mission!";
        return;
    }

    const li = document.createElement("li");

    li.textContent = missionName;

    li.addEventListener("click", function () {
        completeMission(li);
    });

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        li.remove();
    });

    li.appendChild(deleteButton);

    missionList.appendChild(li);

    missionInput.value = "";
    message.textContent = "";
});

function completeMission(mission) {
    mission.classList.toggle("completed");
}
