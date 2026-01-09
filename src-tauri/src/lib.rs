use notion::{PropertyValue, QueryResponse, RollupProperty, RollupValue, Task};

mod notion;

#[tauri::command]
async fn fetch_tasks(token: String, database_id: String) -> Result<Vec<Task>, String> {
    let client = reqwest::Client::new();
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    let query_body = serde_json::json!({
        "filter": {
            "and": [
                {
                    "property": "Checkbox",
                    "checkbox": {
                        "equals": false
                    }
                },
                {
                    "property": "Date",
                    "date": {
                        "on_or_before": today
                    }
                }
            ]
        }
    });

    let res = client
        .post(format!(
            "https://api.notion.com/v1/databases/{}/query",
            database_id
        ))
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .json(&query_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        let error_text = res.text().await.unwrap_or_default();
        return Err(format!("Notion API Error: {}", error_text));
    }

    let body_text = res.text().await.unwrap_or_default();
    let query_res: QueryResponse = serde_json::from_str(&body_text).map_err(|e| {
        let snippet: String = body_text.chars().take(500).collect();
        format!("JSON Parse Error: {}. Snippet: {}", e, snippet)
    })?;

    let tasks: Vec<Task> = query_res
        .results
        .into_iter()
        .map(|page| {
            let title = match page.properties.get("Task Name") {
                Some(PropertyValue::Title { title }) => title
                    .first()
                    .map(|t| t.plain_text.clone())
                    .unwrap_or_default(),
                _ => "Untitled".to_string(),
            };

            let status = match page.properties.get("Checkbox") {
                Some(PropertyValue::Checkbox { checkbox }) => {
                    if *checkbox {
                        "Done".to_string()
                    } else {
                        "To Do".to_string()
                    }
                }
                _ => "To Do".to_string(),
            };

            let do_date = match page.properties.get("Date") {
                Some(PropertyValue::Date { date }) => date.as_ref().map(|d| d.start.clone()),
                _ => None,
            };

            // Handle Rollups (Strategy linked to Objective Name/Deadline)
            // We assume the user has created 'Objective Name' and 'Objective Deadline' rollups
            // derived from the 'Strategy' relation.
            let objective_name = match page.properties.get("Objective Name") {
                Some(PropertyValue::Rollup { rollup }) => {
                    match rollup {
                        Some(RollupValue::Array { array }) => {
                            // Find the first Title
                            array.iter().find_map(|p| match p {
                                RollupProperty::Title { title } => {
                                    title.first().map(|t| t.plain_text.clone())
                                }
                                _ => None,
                            })
                        }
                        _ => None,
                    }
                }
                _ => None,
            };

            let objective_deadline = match page.properties.get("Objective Deadline") {
                Some(PropertyValue::Rollup { rollup }) => {
                    match rollup {
                        Some(RollupValue::Array { array }) => {
                            // Find the first Date, either directly or via Formula
                            array.iter().find_map(|p| match p {
                                RollupProperty::Date { date } => {
                                    date.as_ref().map(|d| d.start.clone())
                                }
                                RollupProperty::Formula { formula } => match formula {
                                    notion::FormulaValue::Date { date } => {
                                        date.as_ref().map(|d| d.start.clone())
                                    }
                                    _ => None,
                                },
                                _ => None,
                            })
                        }
                        Some(RollupValue::Date { date }) => date.as_ref().map(|d| d.start.clone()),
                        _ => None,
                    }
                }
                _ => None,
            };

            Task {
                id: page.id,
                title,
                status,
                do_date,
                objective_name,
                objective_deadline,
            }
        })
        .collect();

    Ok(tasks)
}

#[tauri::command]
async fn mark_task_complete(token: String, page_id: String, completed: bool) -> Result<(), String> {
    let client = reqwest::Client::new();

    let body = serde_json::json!({
        "properties": {
             "Checkbox": {
                 "checkbox": completed
             }
        }
    });

    let res = client
        .patch(format!("https://api.notion.com/v1/pages/{}", page_id))
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        let error_text = res.text().await.unwrap_or_default();
        return Err(format!("Notion API Error: {}", error_text));
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            use tauri::tray::{TrayIconBuilder, TrayIconEvent};
            use tauri::Manager;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fetch_tasks, mark_task_complete])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
