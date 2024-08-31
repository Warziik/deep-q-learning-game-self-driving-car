use tauri::Manager;
use window_vibrancy::*;

#[tauri::command]
fn save_neural_network() -> String {
    "Neural network saved successfully".into()
}

#[tauri::command]
fn load_neural_network() -> String {
    "Neural network loaded successfully".into()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            save_neural_network,
            load_neural_network
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
