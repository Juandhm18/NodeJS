import 'dotenv/config'
import cron from 'node-cron'
import nodemailer from 'nodemailer'
import fs from 'fs-extra'
import path from 'path'
import moment from 'moment'
import os from 'os'
import { fileURLToPath } from 'url';
import { basename } from 'path';

const currentFile = fileURLToPath(import.meta.url);

const PASS = process.env.PASS
// Configuración de email
const EMAIL_CONFIG = {
    // Gmail SMTP
    gmail: {
        service: 'gmail',
        auth: {
            user: 'clasesriwi@gmail.com',
            pass: PASS     
        }
    },
    
    // SMTP personalizado
    custom: {
        host: 'smtp.tu-servidor.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tu_usuario@tu-servidor.com',
            pass: 'tu_password'
        }
    },
    
    // Configuración de correos
    from: 'clasesriwi@gmail.com',
    to: ['ingecarrasquilla@email.com'], // Puedes agregar múltiples emails
    subject: `Reporte del Sistema - ${moment().format('YYYY-MM-DD HH:mm')}`
};

// Configuración general
const CONFIG = {
    logDir: './logs',
    logFile: 'email-cron.log'
};

// Asegurar directorio de logs
fs.ensureDirSync(CONFIG.logDir);

// Función de logging
function log(message, level = 'INFO') {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logMessage);
    
    const logPath = path.join(CONFIG.logDir, CONFIG.logFile);
    fs.appendFileSync(logPath, logMessage + '\n');
}

// Crear transporter de nodemailer
function createEmailTransporter() {
    try {
        // Usar Gmail por defecto, cambia a 'custom' si prefieres otro SMTP
        const transporter = nodemailer.createTransporter(EMAIL_CONFIG.gmail);
        
        // Verificar conexión
        transporter.verify((error, success) => {
            if (error) {
                log(`Error en configuración de email: ${error.message}`, 'ERROR');
            } else {
                log('Configuración de email verificada correctamente');
            }
        });
        
        return transporter;
        
    } catch (error) {
        log(`Error creando transporter: ${error.message}`, 'ERROR');
        return null;
    }
}

// Función para obtener información del sistema
function getSystemInfo() {
    const cpuUsage = process.cpuUsage();
    const memUsage = process.memoryUsage();
    
    return {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        hostname: os.hostname(),
        platform: `${os.platform()} ${os.arch()}`,
        uptime: {
            system: Math.floor(os.uptime()),
            process: Math.floor(process.uptime())
        },
        memory: {
            total: Math.round(os.totalmem() / 1024 / 1024), // MB
            free: Math.round(os.freemem() / 1024 / 1024),   // MB
            used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
            process: {
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024)
            }
        },
        cpu: {
            count: os.cpus().length,
            loadAverage: os.loadavg().map(load => load.toFixed(2)),
            usage: cpuUsage
        },
        network: os.networkInterfaces(),
        nodeVersion: process.version,
        pid: process.pid
    };
}

// Función para generar reporte del sistema
function generateSystemReport() {
    const sysInfo = getSystemInfo();
    const diskInfo = getDiskInfo();
    const processInfo = getProcessInfo();
    
    return {
        system: sysInfo,
        disk: diskInfo,
        processes: processInfo,
        logs: getLogSummary()
    };
}

// Función para obtener información de disco (simulada)
function getDiskInfo() {
    try {
        const stats = fs.statSync('./');
        return {
            currentDir: process.cwd(),
            stats: {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            }
        };
    } catch (error) {
        log(`Error obteniendo info de disco: ${error.message}`, 'ERROR');
        return { error: error.message };
    }
}

// Función para obtener información de procesos
function getProcessInfo() {
    return {
        pid: process.pid,
        ppid: process.ppid,
        title: process.title,
        argv: process.argv,
        execPath: process.execPath,
        cwd: process.cwd(),
        env: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            PATH: process.env.PATH ? 'Set' : 'Not set'
        }
    };
}

