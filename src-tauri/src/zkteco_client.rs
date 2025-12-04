use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::time::Duration;
use chrono::{Local, TimeZone, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AttendanceRecord {
    pub user_id: u32,
    pub user_name: String,
    pub timestamp: String,
    pub status: u8,
    pub punch: u8,
    pub date: String,
    pub time: String,
    pub event: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    uid: u32,
    name: String,
    user_id: Option<String>,
}

// ZKTeco protocol constants
const CMD_CONNECT: u16 = 1000;
const CMD_EXIT: u16 = 1001;
const CMD_ENABLEDEVICE: u16 = 1002;
const CMD_DISABLEDEVICE: u16 = 1003;
const CMD_ACK_OK: u16 = 5000;
const CMD_ACK_ERROR: u16 = 5001;
const CMD_ACK_DATA: u16 = 5002;
const CMD_ACK_RETRY: u16 = 5003;
const CMD_ACK_REPEAT: u16 = 5004;
const CMD_ACK_UNAUTH: u16 = 5005;
const CMD_PREPARE_DATA: u16 = 1500;
const CMD_DATA: u16 = 1501;
const CMD_GET_USER: u16 = 8;
const CMD_ATTLOG_RRQ: u16 = 13;

struct ZKClient {
    stream: TcpStream,
    session_id: u16,
    reply_id: u16,
}

impl ZKClient {
    fn connect(ip: &str, port: u16) -> Result<Self, String> {
        let addr = format!("{}:{}", ip, port);
        let stream = TcpStream::connect(&addr)
            .map_err(|e| format!("Failed to connect: {}", e))?;
        
        stream
            .set_read_timeout(Some(Duration::from_secs(30)))
            .map_err(|e| format!("Failed to set timeout: {}", e))?;
        
        stream
            .set_write_timeout(Some(Duration::from_secs(30)))
            .map_err(|e| format!("Failed to set timeout: {}", e))?;
        
        let mut client = ZKClient {
            stream,
            session_id: 0,
            reply_id: 0,
        };
        
        client.handshake()?;
        
        Ok(client)
    }
    
    fn handshake(&mut self) -> Result<(), String> {
        // Send connect command
        let cmd = self.build_command(CMD_CONNECT, &[])?;
        self.send_packet(&cmd)?;
        
        // Receive response
        let response = self.receive_packet()?;
        let (command, _) = self.parse_packet(&response)?;
        
        if command == CMD_ACK_OK {
            // Extract session ID from response
            if response.len() >= 8 {
                self.session_id = u16::from_le_bytes([response[4], response[5]]);
                self.reply_id = 1;
            }
            Ok(())
        } else {
            Err("Handshake failed".to_string())
        }
    }
    
    fn build_command(&self, command: u16, data: &[u8]) -> Result<Vec<u8>, String> {
        let mut packet = Vec::new();
        
        // Header (8 bytes)
        packet.extend_from_slice(&(0x5050u16).to_le_bytes()); // Start code
        packet.extend_from_slice(&(self.session_id).to_le_bytes());
        packet.extend_from_slice(&(command).to_le_bytes());
        packet.extend_from_slice(&(self.reply_id).to_le_bytes());
        
        // Data
        if !data.is_empty() {
            packet.extend_from_slice(data);
        }
        
        // Checksum (last 2 bytes)
        let checksum = self.calculate_checksum(&packet);
        packet.extend_from_slice(&checksum.to_le_bytes());
        
        Ok(packet)
    }
    
    fn calculate_checksum(&self, data: &[u8]) -> u16 {
        let mut checksum: u16 = 0;
        for &byte in data {
            checksum = checksum.wrapping_add(byte as u16);
        }
        checksum
    }
    
    fn send_packet(&mut self, packet: &[u8]) -> Result<(), String> {
        self.stream
            .write_all(packet)
            .map_err(|e| format!("Failed to send: {}", e))?;
        self.stream
            .flush()
            .map_err(|e| format!("Failed to flush: {}", e))?;
        self.reply_id = self.reply_id.wrapping_add(1);
        Ok(())
    }
    
    fn receive_packet(&mut self) -> Result<Vec<u8>, String> {
        let mut header = [0u8; 8];
        self.stream
            .read_exact(&mut header)
            .map_err(|e| format!("Failed to read header: {}", e))?;
        
        let data_length = u16::from_le_bytes([header[6], header[7]]) as usize;
        
        let mut data = vec![0u8; data_length];
        if data_length > 0 {
            self.stream
                .read_exact(&mut data)
                .map_err(|e| format!("Failed to read data: {}", e))?;
        }
        
        let mut packet = header.to_vec();
        packet.extend_from_slice(&data);
        
        Ok(packet)
    }
    
    fn parse_packet(&self, packet: &[u8]) -> Result<(u16, Vec<u8>), String> {
        if packet.len() < 8 {
            return Err("Packet too short".to_string());
        }
        
        let command = u16::from_le_bytes([packet[4], packet[5]]);
        let data_length = u16::from_le_bytes([packet[6], packet[7]]) as usize;
        
        let data = if packet.len() > 8 {
            packet[8..8 + data_length].to_vec()
        } else {
            Vec::new()
        };
        
        Ok((command, data))
    }
    
    fn get_users(&mut self) -> Result<Vec<User>, String> {
        let cmd = self.build_command(CMD_GET_USER, &[])?;
        self.send_packet(&cmd)?;
        
        let mut users = Vec::new();
        let mut uid = 1u32;
        
        loop {
            let response = self.receive_packet()?;
            let (command, data) = self.parse_packet(&response)?;
            
            match command {
                CMD_DATA => {
                    if data.len() >= 72 {
                        // Parse user data (simplified - actual format may vary)
                        let name_bytes = &data[8..40];
                        let name = String::from_utf8_lossy(name_bytes)
                            .trim_end_matches('\0')
                            .to_string();
                        
                        users.push(User {
                            uid,
                            name: if name.is_empty() {
                                format!("User {}", uid)
                            } else {
                                name
                            },
                            user_id: Some(uid.to_string()),
                        });
                        uid += 1;
                    }
                }
                CMD_ACK_OK => break,
                CMD_ACK_ERROR => return Err("Error getting users".to_string()),
                _ => {}
            }
        }
        
        Ok(users)
    }
    
    fn get_attendance(&mut self, users: &[User]) -> Result<Vec<AttendanceRecord>, String> {
        let cmd = self.build_command(CMD_ATTLOG_RRQ, &[])?;
        self.send_packet(&cmd)?;
        
        let mut records = Vec::new();
        let user_lookup: HashMap<u32, String> = users
            .iter()
            .map(|u| (u.uid, u.name.clone()))
            .collect();
        
        loop {
            let response = self.receive_packet()?;
            let (command, data) = self.parse_packet(&response)?;
            
            match command {
                CMD_DATA => {
                    if data.len() >= 16 {
                        // Parse attendance log (simplified - actual format may vary)
                        let user_id = u32::from_le_bytes([
                            data[0],
                            data[1],
                            data[2],
                            data[3],
                        ]);
                        
                        // Timestamp (seconds since 1970)
                        let timestamp_secs = u32::from_le_bytes([
                            data[4],
                            data[5],
                            data[6],
                            data[7],
                        ]) as i64;
                        
                        let status = data[8];
                        let punch = data[9];
                        
                        let dt = Utc.timestamp_opt(timestamp_secs, 0)
                            .single()
                            .map(|utc_dt| utc_dt.with_timezone(&Local))
                            .unwrap_or_else(|| Local::now());
                        
                        let user_name = user_lookup
                            .get(&user_id)
                            .cloned()
                            .unwrap_or_else(|| format!("Unknown (ID: {})", user_id));
                        
                        let status_map: HashMap<u8, &str> = [
                            (0, "Check In"),
                            (1, "Check Out"),
                            (2, "Break Out"),
                            (3, "Break In"),
                            (4, "OT In"),
                            (5, "OT Out"),
                        ]
                        .iter()
                        .cloned()
                        .collect();
                        
                        let event = status_map
                            .get(&status)
                            .copied()
                            .unwrap_or("Unknown");
                        
                        records.push(AttendanceRecord {
                            user_id,
                            user_name,
                            timestamp: dt.to_rfc3339(),
                            status,
                            punch,
                            date: dt.format("%Y-%m-%d").to_string(),
                            time: dt.format("%H:%M:%S").to_string(),
                            event: event.to_string(),
                        });
                    }
                }
                CMD_ACK_OK => break,
                CMD_ACK_ERROR => return Err("Error getting attendance".to_string()),
                _ => {}
            }
        }
        
        Ok(records)
    }
    
    fn disconnect(&mut self) -> Result<(), String> {
        let cmd = self.build_command(CMD_EXIT, &[])?;
        self.send_packet(&cmd)?;
        Ok(())
    }
}

pub async fn connect_and_fetch_attendance(
    ip: &str,
    port: u16,
) -> Result<Vec<AttendanceRecord>, String> {
    // Clone values for move into closure
    let ip = ip.to_string();
    
    // Run blocking I/O in a thread pool
    tokio::task::spawn_blocking(move || {
        let mut client = ZKClient::connect(&ip, port)
            .map_err(|e| format!("Connection failed: {}", e))?;
        
        println!("✅ Connected to device");
        
        // Get users
        let users = client.get_users()
            .map_err(|e| format!("Failed to get users: {}", e))?;
        println!("👥 Total users: {}", users.len());
        
        // Get attendance logs
        let records = client.get_attendance(&users)
            .map_err(|e| format!("Failed to get attendance: {}", e))?;
        println!("🕒 Total attendance logs: {}", records.len());
        
        client.disconnect()
            .map_err(|e| format!("Failed to disconnect: {}", e))?;
        
        Ok::<Vec<AttendanceRecord>, String>(records)
    })
    .await
    .map_err(|e| format!("Task error: {}", e))?
}

