import 'dotenv/config'
import cron from 'node-cron'
import nodemailer from 'nodemailer'
import fs from 'fs-extra'
import path from 'path'
import moment from 'moment'
import archiver from 'archiver'
import os from 'os'
import { fileURLToPath } from 'url';
import { basename } from 'path';

const currentFile = fileURLToPath(import.meta.url);


const PASS = process.env.PASS
// Configuración de backup
const BACKUP_CONFIG = {
    sourceDirs: [
        './src',           // Código fuente
        './config',        // Configuraciones
        './logs',          // Logs importantes
        './data',          // Datos de aplicación
        // Agrega más directorios según necesites
    ],
    backupDir: './backups',
    maxBackups: 10,                    // Mantener solo los últimos 10 backups
    compressionLevel: 6,               // Nivel de compresión (0-9)
    excludePatterns: [                 // Patrones de archivos/carpetas a excluir
        'node_modules',
        '*.tmp',
        '*.log',
        '.git',
        '.DS_Store',
        'Thumbs.db'
    ]
};

// Configuración de email (misma que en email-script.js)
const EMAIL_CONFIG = {
    gmail: {
        service: 'gmail',
        auth: {
            user: 'clasesriwi@gmail.com',    // Cambia por tu email
            pass: PASS        // App Password de Google
        }
    },
    from: 'clasesriwi@gmail.com',
    to: ['ingecarrasquilla@email.com'],
    subjectSuccess: `✅ Backup Exitoso - ${moment().format('YYYY-MM-DD HH:mm')}`,
    subjectError: `❌ Error en Backup - ${moment().format('YYYY-MM-DD HH:mm')}`
};

// Configuración general
const CONFIG = {
    logDir: './logs',
    logFile: 'backup-cron.log'
};

// Asegurar directorios necesarios
fs.ensureDirSync(CONFIG.logDir);
fs.ensureDirSync(BACKUP_CONFIG.backupDir);

// Función de logging
function log(message, level = 'INFO') {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logMessage);
    
    const logPath = path.join(CONFIG.logDir, CONFIG.logFile);
    fs.appendFileSync(logPath, logMessage + '\n');
}

// Crear transporter de email
function createEmailTransporter() {
    try {
        const transporter = nodemailer.createTransporter(EMAIL_CONFIG.gmail);
        return transporter;
    } catch (error) {
        log(`Error creando transporter: ${error.message}`, 'ERROR');
        return null;
    }
}

// Función para verificar espacio disponible
function checkDiskSpace(requiredSpaceMB = 100) {
    try {
        const stats = fs.statSync(BACKUP_CONFIG.backupDir);
        const backupDirPath = path.resolve(BACKUP_CONFIG.backupDir);
        
        log(`Verificando espacio en disco para: ${backupDirPath}`);
        
        // Calcular tamaño total de los directorios a respaldar
        let totalSize = 0;
        BACKUP_CONFIG.sourceDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                totalSize += getFolderSize(dir);
            }
        });
        
        const totalSizeMB = Math.round(totalSize / 1024 / 1024);
        log(`Tamaño total a respaldar: ${totalSizeMB} MB`);
        
        // Simular verificación de espacio (en un caso real usarías statvfs o similar)
        const estimatedRequiredSpace = totalSizeMB * 1.5; // 50% más para compresión
        
        log(`Espacio estimado requerido: ${Math.round(estimatedRequiredSpace)} MB`);
        
        return {
            hasEnoughSpace: true, // Asumimos que hay espacio
            totalSizeMB,
            estimatedRequiredSpace
        };
        
    } catch (error) {
        log(`Error verificando espacio en disco: ${error.message}`, 'ERROR');
        return { hasEnoughSpace: false, error: error.message };
    }
}

// Función para calcular tamaño de carpeta
function getFolderSize(dirPath) {
    let totalSize = 0;
    
    try {
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                // Verificar si debemos excluir esta carpeta
                const shouldExclude = BACKUP_CONFIG.excludePatterns.some(pattern => {
                    if (pattern.includes('*')) {
                        // Patrón con wildcard
                        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                        return regex.test(item);
                    } else {
                        // Coincidencia exacta
                        return item === pattern;
                    }
                });
                
                if (!shouldExclude) {
                    totalSize += getFolderSize(itemPath);
                }
            } else {
                // Verificar si debemos excluir este archivo
                const shouldExclude = BACKUP_CONFIG.excludePatterns.some(pattern => {
                    if (pattern.includes('*')) {
                        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                        return regex.test(item);
                    } else {
                        return item === pattern;
                    }
                });
                
                if (!shouldExclude) {
                    totalSize += stats.size;
                }
            }
        });
        
    } catch (error) {
        log(`Error calculando tamaño de ${dirPath}: ${error.message}`, 'WARN');
    }
    
    return totalSize;
}

