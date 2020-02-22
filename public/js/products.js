const UP = document.getElementsByClassName("up");
const DOWN = document.getElementsByClassName("down");
const FILTER_ARROW_CLASSES = document.getElementById("filter-arrow").classList;

function hide_filter_products() {
    for (var key in FILTER_ARROW_CLASSES) {
        if (FILTER_ARROW_CLASSES[key] == "up") {
            FILTER_ARROW_CLASSES.remove("up");
            FILTER_ARROW_CLASSES.add("down");
        }
        else if (FILTER_ARROW_CLASSES[key] == "down") {
            FILTER_ARROW_CLASSES.remove("down");
            FILTER_ARROW_CLASSES.add("up");
        }
    }
}

FILTER_ARROW.addEventListener("click", hide_filter_products);