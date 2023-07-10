const MAX_LEVEL = 10;
// let game_status = "off";
// const status_switch = {
//     playing: "playing",
//     off: "off",
//     game_over: "game_over",
//     game_won: "game_won"
// };
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
//let sequence = [];
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

function main_game_logic(button) {
    let button_pressed = $(button).attr("id");
    
    console.log("Button pressed: " + button_pressed);
    
    if (!game_started) {
        generate_random_sequence_until(MAX_LEVEL);
        rick_audio.pause();
        rick_audio.currentTime = 0;
        game_started = true;
        current_level++;
        all_buttons.removeClass("light-up-green").removeClass("light-up-red");
        set_header_text("Follow the sequence");
        set_text_from_level_counter(current_level);
        //button_animate_press(button_pressed);
        setTimeout(function() {
            light_up_button(game_sequence[current_level - 1]);
        }, 1000);
        return;
    }

    play_audio_from_button(button_pressed);
    // if (window_width > 600) {
    //     play_audio_from_button(button_pressed);
    // }

    player_sequence.push(button_colors.indexOf(button_pressed));

    //  Play sound?
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
    rick_audio.play();
    set_header_text("Congrats, you won!!");
    all_buttons.addClass("light-up-green");
    reset_status();
}

function game_lost() {
    all_buttons.addClass("light-up-red");
    stoopid_audio.play();
    set_header_text("You lost! :( Try again!");
    reset_status();
}

function reset_status() {
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
        setTimeout(function() {
            light_up_button(game_sequence[i]);
        }, 600 + (i * 600));
    }
    
    // setTimeout(function() {
    //     current_level++;
    //     set_text_from_level_counter(current_level);
    //     light_up_button(game_sequence[current_level - 1]);    
    // },300);
}

