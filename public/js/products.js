// Get the filter arrow classes
const UP = document.getElementsByClassName("up");
const DOWN = document.getElementsByClassName("down");
const FILTER_ARROW_CLASSES = document.getElementById("filter-arrow").classList;
const FILTER_ARROW = document.getElementById("filter-arrow")
const FILTERS_FORM = document.querySelector(".products-filter form");

const CHECK_MAN = document.getElementById("check_man");
const CHECK_WOMAN = document.getElementById("check_woman");
const CHECK_CHILD = document.getElementById("check_child");


function hide_filter_products() {
    for (var key in FILTER_ARROW_CLASSES) {
        if (FILTER_ARROW_CLASSES[key] == "up") {
            FILTER_ARROW_CLASSES.remove("up");
            FILTER_ARROW_CLASSES.add("down");
            FILTERS_FORM.classList.add("hidden");
        }
        else if (FILTER_ARROW_CLASSES[key] == "down") {
            FILTER_ARROW_CLASSES.remove("down");
            FILTER_ARROW_CLASSES.add("up");
            FILTERS_FORM.classList.remove("hidden");
        }
    }
}

function erase_filters() {
    CHECK_MAN.check = false;
    CHECK_WOMAN.check = false;
    CHECK_CHILD.check = false;
}

FILTER_ARROW.addEventListener("click", hide_filter_products);