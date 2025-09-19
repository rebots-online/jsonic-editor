use serde_json::Value;
use std::collections::HashMap;
use tauri::Manager;

use crate::file_handler::{read_file, write_file};
use crate::json_comments::{parse_json_with_comments, stringify_json_with_comments};

#[tauri::command]
pub fn open_file(path: String) -> Result<Value, String> {
    match read_file(&path) {
        Ok(content) => parse_json_with_comments(&content),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn save_file(path: String, content: Value) -> Result<(), String> {
    let json_string = match stringify_json_with_comments(&content) {
        Ok(s) => s,
        Err(e) => return Err(e.to_string()),
    };
    
    match write_file(&path, &json_string) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn parse_json_with_comments(json_str: &str) -> Result<Value, String> {
    parse_json_with_comments(json_str)
}

#[tauri::command]
pub fn stringify_json_with_comments(json_value: &Value) -> Result<String, String> {
    stringify_json_with_comments(json_value)
}