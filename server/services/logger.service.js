const fs = require("fs");
const path = require("path");

const logDir = path.join(process.cwd(), "logs", "application");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, "app.log");
const errorLogFile = path.join(logDir, `errors-${new Date().toISOString().split("T")[0]}.log`);

class Logger {
    static log(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const callerInfo = this.getCallerInfo();

        let errorDetails = null;

        // If meta is an Error or contains an error
        if (meta instanceof Error) {
            errorDetails = this.formatError(meta);
            meta = { error: errorDetails };
        } else if (meta.error instanceof Error) {
            errorDetails = this.formatError(meta.error);
            meta.error = errorDetails;
        }

        // Compact log entry (for app.log)
        const logEntry = {
            timestamp,
            level,
            function: callerInfo.functionName,
            file: callerInfo.fileName,
            line: callerInfo.line,
            message,
            ...(meta || {}),
        };

        const serialized = JSON.stringify(logEntry);

        // Print to console
        if (level === "error") {
            console.error(JSON.parse(serialized));
        } else {
            console.log(JSON.parse(serialized));
        }

        // Save to main log file
        fs.appendFile(logFile, serialized + "\n", (err) => {
            if (err) console.error("Logger write error:", err);
        });

        // Save full error details to error log file
        if (level === "error" && errorDetails) {
            const fullErrorLog = [
                `----- ${timestamp} -----`,
                `Level: ${level}`,
                `Message: ${message}`,
                `Function: ${callerInfo.functionName}`,
                `File: ${callerInfo.fileName}:${callerInfo.line}`,
                `Error Name: ${errorDetails.name}`,
                `Error Message: ${errorDetails.message}`,
                `Stack Trace:\n${errorDetails.stack}`,
                `Meta: ${JSON.stringify(meta, null, 2)}`,
                "--------------------------\n",
            ].join("\n");

            fs.appendFile(errorLogFile, fullErrorLog, (err) => {
                if (err) console.error("Error log write failed:", err);
            });
        }
    }

    static info(message, meta = {}) {
        this.log("info", message, meta);
    }

    static warn(message, meta = {}) {
        this.log("warn", message, meta);
    }

    static error(message, meta = {}) {
        this.log("error", message, meta);
    }

    static debug(message, meta = {}) {
        this.log("debug", message, meta);
    }

    static formatError(err) {
        return {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
    }

    static getCallerInfo() {
        const error = new Error();
        const stackLines = error.stack.split("\n");
        const callerLine = stackLines[3] || "";
        const match = callerLine.match(/at (.*?) \((.*?):(\d+):(\d+)\)/);

        if (match) {
            return {
                functionName: match[1],
                fileName: path.basename(match[2]),
                line: match[3],
                column: match[4],
            };
        }
        return { functionName: "unknown", fileName: "unknown" };
    }
}

module.exports = Logger;