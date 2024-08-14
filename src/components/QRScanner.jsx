import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";
import axios from "axios";
import "./QRScanner.css"; // Import the CSS file

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

    // Stop the scanner after a successful scan
    if (scanner.current) {
      scanner.current.stop();
    }
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

  const onScanFail = (err) => {
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
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and reload."
      );
    }
  }, [qrOn]);

  useEffect(() => {
    console.log("new", fetchData);
  }, [fetchData]);

  return (
    <div className="qr-scanner-container">
      <div className="qr-reader">
        <video ref={videoEl} className="qr-video"></video>
        <div ref={qrBoxEl} className="qr-box">
          <img
            src={QrFrame}
            alt="Qr Frame"
            className="qr-frame"
          />
        </div>

        {scannedResult && (
          <div className="scanned-result">
            <p>Scanned Result: {scannedResult}</p>
          </div>
        )}
      </div>
      {fetchData && (
        <div className="fetched-data">
          <h2>Fetched Data</h2>
          <div className="data-item profile-pic-container" style={{flexDirection:"column"}}>
              <strong>Profile Picture:</strong>
              <img src={fetchData.profilePic} alt="Profile" className="profile-pic" />
            </div>
          <div className="data-grid">
            <div className="data-item">
              <strong>First Name:</strong> {fetchData.fname}
            </div>
            <div className="data-item">
              <strong>Middle Name:</strong> {fetchData.mname}
            </div>
            <div className="data-item">
              <strong>Last Name:</strong> {fetchData.lname}
            </div>
            <div className="data-item">
              <strong>Date of Birth:</strong> {new Date(fetchData.dob).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Mobile:</strong> {fetchData.mobile}
            </div>
            <div className="data-item">
              <strong>Location of Stall:</strong> {fetchData.locationOfStall}
            </div>
            <div className="data-item">
              <strong>Contractor ID:</strong> {fetchData.Contractor}
            </div>
            <div className="data-item">
              <strong>Aadhar:</strong> {fetchData.aadhar}
            </div>
            <div className="data-item">
              <strong>Start Date:</strong> {new Date(fetchData.startDate).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>End Date:</strong> {new Date(fetchData.endDate).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Medical Validity From:</strong> {new Date(fetchData.medicalValidityDateFrom).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Medical Validity To:</strong> {new Date(fetchData.medicalValidityDateTo).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Police Verification From:</strong> {new Date(fetchData.policeVarificationDateFrom).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Police Verification To:</strong> {new Date(fetchData.policeVarificationDateTo).toLocaleDateString()}
            </div>
            <div className="data-item">
              <strong>Aadhar Card:</strong>
              <a href={fetchData.aadharCardImg} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </div>
            <div className="data-item">
              <strong>Medical Validity Document:</strong>
              <a href={fetchData.madicalValidityDocument} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </div>
            <div className="data-item">
              <strong>Police Verification Document:</strong>
              <a href={fetchData.policeVarificationDocument} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
