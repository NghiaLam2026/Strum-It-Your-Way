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

        document.querySelector(".clear_notes_button").addEventListener('click', () => {
            this.clear_notes();
        });

        document.querySelector("#a_major_button").addEventListener('click', () => {
            this.play_chord("A Major");
        });

        document.querySelector("#a_minor_button").addEventListener('click', () => {
            this.play_chord("A Minor");
        });

        document.querySelector("#b_major_button").addEventListener('click', () => {
            this.play_chord("B Major")
        });

        document.querySelector("#b_minor_button").addEventListener('click', () => {
            this.play_chord("B Minor")
        });

        document.querySelector("#c_major_button").addEventListener('click', () => {
            this.play_chord("C Major")
        });

        document.querySelector("#c_minor_button").addEventListener('click', () => {
            this.play_chord("C Minor")
        });

        document.querySelector("#d_major_button").addEventListener('click', () => {
            this.play_chord("D Major")
        });

        document.querySelector("#d_minor_button").addEventListener('click', () => {
            this.play_chord("D Minor")
        });

        document.querySelector("#e_major_button").addEventListener('click', () => {
            this.play_chord("E Major")
        });

        document.querySelector("#e_minor_button").addEventListener('click', () => {
            this.play_chord("E Minor")
        });

        document.querySelector("#f_major_button").addEventListener('click', () => {
            this.play_chord("F Major")
        });

        document.querySelector("#f_minor_button").addEventListener('click', () => {
            this.play_chord("F Minor")
        });

        document.querySelector("#g_major_button").addEventListener('click', () => {
            this.play_chord("G Major")
        });

        document.querySelector("#g_minor_button").addEventListener('click', () => {
            this.play_chord("G Minor")
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
                    }, (number_of_strings - string) * 30 + index * 200); // Adjust the delay between notes on the same string if needed
                });
            } else if (!anyMarkedNotes) {
                // Play open string if no marked notes are present
                const fret = 0;
                const note = this.generate_note_name(guitar_tuning[string - 1], accidental);
    
                setTimeout(() => {
                    this.play_note_sound(note, string, fret);
                }, (number_of_strings - string) * 30);
            }
        }
    },
    clear_notes() {
        const marked_notes = document.querySelectorAll('.marked-note');
        marked_notes.forEach(note => {
            note.classList.remove('marked-note');
        });
    },
    play_chord(chord) {
        this.clear_notes(); // Clear existing marks

        if (chord === "A Major") {
            this.mark_fret(1, 0);
            this.mark_fret(2, 2);
            this.mark_fret(3, 2);
            this.mark_fret(4, 2);
            this.mark_fret(5, 0);
        }
        if (chord === "A Minor") {
            this.mark_fret(1, 0);
            this.mark_fret(2, 2);
            this.mark_fret(3, 2);
            this.mark_fret(4, 1);
            this.mark_fret(5, 0);
        }
        if (chord === "B Major") {
            this.mark_fret(1, 2);
            this.mark_fret(2, 4);
            this.mark_fret(3, 4);
            this.mark_fret(4, 4);
            this.mark_fret(5, 2);
        }
        if (chord === "B Minor") {
            this.mark_fret(1, 2);
            this.mark_fret(2, 4);
            this.mark_fret(3, 4);
            this.mark_fret(4, 3);
            this.mark_fret(5, 2);
        }
        if (chord === "C Major") {
            this.mark_fret(1, 3);
            this.mark_fret(2, 2);
            this.mark_fret(3, 0);
            this.mark_fret(4, 1);
            this.mark_fret(5, 0);
        }
        if (chord === "C Minor") {
            this.mark_fret(1, 3);
            this.mark_fret(2, 5);
            this.mark_fret(3, 5);
            this.mark_fret(4, 4);
            this.mark_fret(5, 3);
        }
        if (chord === "D Major") {;
            this.mark_fret(2, 0);
            this.mark_fret(3, 2);
            this.mark_fret(4, 3);
            this.mark_fret(5, 2);
        }
        if (chord === "D Minor") {;
            this.mark_fret(2, 0);
            this.mark_fret(3, 2);
            this.mark_fret(4, 3);
            this.mark_fret(5, 1);
        }
        if (chord === "E Major") {;
            this.mark_fret(0, 0);
            this.mark_fret(1, 2);
            this.mark_fret(2, 2);
            this.mark_fret(3, 1);
            this.mark_fret(4, 0);
            this.mark_fret(5, 0);
        }
        if (chord === "E Minor") {;
            this.mark_fret(0, 0);
            this.mark_fret(1, 2);
            this.mark_fret(2, 2);
            this.mark_fret(3, 0);
            this.mark_fret(4, 0);
            this.mark_fret(5, 0);
        }
        if (chord === "F Major") {;
            this.mark_fret(0, 1);
            this.mark_fret(1, 3);
            this.mark_fret(2, 3);
            this.mark_fret(3, 2);
            this.mark_fret(4, 1);
            this.mark_fret(5, 1);
        }
        if (chord === "F Minor") {;
            this.mark_fret(0, 1);
            this.mark_fret(1, 3);
            this.mark_fret(2, 3);
            this.mark_fret(3, 1);
            this.mark_fret(4, 1);
            this.mark_fret(5, 1);
        }
        if (chord === "G Major") {;
            this.mark_fret(0, 3);
            this.mark_fret(1, 2);
            this.mark_fret(2, 0);
            this.mark_fret(3, 0);
            this.mark_fret(4, 3);
            this.mark_fret(5, 3);
        }
        if (chord === "G Minor") {;
            this.mark_fret(0, 3);
            this.mark_fret(1, 5);
            this.mark_fret(2, 5);
            this.mark_fret(3, 3);
            this.mark_fret(4, 3);
            this.mark_fret(5, 3);
        }
    },
    mark_fret(string, fret) {
        const stringElement = document.querySelector(`.string:nth-child(${number_of_strings - string})`);
        const fretElement = stringElement.querySelector(`.note-fret:nth-child(${fret + 1})`);
        fretElement.classList.add('marked-note');
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
