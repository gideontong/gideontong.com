let slide = 1;

function show(n) {
    let i;
    let slides = document.getElementsByClassName("slides");
    if (n > slides.length) { slide = 1 }
    if (n < 1) { slide = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slide - 1].style.display = "block";
}

// Next/previous controls
function next(n) {
    show(slide += n);
}

function setSlideshow(item, count) {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    let container = document.getElementById('container');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let i = 0; i < count; i++) {
        let div = document.createElement('div');
        div.classList.add('slides', 'fade');

        let number = document.createElement('div');
        number.classList.add('numbertext');
        number.innerHTML = `${i + 1} / ${count}`;
        div.appendChild(number);

        let img = document.createElement('img');
        img.src = `album/${item}/${zeroPad(i + 1, 2)}.webp`;
        img.style = 'width: 100%';
        div.appendChild(img);

        container.appendChild(div);
    }

    let previous = document.createElement('a');
    previous.classList.add('prev');
    previous.onclick = () => { next(-1); };
    previous.innerHTML = '&#10094;';
    container.appendChild(previous);

    let next_ = document.createElement('a');
    next_.classList.add('next');
    next_.onclick = () => { next(1); };
    next_.innerHTML = '&#10095;';
    container.appendChild(next_);

    show(slide = 1);
}

async function run() {
    let response = await fetch('./counts.json');
    const counts = await response.json();

    response = await fetch('./albums.json');
    const albums = await response.json();
    const select = document.getElementById('selector');
    const entries = Object.entries(albums);
    for (let i = 0; i < entries.length; i++) {
        const key = entries[i][0];
        const value = entries[i][1];
        var element = document.createElement('option');
        element.value = key;
        element.innerHTML = value;
        select.appendChild(element);
    }

    const dropdown = document.getElementById("selector");
    dropdown.onchange = function () {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const selected = selectedOption.value;
        const count = counts[selected];
        setSlideshow(selected, count);
    };

    setSlideshow('0001', counts['0001']);
}

run();