import fs from 'fs-extra'
import path from 'path'
import moment from 'moment'
import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);

// Importar nuestros módulos
import testScript from './test-script.js'
import emailScript from './email-script.js'
import backupScript from './backup-script.js'


// Configuración principal
const CONFIG = {
    logDir: './logs',
    mainLogFile: 'app.log',
    services: {
        test: true,      // Script de prueba
        email: true,     // Servicio de email
        backup: true     // Servicio de backup
    }
};

// Asegurar directorio de logs
fs.ensureDirSync(CONFIG.logDir);

// Función de logging principal
function mainLog(message, level = 'INFO') {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMessage = `[${timestamp}] [MAIN] [${level}] ${message}`;
    
    console.log(logMessage);
    
    const logPath = path.join(CONFIG.logDir, CONFIG.mainLogFile);
    fs.appendFileSync(logPath, logMessage + '\n');
}

// Función para verificar requisitos del sistema
function checkSystemRequirements() {
    mainLog('Verificando requisitos del sistema...');
    
    const requirements = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        hasWriteAccess: true,
        directories: {}
    };
    
    // Verificar Node.js version
    const nodeVersionNum = parseFloat(process.version.substring(1));
    if (nodeVersionNum < 14) {
        mainLog(`⚠️  Advertencia: Node.js ${process.version} detectado. Se recomienda v14 o superior`, 'WARN');
    } else {
        mainLog(`✅ Node.js ${process.version} - OK`);
    }
    
    // Verificar acceso de escritura a directorios importantes
    const dirsToCheck = ['./logs', './backups'];
    
    dirsToCheck.forEach(dir => {
        try {
            fs.ensureDirSync(dir);
            
            // Probar escritura
            const testFile = path.join(dir, 'write_test.tmp');
            fs.writeFileSync(testFile, 'test');
            fs.removeSync(testFile);
            
            requirements.directories[dir] = 'OK';
            mainLog(`✅ Acceso de escritura a ${dir} - OK`);
            
        } catch (error) {
            requirements.directories[dir] = `ERROR: ${error.message}`;
            mainLog(`❌ Error con directorio ${dir}: ${error.message}`, 'ERROR');
            requirements.hasWriteAccess = false;
        }
    });
    
    return requirements;
}

// Función para generar reporte de estado
function generateStatusReport() {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    return {
        timestamp: new Date().toISOString(),
        uptime: {
            seconds: Math.floor(uptime),
            formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
        },
        memory: {
            rss: Math.round(memUsage.rss / 1024 / 1024), // MB
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024)
        },
        cpu: process.cpuUsage(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: `${process.platform} ${process.arch}`
    };
}

// Función para manejar errores no capturados
function setupErrorHandlers() {
    process.on('uncaughtException', (error) => {
        mainLog(`❌ ERROR NO CAPTURADO: ${error.message}`, 'ERROR');
        mainLog(`Stack: ${error.stack}`, 'ERROR');
        
        // No terminar el proceso inmediatamente, permitir cleanup
        setTimeout(() => {
            mainLog('Terminando aplicación debido a error no capturado...', 'ERROR');
            process.exit(1);
        }, 1000);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        mainLog(`❌ PROMISE RECHAZADO SIN MANEJAR: ${reason}`, 'ERROR');
        mainLog(`Promise: ${promise}`, 'ERROR');
    });
    
    process.on('SIGINT', () => {
        mainLog('🛑 Recibida señal SIGINT (Ctrl+C)');
        shutdown();
    });
    
    process.on('SIGTERM', () => {
        mainLog('🛑 Recibida señal SIGTERM');
        shutdown();
    });
    
    mainLog('Manejadores de error configurados');
}

