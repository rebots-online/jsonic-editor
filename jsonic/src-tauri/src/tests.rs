#[cfg(test)]
mod tests {
    use super::commands;
    use std::fs;
    use std::io::Write;
    use tempfile::tempdir;

    fn write_temp_file(dir: &tempfile::TempDir, name: &str, content: &str) -> std::path::PathBuf {
        let path = dir.path().join(name);
        let mut file = fs::File::create(&path).expect("create temp file");
        file.write_all(content.as_bytes()).expect("write temp file");
        path
    }

    #[test]
    fn parse_and_stringify_preserves_comments_when_cached() {
        let jsonc = r#"{
  // leading comment
  "a": 1, // inline
  /* block */
  "b": [2, 3]
}"#;

        let parsed = commands::cmd_parse_json_with_comments(jsonc).expect("parse jsonc");
        assert_eq!(parsed["a"], 1);

        let stringified =
            commands::cmd_stringify_json_with_comments(&parsed).expect("stringify jsonc");
        assert!(stringified.contains("leading comment"));
        assert!(stringified.contains("inline"));
        assert!(stringified.contains("block"));
    }

    #[test]
    fn open_and_save_round_trips_comments_with_cache() {
        let dir = tempdir().unwrap();
        let path = write_temp_file(&dir, "data.jsonc", "{\n// comment\n\"x\": 5\n}");

        let opened =
            commands::cmd_open_file(Some(path.to_string_lossy().to_string())).expect("open file");
        assert_eq!(opened["x"], 5);

        let save_path = dir.path().join("out.jsonc");
        commands::cmd_save_file(Some(save_path.to_string_lossy().to_string()), opened)
            .expect("save file");

        let saved_content = fs::read_to_string(&save_path).expect("read saved");
        assert!(saved_content.contains("comment"));
    }

    #[test]
    fn open_missing_file_surfaces_error() {
        let err = commands::cmd_open_file(Some("/nonexistent/path.json".into())).unwrap_err();
        assert!(err.contains("Failed to open"));
    }
}
