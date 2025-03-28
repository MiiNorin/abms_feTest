import { useEffect, useState } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const VerifyNewResident = () => {
  const [email, setEmail] = useState("");
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState("");
  const [role, setRole] = useState("Rentor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [images, setImages] = useState([]);
  const [verificationFormName, setVerificationFormName] = useState("");
  const [verificationFormType, setVerificationFormType] = useState(1);
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);


  useEffect(() => {
    axios.get("http://localhost:8080/apartment/getAll")
      .then(response => {
        if (response.data.data) {
          setApartments(response.data.data);
        }
      })
      .catch(error => console.error("Error fetching apartments:", error));
  }, []);

  const handleFileChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !selectedApartment || !role || images.length === 0 || !verificationFormName) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("apartmentName", selectedApartment);
    formData.append("role", role);
    formData.append("verificationFormName", verificationFormName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("verificationFormType", verificationFormType);
    formData.append("contractStartDate", contractStartDate ? contractStartDate.format("YYYY-MM-DDTHH:mm:ss") : null);
    formData.append("contractEndDate", contractEndDate ? contractEndDate.format("YYYY-MM-DDTHH:mm:ss") : null);

    images.forEach((image) => formData.append("imageFile", image));

    try {
      await axios.post("http://localhost:8080/user/verify_user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Xác minh thành công!");
    } catch (error) {
      console.error("Lỗi xác minh:", error);
      alert("Xác minh thất bại!");
    }
  };

  return (
    <div>
      <h2>Xác minh cư dân mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>

        <div>
          <label>Căn hộ:</label>
          <select value={selectedApartment} onChange={(e) => setSelectedApartment(e.target.value)} required>
            <option value="">Chọn căn hộ</option>
            {apartments.map((apartment) => (
              <option key={apartment.apartmentId} value={apartment.apartmentName}>
                {apartment.apartmentName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Vai trò:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="Rentor">Người thuê</option>
            <option value="Owner">Chủ hộ</option>
          </select>
        </div>

        <div>
          <label>Tên hợp đồng:</label>
          <input type="text" value={verificationFormName} onChange={(e) => setVerificationFormName(e.target.value)} required />
        </div>

        <div>
          <label>Loại hợp đồng:</label>
          <select value={verificationFormType} onChange={(e) => setVerificationFormType(parseInt(e.target.value))} required>
            <option value={1}>Hợp đồng thuê</option>
            <option value={2}>Hợp đồng mua</option>
          </select>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <label>Ngày bắt đầu hợp đồng:</label>
            <DatePicker value={contractStartDate} onChange={setContractStartDate} />
          </div>
          <div>
            <label>Ngày kết thúc hợp đồng:</label>
            <DatePicker value={contractEndDate} onChange={setContractEndDate} />
          </div>
        </LocalizationProvider>

        <div>
          <label>Tải ảnh lên:</label>
          <input type="file" multiple onChange={handleFileChange} required />
        </div>

        <button type="submit">Xác minh</button>
      </form>
    </div>
  );
};

export default VerifyNewResident;
