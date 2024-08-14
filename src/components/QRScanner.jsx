import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import axios from "axios";

const QRScanner = () => {

  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);


  const [scannedResult, setScannedResult] = useState("");
  const [fetchData, setFetchedData] = useState(null);


  const onScanSuccess = (result) => {

    console.log(result);

    setScannedResult(result?.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://railway-qbx4.onrender.com/vendor/fetchVendorDataByQR`,
          { qrcode: scannedResult }
        );
        if (response.data) {
          setFetchedData(response.data.user);
          console.log("data", response.data.user);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (scannedResult) {
      fetchData();
    }
  }, [scannedResult]);

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {

      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        
        preferredCamera: "environment",
     
        highlightScanRegion: true,
       
        highlightCodeOutline: true,
       
        overlay: qrBoxEl.current || undefined,
      });


      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

 
    return () => {
      if (scanner.current) {
        scanner.current.stop();
      }
    };
  }, []);


  useEffect(() => {
    if (!qrOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
    }
  }, [qrOn]);

  useEffect(() => {
    console.log("new", fetchData);
  }, [fetchData]);

  return (
    <>
      <div className="qr-reader">

        <video ref={videoEl}></video>
        <div ref={qrBoxEl} className="qr-box">
          <img
            src={QrFrame}
            alt="Qr Frame"
            width={256}
            height={256}
            className="qr-frame"
          />
        </div>


        {scannedResult && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99999,
              color: "white",
            }}
          >
            <p>Scanned Result: {scannedResult}</p>
        
          </div>
        )}
      </div>
      {fetchData && (
        <div className="">
          <h2>Fetched Data:</h2>
          <p><strong>First Name:</strong> {fetchData.fname}</p>
          <p><strong>Middle Name:</strong> {fetchData.mname}</p>
          <p><strong>Last Name:</strong> {fetchData.lname}</p>
          <p><strong>Date of Birth:</strong> {new Date(fetchData.dob).toLocaleDateString()}</p>
          <p><strong>Mobile:</strong> {fetchData.mobile}</p>
          <p><strong>Location of Stall:</strong> {fetchData.locationOfStall}</p>
          <p><strong>Contractor ID:</strong> {fetchData.Contractor}</p>
          <p><strong>Aadhar:</strong> {fetchData.aadhar}</p>
          <p><strong>Start Date:</strong> {new Date(fetchData.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(fetchData.endDate).toLocaleDateString()}</p>
          <p><strong>Medical Validity From:</strong> {new Date(fetchData.medicalValidityDateFrom).toLocaleDateString()}</p>
          <p><strong>Medical Validity To:</strong> {new Date(fetchData.medicalValidityDateTo).toLocaleDateString()}</p>
          <p><strong>Police Verification From:</strong> {new Date(fetchData.policeVarificationDateFrom).toLocaleDateString()}</p>
          <p><strong>Police Verification To:</strong> {new Date(fetchData.policeVarificationDateTo).toLocaleDateString()}</p>
          <p>
            <strong>Aadhar Card:</strong>
            <a href={fetchData.aadharCardImg} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </p>
          <p>
            <strong>Medical Validity Document:</strong>
            <a href={fetchData.madicalValidityDocument} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </p>
          <p>
            <strong>Police Verification Document:</strong>
            <a href={fetchData.policeVarificationDocument} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </p>
          <p>
            <strong>Profile Picture:</strong>
            <img src={fetchData.profilePic} alt="Profile" style={{ width: "100px", height: "100px" }} />
          </p>
        </div>
      )}
    </>
  );
};

export default QRScanner;
