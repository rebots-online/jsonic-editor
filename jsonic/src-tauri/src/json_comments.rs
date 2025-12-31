use jsonc_parser::cst::{CstInputValue, CstRootNode};
use jsonc_parser::{parse_to_serde_value, ParseOptions};
use once_cell::sync::Lazy;
use serde_json::Value;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

static COMMENT_CACHE: Lazy<Mutex<HashMap<PathBuf, CommentedDocument>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

#[derive(Clone)]
struct CommentedDocument {
    path: Option<PathBuf>,
    root: CstRootNode,
    value: Value,
}

pub fn parse_jsonc_document(json_str: &str, path_hint: Option<&Path>) -> Result<Value, String> {
    let serde_value = parse_to_serde_value(json_str, &ParseOptions::default())
        .map_err(|e| format!("Parse error: {}", e))?
        .ok_or_else(|| "Empty input".to_string())?;

    let cst = CstRootNode::parse(json_str, &ParseOptions::default())
        .map_err(|e| format!("Failed to build CST: {}", e))?;

    if let Some(path) = path_hint {
        let mut guard = COMMENT_CACHE
            .lock()
            .map_err(|_| "Failed to lock comment cache".to_string())?;
        let doc = CommentedDocument {
            path: Some(path.to_path_buf()),
            root: cst.clone(),
            value: serde_value.clone(),
        };
        guard.insert(path.to_path_buf(), doc);
    }

    Ok(serde_value)
}

fn value_to_cst_input(value: &Value) -> CstInputValue {
    match value {
        Value::Null => CstInputValue::Null,
        Value::Bool(b) => CstInputValue::Bool(*b),
        Value::Number(n) => CstInputValue::Number(n.to_string()),
        Value::String(s) => CstInputValue::String(s.clone()),
        Value::Array(arr) => {
            let items: Vec<CstInputValue> = arr.iter().map(value_to_cst_input).collect();
            CstInputValue::Array(items)
        }
        Value::Object(map) => {
            let mut props = Vec::with_capacity(map.len());
            for (k, v) in map.iter() {
                props.push((k.clone(), value_to_cst_input(v)));
            }
            CstInputValue::Object(props)
        }
    }
}

pub fn stringify_jsonc_document(
    json_value: &Value,
    path_hint: Option<&Path>,
) -> Result<String, String> {
    if let Some(path) = path_hint {
        if let Some(cached) = COMMENT_CACHE
            .lock()
            .map_err(|_| "Failed to lock comment cache".to_string())?
            .get_mut(path)
        {
            let input = value_to_cst_input(json_value);
            cached.root.set_value(input);
            cached.value = json_value.clone();
            return Ok(cached.root.to_string());
        }
    }

    // Fallback: format without preserved comments
    jsonc_parser::cst::CstRootNode::parse(&json_value.to_string(), &ParseOptions::default())
        .map(|root| root.to_string())
        .map_err(|e| format!("Failed to stringify: {}", e))
}
