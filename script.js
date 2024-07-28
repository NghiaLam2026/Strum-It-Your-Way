const fretboard = document.querySelector('.fretboard');
const number_of_frets = 13;
const number_of_strings = 6;

const single_fret_mark_positions = [3, 5, 7, 9];
const double_fret_mark_positions = [12];

const notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const accidental = "sharp";
const guitar_tuning = [4, 11, 7, 2, 9, 4]; // E2, A2, D3, G3, B3, E4

const app = {
    init() {
        this.setup_fretboard();
        this.setupEventListeners();
    },
    setup_fretboard() {
        for (let i = 0; i < number_of_strings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);
            // Create Frets
            for (let fret = 0; fret <= number_of_frets; fret++) {
                let note_fret = tools.createElement('div');
                note_fret.classList.add("note-fret");
                string.appendChild(note_fret);

                let note_name = this.generate_note_name((fret + guitar_tuning[i]), accidental);
                note_fret.setAttribute('data-note', note_name);
                note_fret.setAttribute('data-string', i + 1); // Strings are 1-indexed for clarity
                note_fret.setAttribute('data-fret', fret);
                // Add single fret mark
                if (i === 0 && single_fret_mark_positions.indexOf(fret) !== -1) {
                    note_fret.classList.add("single-fretmark");
                }

                if (i === 0 && double_fret_mark_positions.indexOf(fret) !== -1) {
                    let double_fret_mark = tools.createElement('div');
                    double_fret_mark.classList.add('double-fretmark');
                    note_fret.appendChild(double_fret_mark);
                }
            }
        }
    },
    generate_note_name(note_index, accidental) {
        note_index = note_index % 12;
        let note_name;
        if (accidental === "sharp") {
            note_name = notes_sharp[note_index];
        } else if (accidental === "flat") {
            note_name = notes_flat[note_index];
        }
        return note_name;
    },
    setupEventListeners() {
        fretboard.addEventListener('mouseover', (event) => {
            if (event.target.classList.contains("note-fret")) {
                event.target.style.setProperty("--note_dot_opacity", 1);
            }
        });
        fretboard.addEventListener('mouseout', (event) => {
            if (event.target.classList.contains("note-fret")) {
                event.target.style.setProperty("--note_dot_opacity", 0);
            }
        });
        fretboard.addEventListener('click', (event) => {
            if (event.target.classList.contains("note-fret")) {
                const noteName = event.target.getAttribute('data-note');
                const stringNumber = event.target.getAttribute('data-string');
                const fretNumber = event.target.getAttribute('data-fret');
                this.playNoteSound(noteName, stringNumber, fretNumber);
            }
        });
    },
    playNoteSound(note, string, fret) {
        // Adjust the file path based on your directory structure
        const audio1 = new Audio(`string1_sounds/string${string}_fret${fret}.mp3`);
        const audio2 = new Audio(`string2_sounds/string${string}_fret${fret}.mp3`);
        const audio3 = new Audio(`string3_sounds/string${string}_fret${fret}.mp3`);
        const audio4 = new Audio(`string4_sounds/string${string}_fret${fret}.mp3`);
        const audio5 = new Audio(`string5_sounds/string${string}_fret${fret}.mp3`);
        const audio6 = new Audio(`string6_sounds/string${string}_fret${fret}.mp3`);
        audio1.play();
        audio2.play();
        audio3.play();
        audio4.play();
        audio5.play();
        audio6.play();
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    app.init();
});