// Función principal de backup
async function performBackup() {
    const startTime = Date.now();
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const backupFileName = `backup_${timestamp}.zip`;
    const backupFilePath = path.join(BACKUP_CONFIG.backupDir, backupFileName);
    
    let backupStats = {
        startTime: new Date(),
        success: false,
        fileName: backupFileName,
        filePath: backupFilePath,
        fileSize: 0,
        duration: 0,
        filesCount: 0,
        dirsCount: 0,
        errors: []
    };
    
    try {
        log('=== INICIANDO BACKUP ===');
        log(`Archivo de destino: ${backupFileName}`);
        
        // Verificar espacio en disco
        const spaceCheck = checkDiskSpace();
        if (!spaceCheck.hasEnoughSpace) {
            throw new Error(`Espacio insuficiente en disco: ${spaceCheck.error || 'Espacio insuficiente'}`);
        }
        
        // Verificar que existan los directorios fuente
        const existingDirs = BACKUP_CONFIG.sourceDirs.filter(dir => {
            const exists = fs.existsSync(dir);
            if (!exists) {
                log(`Directorio no existe, saltando: ${dir}`, 'WARN');
                backupStats.errors.push(`Directorio no encontrado: ${dir}`);
            }
            return exists;
        });
        
        if (existingDirs.length === 0) {
            throw new Error('No se encontraron directorios válidos para respaldar');
        }
        
        log(`Directorios a respaldar: ${existingDirs.join(', ')}`);
        
        // Crear archivo ZIP
        const output = fs.createWriteStream(backupFilePath);
        const archive = archiver('zip', {
            zlib: { level: BACKUP_CONFIG.compressionLevel }
        });
        
        // Manejar eventos del archive
        output.on('close', () => {
            backupStats.fileSize = archive.pointer();
            log(`Backup completado: ${Math.round(backupStats.fileSize / 1024 / 1024)} MB`);
        });
        
        archive.on('error', (err) => {
            throw err;
        });
        
        archive.on('progress', (progress) => {
            backupStats.filesCount = progress.entries.processed;
        });
        
        // Conectar archive con el output
        archive.pipe(output);
        
        // Agregar directorios al archivo
        for (const sourceDir of existingDirs) {
            log(`Agregando directorio: ${sourceDir}`);
            
            // Función para filtrar archivos
            const filter = (filePath) => {
                const relativePath = path.relative(sourceDir, filePath);
                const fileName = path.basename(filePath);
                
                return !BACKUP_CONFIG.excludePatterns.some(pattern => {
                    if (pattern.includes('*')) {
                        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                        return regex.test(fileName) || regex.test(relativePath);
                    } else {
                        return fileName === pattern || relativePath.includes(pattern);
                    }
                });
            };
            
            // Agregar directorio con filtro
            archive.directory(sourceDir, path.basename(sourceDir), { filter });
            backupStats.dirsCount++;
        }
        
        // Finalizar el archivo
        await archive.finalize();
        
        // Esperar a que se complete la escritura
        await new Promise((resolve, reject) => {
            output.on('close', resolve);
            output.on('error', reject);
        });
        
        // Calcular estadísticas finales
        const endTime = Date.now();
        backupStats.duration = Math.round((endTime - startTime) / 1000);
        backupStats.success = true;
        backupStats.endTime = new Date();
        
        const fileSizeMB = Math.round(backupStats.fileSize / 1024 / 1024);
        
        log(`✅ Backup completado exitosamente en ${backupStats.duration} segundos`);
        log(`Archivo: ${backupFileName} (${fileSizeMB} MB)`);
        log(`Directorios: ${backupStats.dirsCount}, Archivos procesados: ${backupStats.filesCount}`);
        
        // Limpiar backups antiguos
        await cleanupOldBackups();
        
        // Enviar notificación de éxito
        await sendBackupNotification(backupStats, true);
        
        return backupStats;
        
    } catch (error) {
        const endTime = Date.now();
        backupStats.duration = Math.round((endTime - startTime) / 1000);
        backupStats.success = false;
        backupStats.error = error.message;
        backupStats.endTime = new Date();
        
        log(`❌ Error durante el backup: ${error.message}`, 'ERROR');
        log(`Stack: ${error.stack}`, 'ERROR');
        
        // Limpiar archivo parcial si existe
        try {
            if (fs.existsSync(backupFilePath)) {
                fs.removeSync(backupFilePath);
                log(`Archivo de backup parcial eliminado: ${backupFileName}`);
            }
        } catch (cleanupError) {
            log(`Error limpiando archivo parcial: ${cleanupError.message}`, 'WARN');
        }
        
        // Enviar notificación de error
        await sendBackupNotification(backupStats, false);
        
        throw error;
    }
}

