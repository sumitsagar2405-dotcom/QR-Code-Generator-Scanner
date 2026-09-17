// herer we write js
let container = document.querySelector(".container");
let toggleBtn = container.querySelector(".toggle-box input");
let qrCodeGeneratorBox = container.querySelector(".qr-code-generator-box");
let qrCodeScannerBox = container.querySelector(".qr-code-scanner-box");
let userQrInput = qrCodeGeneratorBox.querySelector(".qr-code-input");
let generateBtn = qrCodeGeneratorBox.querySelector(".generate-btn");
let qrBox = qrCodeGeneratorBox.querySelector(".qr-code-box");
let qrCode = qrBox.querySelector(".qr-code img");
let qrScanValue = qrCodeScannerBox.querySelector(".qr-scan-value");
let copyBtn = qrCodeScannerBox.querySelector(".copy-btn");
let qrScanner = qrCodeScannerBox.querySelector("#preview");

let scanner = null;


// add event listener to the generate button
generateBtn.addEventListener("click", ()=>{
    if(userQrInput.value !=""){

        // to show qr by slid
        qrBox.style.display = "block"
        const url =`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userQrInput.value}`;
        qrCode.src = url;
    }else{
        alert("Please enter text or URL in imput field");
    }
})


toggleBtn.addEventListener("click",()=>{
    if(toggleBtn.checked == true){
        // hide the QR code genrator box and display the qr code scanneer
        qrCodeGeneratorBox.style.display = "none";
        qrCodeScannerBox.style.display = "block";
        // start scanning
        startScan();
    }else{
        // hide the QR code scanner box and display the qr code generator
        qrCodeGeneratorBox.style.display = "block";
        qrCodeScannerBox.style.display = "none";

        // check if the user field is empty
        if(userQrInput.value == ""){
            qrBox.style.display = "none";
        }
        // to stop the qr code scanner
        if(scanner !== ""){
            scanner.stop().then(()=>{
                alert("Camera scanning have stopped.");
                qrScanner.srcObject = null; // deactivate camera
            })
        }
        qrCodeScannerBox.style.display = "none";

    }
})




// definig start function to start scanning
let startScan =()=>{
    scanner = new Instascan.Scanner({ 
        video: qrScanner,
        mirror:true 
    });

    // to get the available camera
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          alert('No cameras found.');
        }
      }).catch(function (e) {
        alert(e);
      });


    // add event listener to the scanner handle scan results
    scanner.addListener('scan', function (content) {
        // display the scan reuslt in the scan value input field
        qrScanValue.value = content;
    });

}
// add event listner to the copy button
copyBtn.addEventListener("click", ()=>{
    
    navigator.clipboard.writeText(qrScanValue.value);
})