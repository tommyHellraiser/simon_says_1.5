const MAX_LEVEL = 10;
const level_switch = {
    0: "Press any Button to Start",
    1: "Level 1",
    2: "Level 2",
    3: "Level 3",
    4: "Level 4",
    5: "Level 5",
    6: "Level 6",
    7: "Level 7",
    8: "Level 8",
    9: "Level 9",
    10: "Level 10",
    11: "Congratulations, you won!!"
};
//let game_sequence = [3, 2, 3, 2, 1, 3, 3, 1, 3, 0, 1, 1, 2, 0, 0, 3, 2, 0, 0, 2];
let game_sequence = [];

//let sequence_counter = 0;
let current_level = 0;
let button= {
    green: "sounds/green-button.mp3",
    red: "sounds/red-button.mp3",
    yellow: "sounds/yellow-button.mp3",
    blue: "sounds/blue-button.mp3"
};
//let rick_roll = "sounds/rick_roll.mp3";
let rick_audio = document.getElementById("rick_roll");
let stoopid_audio = document.getElementById("stoopid_audio");

let game_started = false;
let button_colors = ["green-button", "red-button", "yellow-button", "blue-button"];

let player_sequence = [];
let player_sequence_index = 0;

let all_buttons = $(".button");

let window_width = $(window).width();

if (window_width > 768) {
    //  On bigger screens
    all_buttons.on("mousedown", function() {
        main_game_logic(this);
    });
} else {
    //  On phones
    all_buttons.on("touchstart", function() {
        setTimeout(function() {
            main_game_logic(this);
        }.bind(this),100);
    });
}

let next_level_timeout;

function main_game_logic(button) {
    let button_pressed = $(button).attr("id");
    
    console.log("Button pressed: " + button_pressed);
    
    if (!game_started) {
        clearTimeout(next_level_timeout);
        generate_random_sequence_until(MAX_LEVEL);
        rick_audio.pause();
        rick_audio.currentTime = 0;
        game_started = true;
        current_level++;
        all_buttons.removeClass("light-up-green").removeClass("light-up-red");
        set_header_text("Follow the sequence");
        set_text_from_level_counter(current_level);
        setTimeout(function() {
            light_up_button(game_sequence[current_level - 1]);
        }, 1000);
        return;
    }


    player_sequence.push(button_colors.indexOf(button_pressed));

    play_audio_from_button(button_pressed, true);

    button_animate_press(button_pressed);

    check_sequence();
}

function generate_random_sequence_until(limit) {
    game_sequence = [];
    for (let i = 0; i < limit; i++) {
        game_sequence.push((Math.floor(Math.random() * 4)));
    }
}

function play_audio_from_button(button) {
    let audio_file_path = "sounds/" + button + ".mp3";
    let audio = new Audio(audio_file_path);
    audio.play();
}

function button_animate_press(button_pressed) {
    let active_class = button_pressed + "-active";
    
    $("." + button_pressed).addClass(active_class);
    setTimeout(function() {
        $("." + button_pressed).removeClass(active_class);
    }, 100);
}

function check_sequence() {
    if (player_sequence[player_sequence_index] === game_sequence[player_sequence_index]) {
        if (player_sequence.length === current_level) {
            //  Next level
            setTimeout(function() {
                if (current_level === MAX_LEVEL) {
                    game_won();
                } else {
                    next_level();
                }
            }, 500);
        }
        player_sequence_index++;
    } else {
        //  Game lost
        game_lost();
    }
}

function game_won() {
    clearTimeout(next_level_timeout);
    rick_audio.play();
    set_header_text("Congrats, you won!!");
    all_buttons.addClass("light-up-green");
    reset_status();
}

function game_lost() {
    clearTimeout(next_level_timeout);
    all_buttons.addClass("light-up-red");
    stoopid_audio.play();
    set_header_text("You lost! :( Try again!");
    reset_status();
}

function reset_status() {
    clearTimeout(next_level_timeout);
    set_level_text("Press any Button to Continue");
    player_sequence = [];
    player_sequence_index = 0;
    game_started = false;
    current_level = 0;
}

function next_level() {
    player_sequence = [];
    player_sequence_index = 0;
    light_up_all_buttons("light-up-green");
    current_level++;
    set_text_from_level_counter(current_level);
    for (let i = 0; i < current_level; i++) {
        next_level_timeout = setTimeout(function() {
            light_up_button(game_sequence[i], false);
        }, 600 + (i * 600));
    }
}

function light_up_button(sequence_index, play_audio) {
    let button_to_light_up = button_colors[sequence_index];

    let light_up_class = "light-up";
    
    setTimeout(function() {
        //$("#" + button_to_light_up).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
        if (play_audio) {
            play_audio_from_button(button_to_light_up);
        }
        $("#" + button_to_light_up).addClass(light_up_class);
        setTimeout(function() {
            $("#" + button_to_light_up).removeClass(light_up_class);
        }, 500);
        
    }, 500);
}

function light_up_all_buttons(light_up_class) {
    all_buttons.addClass(light_up_class)
    setTimeout(function() {
        all_buttons.removeClass(light_up_class);
    }, 500);
}

function set_text_from_level_counter(level_counter) {
    $("#level-text").text(level_switch[level_counter]);
}

function set_header_text(text) {
    $("#header-text").text(text);
}

function set_level_text(text) {
    $("#level-text").text(text);
}
