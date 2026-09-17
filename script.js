// ==========================================
// SELECT ELEMENTS
// ==========================================

const container = document.querySelector(".container");

const toggleBtn = container.querySelector(".toggle-box input");

const qrCodeGeneratorBox = container.querySelector(
    ".qr-code-generator-box"
);

const qrCodeScannerBox = container.querySelector(
    ".qr-code-scanner-box"
);

const userQrInput = container.querySelector(
    ".qr-code-input"
);

const generateBtn = container.querySelector(
    ".generate-btn"
);

const qrBox = container.querySelector(
    ".qr-code-box"
);

const qrCode = qrBox.querySelector(
    ".qr-code img"
);

const qrScanValue = container.querySelector(
    ".qr-scan-value"
);

const copyBtn = container.querySelector(
    ".copy-btn"
);


// ==========================================
// SCANNER VARIABLES
// ==========================================

let scanner = null;
let scannerRunning = false;


// ==========================================
// QR CODE GENERATOR
// ==========================================

generateBtn.addEventListener("click", function () {

    const value = userQrInput.value.trim();

    if (value === "") {
        alert("Please enter text or URL in input field.");
        return;
    }

    // Encode the text/URL
    const encodedValue = encodeURIComponent(value);

    // QR Server API
    const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=150x150&data=" +
        encodedValue;

    // Set QR image
    qrCode.src = qrUrl;

    // Show QR box
    qrBox.style.display = "block";
});


// ==========================================
// TOGGLE GENERATOR / SCANNER
// ==========================================

toggleBtn.addEventListener("change", function () {

    console.log("Toggle changed:", toggleBtn.checked);

    if (toggleBtn.checked === true) {

        // ==================================
        // SHOW SCANNER
        // ==================================

        qrCodeGeneratorBox.style.display = "none";

        qrCodeScannerBox.style.display = "block";

        console.log("Scanner box displayed");

        // Start scanner
        startScanner();

    } else {

        // ==================================
        // SHOW GENERATOR
        // ==================================

        stopScanner();

        qrCodeScannerBox.style.display = "none";

        qrCodeGeneratorBox.style.display = "block";

        console.log("Generator box displayed");

        // Hide QR box if input is empty
        if (userQrInput.value.trim() === "") {
            qrBox.style.display = "none";
        }
    }
});


// ==========================================
// START SCANNER
// ==========================================

async function startScanner() {

    // Check library
    if (typeof Html5Qrcode === "undefined") {

        console.error(
            "Html5Qrcode library is not loaded."
        );

        alert(
            "QR scanner library is not loaded. " +
            "Please check your HTML script link."
        );

        return;
    }


    // Don't create another scanner
    if (scannerRunning) {
        return;
    }


    try {

        console.log("Creating QR scanner...");

        // Create scanner
        scanner = new Html5Qrcode("preview");


        console.log("Starting camera...");

        // Start rear camera
        await scanner.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 180,
                    height: 180
                }
            },

            function (decodedText) {

                // ==================================
                // QR CODE FOUND
                // ==================================

                console.log(
                    "QR Code detected:",
                    decodedText
                );

                qrScanValue.value = decodedText;
            },

            function (errorMessage) {

                // QR not detected yet.
                // Do NOT show alert here.
            }
        );


        scannerRunning = true;

        console.log("Camera started successfully.");

    } catch (error) {

        console.error(
            "Could not start camera:",
            error
        );

        scannerRunning = false;

        if (scanner) {

            try {
                await scanner.clear();
            } catch (e) {
                console.error(e);
            }

        }

        scanner = null;

        alert(
            "Camera could not be started.\n\n" +
            "Please allow camera permission and use " +
            "localhost or HTTPS."
        );
    }
}


// ==========================================
// STOP SCANNER
// ==========================================

async function stopScanner() {

    if (!scanner) {
        return;
    }

    console.log("Stopping scanner...");

    try {

        if (scannerRunning) {
            await scanner.stop();
        }

        await scanner.clear();

    } catch (error) {

        console.error(
            "Error stopping scanner:",
            error
        );

    }

    scanner = null;
    scannerRunning = false;

    console.log("Scanner stopped.");
}


// ==========================================
// COPY BUTTON
// ==========================================

copyBtn.addEventListener("click", async function () {

    const value = qrScanValue.value.trim();

    if (value === "") {

        alert(
            "There is no QR code value to copy."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(value);

        alert(
            "QR code value copied to clipboard."
        );

    } catch (error) {

        console.error(
            "Clipboard error:",
            error
        );

        // Fallback
        qrScanValue.select();

        document.execCommand("copy");

        alert(
            "QR code value copied to clipboard."
        );
    }
});