// Función para obtener resumen de logs
function getLogSummary() {
    try {
        const logPath = path.join(CONFIG.logDir, CONFIG.logFile);
        
        if (!fs.existsSync(logPath)) {
            return { exists: false };
        }
        
        const stats = fs.statSync(logPath);
        const content = fs.readFileSync(logPath, 'utf8');
        const lines = content.split('\n');
        
        // Contar tipos de log
        const logCounts = {
            INFO: 0,
            ERROR: 0,
            WARN: 0,
            DEBUG: 0
        };
        
        lines.forEach(line => {
            Object.keys(logCounts).forEach(level => {
                if (line.includes(`[${level}]`)) {
                    logCounts[level]++;
                }
            });
        });
        
        return {
            exists: true,
            size: stats.size,
            lines: lines.length - 1,
            lastModified: stats.mtime,
            counts: logCounts,
            recentLines: lines.slice(-10).filter(line => line.trim())
        };
        
    } catch (error) {
        log(`Error obteniendo resumen de logs: ${error.message}`, 'ERROR');
        return { error: error.message };
    }
}

// Función para crear el contenido HTML del email
function createEmailHTML(reportData) {
    const { system, disk, processes, logs } = reportData;
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte del Sistema</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
            .section h3 { color: #2c3e50; margin-top: 0; }
            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .info-box { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .status-ok { color: #28a745; font-weight: bold; }
            .status-warning { color: #ffc107; font-weight: bold; }
            .status-error { color: #dc3545; font-weight: bold; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace; font-size: 12px; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Reporte Automático del Sistema</h1>
                <p><strong>Servidor:</strong> ${system.hostname} | <strong>Fecha:</strong> ${system.timestamp}</p>
            </div>
            
            <div class="section">
                <h3>🖥️ Información del Sistema</h3>
                <div class="info-grid">
                    <div class="info-box">
                        <strong>Plataforma:</strong><br>
                        ${system.platform}<br>
                        <strong>Node.js:</strong> ${system.nodeVersion}
                    </div>
                    <div class="info-box">
                        <strong>Uptime del Sistema:</strong><br>
                        ${Math.floor(system.uptime.system / 3600)}h ${Math.floor((system.uptime.system % 3600) / 60)}m<br>
                        <strong>Uptime del Proceso:</strong><br>
                        ${Math.floor(system.uptime.process / 3600)}h ${Math.floor((system.uptime.process % 3600) / 60)}m
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>💾 Memoria</h3>
                <div class="info-grid">
                    <div class="info-box">
                        <strong>Sistema:</strong><br>
                        Total: ${system.memory.total} MB<br>
                        Libre: ${system.memory.free} MB<br>
                        Usado: ${system.memory.used} MB
                    </div>
                    <div class="info-box">
                        <strong>Proceso Node.js:</strong><br>
                        RSS: ${system.memory.process.rss} MB<br>
                        Heap Total: ${system.memory.process.heapTotal} MB<br>
                        Heap Usado: ${system.memory.process.heapUsed} MB
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>⚙️ CPU y Carga</h3>
                <div class="info-box">
                    <strong>Núcleos:</strong> ${system.cpu.count}<br>
                    <strong>Load Average:</strong> ${system.cpu.loadAverage.join(', ')}<br>
                    <strong>PID del Proceso:</strong> ${system.pid}
                </div>
            </div>
            
            ${logs.exists ? `
            <div class="section">
                <h3>📄 Resumen de Logs</h3>
                <div class="info-grid">
                    <div class="info-box">
                        <strong>Estadísticas:</strong><br>
                        Líneas: ${logs.lines}<br>
                        Tamaño: ${Math.round(logs.size / 1024)} KB<br>
                        Modificado: ${moment(logs.lastModified).format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div class="info-box">
                        <strong>Tipos de Log:</strong><br>
                        <span class="status-ok">INFO: ${logs.counts.INFO}</span><br>
                        <span class="status-warning">WARN: ${logs.counts.WARN}</span><br>
                        <span class="status-error">ERROR: ${logs.counts.ERROR}</span>
                    </div>
                </div>
                
                ${logs.recentLines.length > 0 ? `
                <div class="info-box">
                    <strong>Últimas líneas del log:</strong>
                    <div class="code">
                        ${logs.recentLines.join('<br>')}
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="footer">
                <p>🤖 Reporte generado automáticamente por Node.js Cron Service</p>
                <p><small>Para detener estos reportes, contacta al administrador del sistema.</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Función para enviar email
async function sendEmail(reportData) {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
        throw new Error('No se pudo crear el transporter de email');
    }
    
    const htmlContent = createEmailHTML(reportData);
    
    // Crear también versión texto plano
    const textContent = `
REPORTE AUTOMÁTICO DEL SISTEMA
==============================
Fecha: ${reportData.system.timestamp}
Servidor: ${reportData.system.hostname}

SISTEMA:
- Plataforma: ${reportData.system.platform}
- Uptime: ${Math.floor(reportData.system.uptime.system / 3600)}h ${Math.floor((reportData.system.uptime.system % 3600) / 60)}m
- Node.js: ${reportData.system.nodeVersion}

MEMORIA:
- Total: ${reportData.system.memory.total} MB
- Libre: ${reportData.system.memory.free} MB
- Proceso Node.js: ${reportData.system.memory.process.rss} MB RSS

CPU:
- Núcleos: ${reportData.system.cpu.count}
- Load Average: ${reportData.system.cpu.loadAverage.join(', ')}

${reportData.logs.exists ? `
LOGS:
- Líneas: ${reportData.logs.lines}
- Tamaño: ${Math.round(reportData.logs.size / 1024)} KB
- INFO: ${reportData.logs.counts.INFO}, ERRORES: ${reportData.logs.counts.ERROR}
` : ''}

Reporte generado automáticamente.
    `;
    
    const mailOptions = {
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to.join(', '),
        subject: EMAIL_CONFIG.subject,
        text: textContent,
        html: htmlContent
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        log(`Email enviado exitosamente: ${info.messageId}`);
        
        if (info.accepted && info.accepted.length > 0) {
            log(`Aceptado por: ${info.accepted.join(', ')}`);
        }
        
        if (info.rejected && info.rejected.length > 0) {
            log(`Rechazado por: ${info.rejected.join(', ')}`, 'WARN');
        }
        
        return info;
        
    } catch (error) {
        log(`Error enviando email: ${error.message}`, 'ERROR');
        throw error;
    }
}

// Función principal para generar y enviar reporte
async function generateAndSendReport() {
    try {
        log('=== GENERANDO REPORTE DEL SISTEMA ===');
        
        const reportData = generateSystemReport();
        log('Reporte generado correctamente');
        
        log('Enviando email...');
        await sendEmail(reportData);
        
        log('=== REPORTE ENVIADO EXITOSAMENTE ===');
        log('');
        
    } catch (error) {
        log(`ERROR en generateAndSendReport: ${error.message}`, 'ERROR');
        log(`Stack: ${error.stack}`, 'ERROR');
    }
}

// Configurar cron jobs para emails
function setupEmailCronJobs() {
    log('Configurando cron jobs para emails...');
    
    //Reporte diario
    const dailyReport = cron.schedule('35 7 * * *', async () => {
        log('Ejecutando reporte diario (7:35 AM)');
        await generateAndSendReport();
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    
    // Reporte semanal los lunes a las 9:00 AM
    const weeklyReport = cron.schedule('0 9 * * 1', async () => {
        log('Ejecutando reporte semanal (Lunes 9:00 AM)');
        await generateAndSendReport();
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    
    // Reporte de prueba cada hora (descomenta para testing)
    /*
    const testReport = cron.schedule('0 * * * *', async () => {
        log('Ejecutando reporte de prueba (cada hora)');
        await generateAndSendReport();
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    */
    
    log('Cron jobs de email configurados:');
    log('- Reporte diario: 8:00 AM');
    log('- Reporte semanal: Lunes 9:00 AM');
    
    return { dailyReport, weeklyReport };
}

// Función principal
async function main() {
    log('=== INICIANDO SERVICIO DE EMAIL CRON ===');
    
    // Verificar configuración de email
    if (EMAIL_CONFIG.gmail.auth.user === 'tu_email@gmail.com') {
        log('⚠️  ADVERTENCIA: Configura tu email en EMAIL_CONFIG antes de usar', 'WARN');
    }
    
    // Ejecutar una vez al inicio para probar
    log('Ejecutando prueba inicial...');
    await generateAndSendReport();
    
    // Configurar cron jobs
    const jobs = setupEmailCronJobs();
    
    log('Servicio de email iniciado. Presiona Ctrl+C para salir.');
    
    return jobs;
}

// Manejo de señales del sistema
process.on('SIGINT', () => {
    log('Recibida señal SIGINT, cerrando servicio de email...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Recibida señal SIGTERM, cerrando servicio de email...');
    process.exit(0);
});

// Ejecutar si es el archivo principal
if (process.argv[1] === currentFile) {
  main();
}
const emailScript = {
    generateAndSendReport,
    setupEmailCronJobs,
    sendEmail,
    createEmailHTML,
    getSystemInfo,
    log
};
export default emailScript