// Función de shutdown limpio
function shutdown() {
    mainLog('=== INICIANDO SHUTDOWN LIMPIO ===');
    
    // Generar reporte final
    const finalReport = generateStatusReport();
    mainLog(`Uptime final: ${finalReport.uptime.formatted}`);
    mainLog(`Memoria final: ${finalReport.memory.rss} MB RSS`);
    
    // Guardar reporte de shutdown
    try {
        const shutdownReport = {
            shutdownTime: new Date().toISOString(),
            reason: 'Normal shutdown',
            finalStats: finalReport
        };
        
        const reportPath = path.join(CONFIG.logDir, `shutdown-${moment().format('YYYY-MM-DD-HH-mm-ss')}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(shutdownReport, null, 2));
        mainLog(`Reporte de shutdown guardado: ${reportPath}`);
        
    } catch (error) {
        mainLog(`Error guardando reporte de shutdown: ${error.message}`, 'ERROR');
    }
    
    mainLog('=== SHUTDOWN COMPLETADO ===');
    process.exit(0);
}

// Función para mostrar banner de inicio
function showStartupBanner() {
    const banner = `
╔═══════════════════════════════════════════════════╗
║              NODE.JS CRON SERVICES                ║
║                                                   ║
║  🕐 Sistema de tareas programadas                 ║
║  📧 Reportes automáticos por email               ║
║  💾 Backups automáticos                          ║
║  📊 Monitoreo del sistema                        ║
║                                                   ║
║  Versión: 1.0.0                                  ║
║  Node.js: ${process.version.padEnd(8)}                          ║
╚═══════════════════════════════════════════════════╝
    `;
    
    console.log(banner);
    mainLog('=== APLICACIÓN INICIADA ===');
}

// Función principal para inicializar servicios
async function initializeServices() {
    const activeServices = {};
    
    try {
        // Inicializar servicio de prueba
        if (CONFIG.services.test) {
            mainLog('Inicializando servicio de prueba...');
            activeServices.test = testScript.setupCronJobs();
            mainLog('✅ Servicio de prueba iniciado');
        }
        
        // Inicializar servicio de email
        if (CONFIG.services.email) {
            mainLog('Inicializando servicio de email...');
            activeServices.email = emailScript.setupEmailCronJobs();
            mainLog('✅ Servicio de email iniciado');
        }
        
        // Inicializar servicio de backup
        if (CONFIG.services.backup) {
            mainLog('Inicializando servicio de backup...');
            activeServices.backup = backupScript.setupBackupCronJobs();
            mainLog('✅ Servicio de backup iniciado');
        }
        
        return activeServices;
        
    } catch (error) {
        mainLog(`❌ Error inicializando servicios: ${error.message}`, 'ERROR');
        throw error;
    }
}

// Función para monitorear servicios
function startServiceMonitoring() {
    // Reporte de estado cada hora
    const statusReportInterval = setInterval(() => {
        try {
            const report = generateStatusReport();
            mainLog(`📊 Status - Uptime: ${report.uptime.formatted}, RAM: ${report.memory.rss}MB`);
            
            // Limpiar logs antiguos cada 6 horas
            if (Math.floor(report.uptime.seconds / 3600) % 6 === 0) {
                cleanupOldLogs();
            }
            
        } catch (error) {
            mainLog(`Error en monitoreo: ${error.message}`, 'ERROR');
        }
    }, 60 * 60 * 1000); // Cada hora
    
    // Reporte breve cada 10 minutos (para desarrollo/debug)
    const briefReportInterval = setInterval(() => {
        try {
            const report = generateStatusReport();
            mainLog(`⚡ Brief - RAM: ${report.memory.rss}MB, Uptime: ${Math.floor(report.uptime.seconds / 60)}min`);
        } catch (error) {
            mainLog(`Error en reporte breve: ${error.message}`, 'WARN');
        }
    }, 10 * 60 * 1000); // Cada 10 minutos
    
    return { statusReportInterval, briefReportInterval };
}

// Función para limpiar logs antiguos
function cleanupOldLogs() {
    try {
        mainLog('Limpiando logs antiguos...');
        
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días
        const now = Date.now();
        let cleanedCount = 0;
        
        const logFiles = fs.readdirSync(CONFIG.logDir);
        
        logFiles.forEach(file => {
            const filePath = path.join(CONFIG.logDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                // No eliminar el log principal actual
                if (file !== CONFIG.mainLogFile) {
                    fs.removeSync(filePath);
                    cleanedCount++;
                    mainLog(`Log antiguo eliminado: ${file}`);
                }
            }
        });
        
        if (cleanedCount > 0) {
            mainLog(`${cleanedCount} logs antiguos eliminados`);
        } else {
            mainLog('No hay logs antiguos para limpiar');
        }
        
    } catch (error) {
        mainLog(`Error limpiando logs: ${error.message}`, 'ERROR');
    }
}

// Función para crear configuración inicial si no existe
function createInitialConfig() {
    const configPath = './config.json';
    
    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            app: {
                name: "Node.js Cron Services",
                version: "1.0.0",
                timezone: "America/Bogota"
            },
            services: CONFIG.services,
            email: {
                enabled: true,
                provider: "gmail",
                from: "tu_email@gmail.com",
                to: ["destinatario@email.com"],
                schedules: {
                    daily: "0 8 * * *",
                    weekly: "0 9 * * 1"
                }
            },
            backup: {
                enabled: true,
                sourceDirs: ["./src", "./config", "./logs"],
                backupDir: "./backups",
                maxBackups: 10,
                schedules: {
                    daily: "0 2 * * *",
                    weekly: "0 1 * * 0"
                }
            },
            monitoring: {
                statusReportInterval: 3600, // segundos
                briefReportInterval: 600,   // segundos
                logRetentionDays: 30
            }
        };
        
        try {
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            mainLog(`✅ Archivo de configuración creado: ${configPath}`);
            mainLog('⚠️  Recuerda editar la configuración antes de usar en producción', 'WARN');
        } catch (error) {
            mainLog(`Error creando configuración: ${error.message}`, 'WARN');
        }
    }
}

// Función para mostrar resumen de configuración
function showConfigurationSummary() {
    mainLog('=== RESUMEN DE CONFIGURACIÓN ===');
    mainLog(`Directorio de logs: ${path.resolve(CONFIG.logDir)}`);
    mainLog(`Servicios activos: ${Object.keys(CONFIG.services).filter(s => CONFIG.services[s]).join(', ')}`);
    mainLog(`Timezone: America/Bogota`);
    mainLog(`PID del proceso: ${process.pid}`);
    mainLog('=== FIN RESUMEN ===');
}

// Función principal
async function main() {
    try {
        // Mostrar banner
        showStartupBanner();
        
        // Crear configuración inicial
        createInitialConfig();
        
        // Configurar manejadores de error
        setupErrorHandlers();
        
        // Verificar requisitos del sistema
        const sysCheck = checkSystemRequirements();
        if (!sysCheck.hasWriteAccess) {
            throw new Error('No se puede acceder a los directorios necesarios');
        }
        
        // Mostrar resumen de configuración
        showConfigurationSummary();
        
        // Inicializar servicios
        mainLog('Inicializando todos los servicios...');
        const services = await initializeServices();
        
        // Iniciar monitoreo
        const monitoring = startServiceMonitoring();
        
        // Log de inicio exitoso
        const startupReport = generateStatusReport();
        mainLog('🚀 TODOS LOS SERVICIOS INICIADOS CORRECTAMENTE');
        mainLog(`Memoria inicial: ${startupReport.memory.rss} MB`);
        mainLog(`Servicios activos: ${Object.keys(services).length}`);
        mainLog('Presiona Ctrl+C para detener todos los servicios');
        
        // Ejecutar una tarea de prueba inicial
        mainLog('Ejecutando prueba inicial de todos los servicios...');
        
        if (CONFIG.services.test) {
            testScript.executeTask();
        }
        
        if (CONFIG.services.email) {
            // No ejecutar email en prueba inicial para evitar spam
            mainLog('Servicio de email configurado (no ejecutado en prueba)');
        }
        
        if (CONFIG.services.backup) {
            // No ejecutar backup en prueba inicial para evitar archivos innecesarios
            mainLog('Servicio de backup configurado (no ejecutado en prueba)');
        }
        
        // Mantener la aplicación viva
        return { services, monitoring };
        
    } catch (error) {
        mainLog(`❌ ERROR FATAL en main(): ${error.message}`, 'ERROR');
        mainLog(`Stack: ${error.stack}`, 'ERROR');
        process.exit(1);
    }
}

// Función para mostrar ayuda
function showHelp() {
    console.log(`
Uso: node app.js [opciones]

Opciones:
  --help                Mostrar esta ayuda
  --test               Ejecutar solo el servicio de prueba
  --email              Ejecutar solo el servicio de email  
  --backup             Ejecutar solo el servicio de backup
  --no-test            Desactivar servicio de prueba
  --no-email           Desactivar servicio de email
  --no-backup          Desactivar servicio de backup
  --status             Mostrar estado y salir
  --config             Crear archivo de configuración y salir

Ejemplos:
  node app.js                    # Ejecutar todos los servicios
  node app.js --test            # Solo servicio de prueba
  node app.js --no-backup       # Todos excepto backup
  node app.js --status          # Mostrar estado

Para más información, revisa el archivo README.md
    `);
}

// Procesar argumentos de línea de comandos
function processCommandLineArgs() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help')) {
        showHelp();
        process.exit(0);
    }
    
    if (args.includes('--config')) {
        createInitialConfig();
        console.log('Archivo de configuración creado. Edítalo según tus necesidades.');
        process.exit(0);
    }
    
    if (args.includes('--status')) {
        const report = generateStatusReport();
        console.log('\n📊 Estado actual:');
        console.log(`- Uptime: ${report.uptime.formatted}`);
        console.log(`- Memoria: ${report.memory.rss} MB`);
        console.log(`- PID: ${report.pid}`);
        console.log(`- Node.js: ${report.nodeVersion}`);
        console.log(`- Plataforma: ${report.platform}\n`);
        process.exit(0);
    }
    
    // Configurar servicios basado en argumentos
    if (args.includes('--test')) {
        CONFIG.services = { test: true, email: false, backup: false };
    } else if (args.includes('--email')) {
        CONFIG.services = { test: false, email: true, backup: false };
    } else if (args.includes('--backup')) {
        CONFIG.services = { test: false, email: false, backup: true };
    } else {
        // Procesar flags de desactivación
        if (args.includes('--no-test')) CONFIG.services.test = false;
        if (args.includes('--no-email')) CONFIG.services.email = false;
        if (args.includes('--no-backup')) CONFIG.services.backup = false;
    }
}

// Ejecutar aplicación si es el archivo principal
if (process.argv[1] === currentFile) {
  processCommandLineArgs();
  main();
}
const app = {
    main,
    generateStatusReport,
    showConfigurationSummary,
    mainLog,
    CONFIG
};
export default app 