// Función para limpiar backups antiguos
async function cleanupOldBackups() {
    try {
        log('Limpiando backups antiguos...');
        
        const backupFiles = fs.readdirSync(BACKUP_CONFIG.backupDir)
            .filter(file => file.startsWith('backup_') && file.endsWith('.zip'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_CONFIG.backupDir, file),
                mtime: fs.statSync(path.join(BACKUP_CONFIG.backupDir, file)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime); // Más recientes primero
        
        log(`Backups encontrados: ${backupFiles.length}`);
        
        if (backupFiles.length > BACKUP_CONFIG.maxBackups) {
            const filesToDelete = backupFiles.slice(BACKUP_CONFIG.maxBackups);
            
            for (const file of filesToDelete) {
                fs.removeSync(file.path);
                log(`Backup antiguo eliminado: ${file.name}`);
            }
            
            log(`${filesToDelete.length} backups antiguos eliminados`);
        } else {
            log('No hay backups antiguos para eliminar');
        }
        
        // Calcular espacio total usado por backups
        const totalSize = backupFiles
            .slice(0, BACKUP_CONFIG.maxBackups)
            .reduce((total, file) => {
                try {
                    return total + fs.statSync(file.path).size;
                } catch (error) {
                    return total;
                }
            }, 0);
        
        const totalSizeMB = Math.round(totalSize / 1024 / 1024);
        log(`Espacio total usado por backups: ${totalSizeMB} MB`);
        
    } catch (error) {
        log(`Error limpiando backups antiguos: ${error.message}`, 'ERROR');
    }
}

// Función para enviar notificación por email
async function sendBackupNotification(backupStats, success) {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
        log('No se pudo crear transporter, saltando notificación por email', 'WARN');
        return;
    }
    
    try {
        const subject = success ? EMAIL_CONFIG.subjectSuccess : EMAIL_CONFIG.subjectError;
        const htmlContent = createBackupEmailHTML(backupStats, success);
        const textContent = createBackupEmailText(backupStats, success);
        
        const mailOptions = {
            from: EMAIL_CONFIG.from,
            to: EMAIL_CONFIG.to.join(', '),
            subject: subject,
            text: textContent,
            html: htmlContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        log(`Notificación enviada: ${info.messageId}`);
        
    } catch (error) {
        log(`Error enviando notificación: ${error.message}`, 'ERROR');
    }
}

// Función para crear contenido HTML del email de backup
function createBackupEmailHTML(stats, success) {
    const statusIcon = success ? '✅' : '❌';
    const statusText = success ? 'EXITOSO' : 'FALLIDO';
    const statusColor = success ? '#28a745' : '#dc3545';
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Backup</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
            .section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #dee2e6; }
            .error-box { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${statusIcon} Backup ${statusText}</h1>
                <p>${stats.startTime.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>
            </div>
            
            <div class="section">
                <h3>📊 Detalles del Backup</h3>
                <div class="info-row">
                    <strong>Archivo:</strong>
                    <span>${stats.fileName}</span>
                </div>
                <div class="info-row">
                    <strong>Duración:</strong>
                    <span>${stats.duration} segundos</span>
                </div>
                ${success ? `
                <div class="info-row">
                    <strong>Tamaño:</strong>
                    <span>${Math.round(stats.fileSize / 1024 / 1024)} MB</span>
                </div>
                <div class="info-row">
                    <strong>Directorios:</strong>
                    <span>${stats.dirsCount}</span>
                </div>
                <div class="info-row">
                    <strong>Archivos:</strong>
                    <span>${stats.filesCount}</span>
                </div>
                ` : `
                <div class="error-box">
                    <strong>Error:</strong> ${stats.error || 'Error desconocido'}
                </div>
                `}
            </div>
            
            <div class="section">
                <h3>🗂️ Directorios Incluidos</h3>
                <ul>
                    ${BACKUP_CONFIG.sourceDirs.map(dir => `<li>${dir}</li>`).join('')}
                </ul>
            </div>
            
            ${stats.errors && stats.errors.length > 0 ? `
            <div class="section">
                <h3>⚠️ Advertencias</h3>
                <ul>
                    ${stats.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="footer">
                <p>🤖 Reporte generado automáticamente por Node.js Backup Service</p>
                <p><small>Servidor: ${os.hostname()} | ${new Date().toISOString()}</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Función para crear contenido de texto del email
function createBackupEmailText(stats, success) {
    const statusText = success ? 'EXITOSO' : 'FALLIDO';
    
    return `
BACKUP ${statusText}
===================
Fecha: ${stats.startTime.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
Servidor: ${os.hostname()}

DETALLES:
- Archivo: ${stats.fileName}
- Duración: ${stats.duration} segundos
${success ? `- Tamaño: ${Math.round(stats.fileSize / 1024 / 1024)} MB
- Directorios: ${stats.dirsCount}
- Archivos: ${stats.filesCount}` : `- Error: ${stats.error || 'Error desconocido'}`}

DIRECTORIOS INCLUIDOS:
${BACKUP_CONFIG.sourceDirs.map(dir => `- ${dir}`).join('\n')}

${stats.errors && stats.errors.length > 0 ? `
ADVERTENCIAS:
${stats.errors.map(error => `- ${error}`).join('\n')}
` : ''}

Reporte generado automáticamente.
    `;
}

// Configurar cron jobs para backup
function setupBackupCronJobs() {
    log('Configurando cron jobs para backup...');
    
    // Backup diario a las 2:00 AM
    const dailyBackup = cron.schedule('0 2 * * *', async () => {
        log('Ejecutando backup diario (2:00 AM)');
        try {
            await performBackup();
        } catch (error) {
            log(`Error en backup diario: ${error.message}`, 'ERROR');
        }
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    
    // Backup semanal los domingos a las 1:00 AM
    const weeklyBackup = cron.schedule('0 1 * * 0', async () => {
        log('Ejecutando backup semanal (Domingo 1:00 AM)');
        try {
            await performBackup();
        } catch (error) {
            log(`Error en backup semanal: ${error.message}`, 'ERROR');
        }
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    
    // Backup de prueba (descomenta para testing) - cada 30 minutos
    /*
    const testBackup = cron.schedule('* /30 * * * *', async () => {
        log('Ejecutando backup de prueba (cada 30 minutos)');
        try {
            await performBackup();
        } catch (error) {
            log(`Error en backup de prueba: ${error.message}`, 'ERROR');
        }
    }, {
        scheduled: true,
        timezone: "America/Bogota"
    });
    */
    
    log('Cron jobs de backup configurados:');
    log('- Backup diario: 2:00 AM');
    log('- Backup semanal: Domingo 1:00 AM');
    
    return { dailyBackup, weeklyBackup };
}

// Función principal
async function main() {
    log('=== INICIANDO SERVICIO DE BACKUP CRON ===');
    
    // Verificar configuración
    if (EMAIL_CONFIG.gmail.auth.user === 'tu_email@gmail.com') {
        log('⚠️  ADVERTENCIA: Configura tu email en EMAIL_CONFIG', 'WARN');
    }
    
    log(`Directorios fuente: ${BACKUP_CONFIG.sourceDirs.join(', ')}`);
    log(`Directorio de backup: ${path.resolve(BACKUP_CONFIG.backupDir)}`);
    log(`Máximo de backups: ${BACKUP_CONFIG.maxBackups}`);
    
    // Ejecutar backup inicial para probar
    log('Ejecutando backup de prueba inicial...');
    try {
        await performBackup();
    } catch (error) {
        log(`Error en backup inicial: ${error.message}`, 'ERROR');
    }
    
    // Configurar cron jobs
    const jobs = setupBackupCronJobs();
    
    log('Servicio de backup iniciado. Presiona Ctrl+C para salir.');
    
    return jobs;
}

// Manejo de señales del sistema
process.on('SIGINT', () => {
    log('Recibida señal SIGINT, cerrando servicio de backup...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('Recibida señal SIGTERM, cerrando servicio de backup...');
    process.exit(0);
});

// Ejecutar si es el archivo principal
if (process.argv[1] === currentFile) {
  main();
}

const backupScript = {
  performBackup,
  setupBackupCronJobs,
  checkDiskSpace,
  cleanupOldBackups,
  log,
  BACKUP_CONFIG
};

export default backupScript