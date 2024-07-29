const fretboard = document.querySelector('.fretboard');
const number_of_frets = 13;
const number_of_strings = 6;

const single_fret_mark_positions = [3, 5, 7, 9];
const double_fret_mark_positions = [12];

const notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const accidental = "sharp";
const guitar_tuning = [4, 11, 7, 2, 9, 4]; // E2, A2, D3, G3, B3, E4

let selecting_notes = false;
const audioElements = {};

const app = {
    init() {
        this.preloadAudio();
        this.setup_fretboard();
        this.setupEventListeners();
    },
    preloadAudio() {
        for (let string = 1; string <= number_of_strings; string++) {
            for (let fret = 0; fret <= number_of_frets; fret++) {
                const audioKey = `string${string}_fret${fret}`;
                const audio = new Audio(`Master_sounds/${audioKey}.mp3`);
                audioElements[audioKey] = audio;
            }
        }
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
        document.querySelector(".select_notes_button").addEventListener('click', () => {
            selecting_notes = !selecting_notes;
            document.querySelector(".select_notes_button").textContent = selecting_notes ? "Stop Selecting Notes" : "Select Notes";
        });

        document.querySelector(".strum_button").addEventListener('click', () => {
            this.strum_guitar();
        });

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

                if (selecting_notes) {
                    this.mark_note_on_fret(event.target);
                } else {
                    this.play_note_sound(noteName, stringNumber, fretNumber);
                }
            }
        });
    },
    mark_note_on_fret(note_fret_element) {
        note_fret_element.classList.toggle("marked-note");
    },
    play_note_sound(note, string, fret) {
        const audioKey = `string${string}_fret${fret}`;
        const audio = audioElements[audioKey];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    },
    strum_guitar() {
        // Check if there are any marked notes
        const anyMarkedNotes = document.querySelectorAll('.marked-note').length > 0;
    
        for (let string = number_of_strings; string >= 1; string--) {
            const marked_notes = document.querySelectorAll(`.string:nth-child(${string}) .marked-note`);
            
            if (anyMarkedNotes && marked_notes.length > 0) {
                // Play all marked notes on the string
                marked_notes.forEach((marked_note, index) => {
                    const fret = marked_note.getAttribute('data-fret');
                    const note = marked_note.getAttribute('data-note');
    
                    setTimeout(() => {
                        this.play_note_sound(note, string, fret);
                    }, (number_of_strings - string) * 50 + index * 200); // Adjust the delay between notes on the same string if needed
                });
            } else if (!anyMarkedNotes) {
                // Play open string if no marked notes are present
                const fret = 0;
                const note = this.generate_note_name(guitar_tuning[string - 1], accidental);
    
                setTimeout(() => {
                    this.play_note_sound(note, string, fret);
                }, (number_of_strings - string) * 50);
            }
        }
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