function light_up_button(sequence_index) {
    let button_to_light_up = button_colors[sequence_index];

    let light_up_class = "light-up";
    
    setTimeout(function() {
        //$("#" + button_to_light_up).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
        play_audio_from_button(button_to_light_up);
        // if (window_width > 600) {
        //     play_audio_from_button(button_to_light_up);
        // }
        $("#" + button_to_light_up).addClass(light_up_class);
        setTimeout(function() {
            $("#" + button_to_light_up).removeClass(light_up_class);
        }, 500);
        
    }, 500);
    
    // $("#" + button_to_light_up).addClass(light_up_class);
    // setTimeout(function() {
    //    $("#" + button_to_light_up).removeClass(light_up_class); 
    // }, 1200);
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

//  Remove everything down here and refactor differently

// $(".green-button").on("touchstart", function() {
//     $(this).addClass("green-button-active");
//     setTimeout(function (){
//         game_logic(button.green, this);
//     }.bind(this), 100);
// }).on("mouseup", function() {
//     $(this).removeClass("green-button-active");
// }).on("touchend", function() {
//     $(this).removeClass("green-button-active green-button-hover");
// });
//
// $(".red-button").on("touchstart", function() {
//     $(this).addClass("red-button-active");
//     setTimeout(function (){
//         game_logic(button.red, this);
//     }.bind(this), 100);
// }).on("mouseup", function() {
//     $(this).removeClass("red-button-active");
// }).on("touchend", function() {
//     $(this).removeClass("red-button-active red-button-hover");
// });
//
// $(".yellow-button").on("touchstart", function() {
//     $(this).addClass("yellow-button-active");
//     setTimeout(function (){
//         game_logic(button.yellow, this);
//     }.bind(this), 100);
// }).on("mouseup", function() {
//     $(this).removeClass("yellow-button-active");
// }).on("touchend", function() {
//     $(this).removeClass("yellow-button-active yellow-button-hover");
// });
//
// $(".blue-button").on("touchstart", function() {
//     $(this).addClass("button-pressed");
//     setTimeout(function (){
//         game_logic(button.blue, this);
//     }.bind(this), 100);
// }).on("mouseup", function() {
//     $(this).removeClass("blue-button-active");
// }).on("touchend", function() {
//     $(this).removeClass("blue-button-active blue-button-hover");
// });
//
// if ($(window).width() > 768) {
//     $(".green-button").on("mousedown", function() {
//         $(this).addClass("green-button-active");
//         setTimeout(function (){
//             game_logic(button.green, this);
//         }.bind(this), 100);
//     }).on("mouseover", function() {
//         $(this).addClass("green-button-hover");
//     }).on("mouseout", function() {
//         $(this).removeClass("green-button-hover");
//     });
//
//     $(".red-button").on("mousedown", function() {
//         $(this).addClass("red-button-active");
//         setTimeout(function (){
//             game_logic(button.red, this);
//         }.bind(this), 100);
//     }).on("mouseover", function() {
//         $(this).addClass("red-button-hover");
//     }).on("mouseout", function() {
//         $(this).removeClass("red-button-hover");
//     });
//
//     $(".yellow-button").on("mousedown", function() {
//         $(this).addClass("yellow-button-active");
//         setTimeout(function (){
//             game_logic(button.yellow, this);
//         }.bind(this), 100);
//     }).on("mouseover", function() {
//         $(this).addClass("yellow-button-hover");
//     }).on("mouseout", function() {
//         $(this).removeClass("yellow-button-hover");
//     });
//
//     $(".blue-button").on("mousedown", function() {
//         $(this).addClass("blue-button-active")
//         setTimeout(function (){
//             game_logic(button.blue, this);
//         }.bind(this), 100);
//     }).on("mouseover", function() {
//         $(this).addClass("blue-button-hover");
//     }).on("mouseout", function() {
//         $(this).removeClass("blue-button-hover");
//     });
// }

// function validate_sequence (input) {
//     if (input === sequence[sequence_counter]) {
//         sequence_counter++;
//         return true;
//     } else {
//         return false;
//     }
// }
// function game_logic (button_pressed, button_obj) {
//     if (game_status === status_switch.off) {
//         switch_on_game();
//        
//     } else if (game_status === status_switch.playing) {
//         level_counter++;
//        
//         if (level_counter >= 11) {
//             game_status = status_switch.game_won;
//            
//         } else {
//             //level_counter++;
//             set_text_from_level_counter(level_counter);
//             //game_status = status_switch.playing;
//         }
//        
//         if (level_counter >= 2) {
//             validate_button_press(button_pressed);
//         }
//         //flash_button_from_level(button_obj);
//        
//         if (game_status === status_switch.game_won) {
//             exec_game_won_sequence();
//         }
//     } else if (game_status === status_switch.game_over) {
//         level_counter = 0;
//         stop_rick_roll();
//         set_text_from_level_counter(level_counter);
//     } else if (game_status === status_switch.game_won) {
//         //exec_game_won_sequence();
//         game_status = status_switch.off;
//     } else {
//         alert("Error: invalid game status");
//     }
//    
//     let class_name = "." + button_obj.id + "-flash";
//    
//     play_sequence = true;
//    
//     //play_audio(button_pressed);
//     // if (button.hasOwnProperty(button_pressed)) {
//     //     alert("Found property");
//     //     //button_sounds[button_pressed].play();
//     //     new Audio(button[button_pressed]).play();
//     // }
// }
//
// function flash_button_from_level(button) {
//    
//     alert(button);
//     setTimeout(function() {
//         $(button).addClass(class_name);
//     }, 500);
//     setTimeout(function() {
//         $(button).removeClass(class_name);
//     }, 500);
// }
//
// function validate_button_press(button_pressed) {
//
// }
//
// function stop_rick_roll() {
//     rick_audio.pause();
//     rick_audio.currentTime = 0;
// }
//
// function exec_game_won_sequence() {
//     game_status = status_switch.game_over;
//     set_text_from_level_counter(level_counter);
//     rick_audio.play();
// }
//
// function switch_on_game() {
//     game_status = status_switch.playing;
//     level_counter++;
//     set_text_from_level_counter(level_counter);
// }
//
// function set_text_from_level_counter(level_counter) {
//     $("#level-number").text(level_switch[level_counter]);
// }
//
// function play_audio (button_pressed) {
//     if ($(window).width > 1000) {
//         new Audio(button_pressed).play();
//     }
// }
