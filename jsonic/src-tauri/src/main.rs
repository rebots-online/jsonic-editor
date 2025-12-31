// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod file_handler;
mod json_comments;

#[cfg(test)]
mod tests;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::cmd_open_file,
            commands::cmd_save_file,
            commands::cmd_parse_json_with_comments,
            commands::cmd_stringify_json_with_comments
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
