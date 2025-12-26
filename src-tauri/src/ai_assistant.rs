//! Alagappa AI Assistant - Local and Cloud AI support

use serde::{Deserialize, Serialize};
use std::process::Command;
use tokio::process::Command as TokioCommand;
use log::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,      // "user", "assistant", "system"
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatRequest {
    pub messages: Vec<ChatMessage>,
    pub model: Option<String>,
    pub provider: String,  // "ollama", "openai"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatResponse {
    pub content: String,
    pub model: String,
    pub provider: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIProvider {
    pub name: String,
    pub available: bool,
    pub models: Vec<String>,
}

// ============================================================================
// Provider Detection
// ============================================================================

/// Check if Ollama is installed and running
pub fn check_ollama() -> Option<Vec<String>> {
    // Check if ollama command exists
    let output = Command::new("ollama")
        .arg("list")
        .output()
        .ok()?;
    
    if !output.status.success() {
        return None;
    }
    
    // Parse available models
    let stdout = String::from_utf8_lossy(&output.stdout);
    let models: Vec<String> = stdout
        .lines()
        .skip(1) // Skip header
        .filter_map(|line| {
            let parts: Vec<&str> = line.split_whitespace().collect();
            parts.first().map(|s| s.to_string())
        })
        .collect();
    
    Some(models)
}

/// Get available AI providers
pub fn get_providers() -> Vec<AIProvider> {
    let mut providers = Vec::new();
    
    // Check Ollama
    match check_ollama() {
        Some(models) => {
            providers.push(AIProvider {
                name: "ollama".to_string(),
                available: true,
                models,
            });
        }
        None => {
            providers.push(AIProvider {
                name: "ollama".to_string(),
                available: false,
                models: vec![],
            });
        }
    }
    
    // OpenAI - always "available" but requires API key
    providers.push(AIProvider {
        name: "openai".to_string(),
        available: true, // Will fail at runtime if no API key
        models: vec![
            "gpt-4o".to_string(),
            "gpt-4o-mini".to_string(),
            "gpt-4-turbo".to_string(),
            "gpt-3.5-turbo".to_string(),
        ],
    });
    
    providers
}

// ============================================================================
// Chat with Ollama (Local)
// ============================================================================

pub async fn chat_ollama(
    messages: Vec<ChatMessage>,
    model: String,
) -> Result<ChatResponse, String> {
    info!("🤖 Ollama chat: model={}", model);
    
    // Build the prompt from messages
    let prompt = messages
        .iter()
        .map(|m| {
            match m.role.as_str() {
                "system" => format!("System: {}\n", m.content),
                "user" => format!("User: {}\n", m.content),
                "assistant" => format!("Assistant: {}\n", m.content),
                _ => format!("{}: {}\n", m.role, m.content),
            }
        })
        .collect::<String>() + "Assistant:";
    
    // Call ollama
    let output = TokioCommand::new("ollama")
        .arg("run")
        .arg(&model)
        .arg(&prompt)
        .output()
        .await
        .map_err(|e| format!("Failed to run Ollama: {}", e))?;
    
    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Ollama error: {}", error));
    }
    
    let content = String::from_utf8_lossy(&output.stdout).trim().to_string();
    
    Ok(ChatResponse {
        content,
        model,
        provider: "ollama".to_string(),
    })
}

// ============================================================================
// Chat with OpenAI API
// ============================================================================

pub async fn chat_openai(
    messages: Vec<ChatMessage>,
    model: String,
    api_key: String,
) -> Result<ChatResponse, String> {
    info!("🤖 OpenAI chat: model={}", model);
    
    // Build request body
    let request_body = serde_json::json!({
        "model": model,
        "messages": messages.iter().map(|m| {
            serde_json::json!({
                "role": m.role,
                "content": m.content
            })
        }).collect::<Vec<_>>()
    });
    
    // Use curl for simplicity (avoiding additional dependencies)
    let output = TokioCommand::new("curl")
        .arg("-s")
        .arg("-X").arg("POST")
        .arg("https://api.openai.com/v1/chat/completions")
        .arg("-H").arg("Content-Type: application/json")
        .arg("-H").arg(format!("Authorization: Bearer {}", api_key))
        .arg("-d").arg(request_body.to_string())
        .output()
        .await
        .map_err(|e| format!("Failed to call OpenAI: {}", e))?;
    
    let response_text = String::from_utf8_lossy(&output.stdout);
    
    // Parse response
    let response: serde_json::Value = serde_json::from_str(&response_text)
        .map_err(|e| format!("Failed to parse OpenAI response: {}", e))?;
    
    // Check for errors
    if let Some(error) = response.get("error") {
        let message = error.get("message")
            .and_then(|m| m.as_str())
            .unwrap_or("Unknown error");
        return Err(format!("OpenAI API error: {}", message));
    }
    
    // Extract content
    let content = response
        .get("choices")
        .and_then(|c| c.get(0))
        .and_then(|c| c.get("message"))
        .and_then(|m| m.get("content"))
        .and_then(|c| c.as_str())
        .ok_or("Failed to extract response content")?
        .to_string();
    
    Ok(ChatResponse {
        content,
        model,
        provider: "openai".to_string(),
    })
}

// ============================================================================
// Unified Chat Interface
// ============================================================================

pub async fn chat(
    request: ChatRequest,
    api_key: Option<String>,
) -> Result<ChatResponse, String> {
    let model = request.model.unwrap_or_else(|| {
        match request.provider.as_str() {
            "ollama" => "llama3.2".to_string(),
            "openai" => "gpt-4o-mini".to_string(),
            _ => "llama3.2".to_string(),
        }
    });
    
    match request.provider.as_str() {
        "ollama" => chat_ollama(request.messages, model).await,
        "openai" => {
            let key = api_key.ok_or("OpenAI API key required")?;
            chat_openai(request.messages, model, key).await
        }
        _ => Err(format!("Unknown provider: {}", request.provider)),
    }
}

// ============================================================================
// System Prompts
// ============================================================================

pub fn get_system_prompt() -> String {
    r#"You are Alagappa AI, a helpful assistant built into Alagappa Tools - a desktop application for:
- Biometric attendance management (ZKTeco devices)
- Document conversion (Excel, CSV, JSON, PDF)
- Image processing (resize, convert, compress)
- Video processing (convert, compress, extract audio)

You help users with:
1. Using the app's features effectively
2. Troubleshooting issues
3. General questions and tasks
4. Data analysis and insights

Be concise, friendly, and helpful. Use emojis sparingly for clarity."#.to_string()
}
