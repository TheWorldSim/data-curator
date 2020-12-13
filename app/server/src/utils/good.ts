import PRIVATE_SERVER_CONFIG from "../private_server_config";

const options = {
    ops: {
        // Once per minute
        interval: 60000,
    },
    reporters: {
        console_reporter: [
            {
                module: "good-squeeze",
                name: "Squeeze",
                args: [{ log: "*", request: "*", response: "*", error: "*"}],
            },
            {
                module: "good-console",
            },
            "stdout",
        ],
        requests_file_reporter: [
            {
                module: "good-squeeze",
                name: "Squeeze",
                args: [{ log: "*", request: "*", response: "*", error: "*"}],
            },
            {
                module: "good-console",
                args: [{ color: false }]
            },
            {
                module: "rotating-file-stream",
                args: [
                    PRIVATE_SERVER_CONFIG.LOG_APP_SERVER_DIRECTORY + "web_server.log", {
                    size:     "10M",  // rotate every 10 MegaBytes written
                    interval: "14d",  // rotate every other week
                    compress: "gzip", // compress rotated files
                    maxSize: "200M",  // only keep 200 MegaBytes of files
                }]
            },
        ],
        ops_file_reporter: [
            {
                module: "good-squeeze",
                name: "Squeeze",
                args: [{ ops: "*" }]
            },
            {
                module: "good-squeeze",
                name: "SafeJson"
            },
            {
                module: "rotating-file-stream",
                args: [
                    PRIVATE_SERVER_CONFIG.LOG_APP_SERVER_DIRECTORY + "web_server_ops.log", {
                    size:     "10M",  // rotate every 10 MegaBytes written
                    interval: "14d",  // rotate every other week
                    compress: "gzip", // compress rotated files
                    maxSize: "200M",  // only keep 200 MegaBytes of files
                }]
            },
        ],
        // HTTP_reporter: [
        //     {
        //         module: "good-squeeze",
        //         name: "Squeeze",
        //         args: [{ error: "*" }]
        //     },
        //     {
        //         module: "good-http",
        //         args: ["http://production-logs:3001", {
        //             wreck: {
        //                 headers: { "x-api-key": 12345 }
        //             }
        //         }]
        //     },
        // ]
    },
};

export default options;
