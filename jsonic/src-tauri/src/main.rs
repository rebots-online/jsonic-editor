// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod file_handler;
mod json_comments;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::open_file,
            commands::save_file,
            commands::parse_json_with_comments,
            commands::stringify_json_with_comments
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}