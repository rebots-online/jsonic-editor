use serde_json::Value;
use std::path::{Path, PathBuf};
use tauri::api::dialog::FileDialogBuilder;

use crate::file_handler::{read_file, write_file};
use crate::json_comments::{parse_jsonc_document, stringify_jsonc_document};

fn normalize_path(input: &str) -> Result<PathBuf, String> {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return Err("No path provided".to_string());
    }
    Ok(PathBuf::from(trimmed))
}

fn pick_open_path() -> Result<PathBuf, String> {
    FileDialogBuilder::new()
        .set_title("Open JSON or JSONC file")
        .pick_file()
        .ok_or_else(|| "No file selected".to_string())
}

fn pick_save_path() -> Result<PathBuf, String> {
    FileDialogBuilder::new()
        .set_title("Save JSON or JSONC file")
        .save_file()
        .ok_or_else(|| "No file selected".to_string())
}

fn contextualize_io_error(action: &str, path: &Path, err: std::io::Error) -> String {
    format!("Failed to {} '{}': {}", action, path.display(), err)
}

#[tauri::command]
pub fn cmd_open_file(path: Option<String>) -> Result<Value, String> {
    let chosen_path = match path {
        Some(ref p) if !p.trim().is_empty() => normalize_path(p)?,
        _ => pick_open_path()?,
    };

    let content = read_file(chosen_path.as_path())
        .map_err(|e| contextualize_io_error("open", chosen_path.as_path(), e))?;

    parse_jsonc_document(&content, Some(chosen_path.as_path()))
        .map_err(|e| format!("Failed to parse file '{}': {}", chosen_path.display(), e))
}

#[tauri::command]
pub fn cmd_save_file(path: Option<String>, content: Value) -> Result<(), String> {
    let chosen_path = match path {
        Some(ref p) if !p.trim().is_empty() => normalize_path(p)?,
        _ => pick_save_path()?,
    };

    let json_string =
        stringify_jsonc_document(&content, Some(chosen_path.as_path())).map_err(|e| {
            format!(
                "Failed to stringify for save '{}': {}",
                chosen_path.display(),
                e
            )
        })?;

    write_file(chosen_path.as_path(), &json_string)
        .map_err(|e| contextualize_io_error("save", chosen_path.as_path(), e))
}

#[tauri::command]
pub fn cmd_parse_json_with_comments(json_str: &str) -> Result<Value, String> {
    parse_jsonc_document(json_str, None).map_err(|e| format!("Failed to parse input: {}", e))
}

#[tauri::command]
pub fn cmd_stringify_json_with_comments(json_value: &Value) -> Result<String, String> {
    stringify_jsonc_document(json_value, None)
        .map_err(|e| format!("Failed to stringify input: {}", e))
}
