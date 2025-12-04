use serde::{Deserialize, Serialize};
use std::net::{IpAddr, Ipv4Addr};
use std::time::Duration;
use tokio::net::TcpStream;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricDevice {
    pub ip: String,
    pub mac: String,
    pub open_ports: Vec<u16>,
}

// Known MAC prefixes for biometric vendors
const BIOMETRIC_MAC_PREFIXES: &[&str] = &[
    "00:17:61", // ZKTeco / ESSL / Realtime
    "AC:83:F3", // ZKTeco newer models
    "F8:1D:78", // Anviz / eSSL series
    "3C:8C:F8", // Matrix
    "64:09:80", // Realand / BioTime OEMs
];

// Common ports for biometric/time-attendance devices
const COMMON_PORTS: &[u16] = &[80, 89, 8080, 23, 4370, 4360];

fn get_local_ip() -> Result<Ipv4Addr, String> {
    // Try to connect to a public DNS to determine local IP
    let socket = std::net::UdpSocket::bind("0.0.0.0:0")
        .map_err(|e| format!("Failed to bind socket: {}", e))?;
    
    socket
        .connect("8.8.8.8:80")
        .map_err(|e| format!("Failed to connect: {}", e))?;
    
    let local_addr = socket
        .local_addr()
        .map_err(|e| format!("Failed to get local address: {}", e))?;
    
    match local_addr.ip() {
        IpAddr::V4(ip) => Ok(ip),
        IpAddr::V6(_) => Err("IPv6 not supported".to_string()),
    }
}

fn is_biometric_device(mac: &str, ports: &[u16]) -> bool {
    let mac_upper = mac.to_uppercase();
    let mac_prefix = if mac_upper.len() >= 8 {
        &mac_upper[..8]
    } else {
        return false;
    };
    
    // Check MAC prefix
    if BIOMETRIC_MAC_PREFIXES
        .iter()
        .any(|prefix| mac_prefix.starts_with(prefix))
    {
        return true;
    }
    
    // Check for biometric-specific ports
    if ports.contains(&4370) || ports.contains(&4360) {
        return true;
    }
    
    false
}

async fn check_port(ip: &str, port: u16) -> bool {
    let addr = format!("{}:{}", ip, port);
    match tokio::time::timeout(
        Duration::from_millis(500),
        TcpStream::connect(&addr),
    )
    .await
    {
        Ok(Ok(_)) => true,
        _ => false,
    }
}

async fn arp_scan(network: &str) -> Result<Vec<(String, String)>, String> {
    // For now, we'll do a simple port scan approach
    // Full ARP scanning requires raw sockets which need root/admin privileges
    // This is a simplified version that scans common IPs in the subnet
    
    let base_ip = network
        .split('/')
        .next()
        .ok_or("Invalid network format")?;
    
    let parts: Vec<&str> = base_ip.split('.').collect();
    if parts.len() != 4 {
        return Err("Invalid IP format".to_string());
    }
    
    let base: u8 = parts[0].parse().map_err(|_| "Invalid IP")?;
    let second: u8 = parts[1].parse().map_err(|_| "Invalid IP")?;
    let third: u8 = parts[2].parse().map_err(|_| "Invalid IP")?;
    
    let mut devices = Vec::new();
    
    // Scan common IP range (1-254)
    for i in 1..255u8 {
        let ip = format!("{}.{}.{}.{}", base, second, third, i);
        
        // Quick check if device is alive by checking common ports
        let mut has_open_port = false;
        for port in COMMON_PORTS {
            if check_port(&ip, *port).await {
                has_open_port = true;
                break;
            }
        }
        
        if has_open_port {
            // For MAC address, we'd need ARP table lookup
            // This is a simplified version - in production, you'd parse /proc/net/arp or use ARP
            let mac = "Unknown".to_string(); // Placeholder
            devices.push((ip, mac));
        }
    }
    
    Ok(devices)
}

pub async fn scan_network() -> Result<Vec<BiometricDevice>, String> {
    let local_ip = get_local_ip()?;
    let network = format!("{}/24", local_ip);
    
    println!("🌐 Scanning network: {}", network);
    
    // Get devices (simplified - in production use proper ARP scanning)
    let devices = arp_scan(&network).await?;
    
    println!("🔎 Found {} active devices\n", devices.len());
    
    let mut biometric_devices = Vec::new();
    
    for (ip, mac) in devices {
        println!("🔍 Checking {} ({}) ...", ip, mac);
        
        let mut open_ports = Vec::new();
        
        for port in COMMON_PORTS {
            if check_port(&ip, *port).await {
                open_ports.push(*port);
            }
        }
        
        if is_biometric_device(&mac, &open_ports) || open_ports.contains(&4370) || open_ports.contains(&4360) {
            println!("  ✅ Biometric device detected at {}", ip);
            println!("     MAC: {}", mac);
            println!("     Open ports: {:?}", open_ports);
            
            biometric_devices.push(BiometricDevice {
                ip,
                mac,
                open_ports,
            });
        } else {
            println!("  ❌ Not a biometric (ports: {:?})", open_ports);
        }
    }
    
    println!("\n📋 Summary Report:");
    if !biometric_devices.is_empty() {
        for device in &biometric_devices {
            println!(
                "✅ {} ({}) → ports {:?}",
                device.ip, device.mac, device.open_ports
            );
        }
        println!(
            "\n🎯 Found {} biometric device(s) on the network.",
            biometric_devices.len()
        );
    } else {
        println!("🚫 No biometric devices detected on this subnet.");
    }
    
    Ok(biometric_devices)
}

