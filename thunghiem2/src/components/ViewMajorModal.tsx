import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NganhHoc, MajorDetails } from '../pages/QuanLyMonHoc/QuanLyMonHoc';
import './ViewMajorModal.css';

interface ViewMajorModalProps {
  isOpen: boolean;
  onClose: () => void;
  majorData: NganhHoc | null;
  majorDetails: MajorDetails[] | null; // Changed to array
}

const ViewMajorModal: React.FC<ViewMajorModalProps> = ({
  isOpen,
  onClose,
  majorData,
  majorDetails,
}) => {
  // State to track if modal is animating out
  const [isClosing, setIsClosing] = useState(false);
  // State to track which bậc đào tạo is selected
  const [selectedBacId, setSelectedBacId] = useState<number | null>(null);
  // State to track which specialization is selected
  const [selectedSpecialization, setSelectedSpecialization] = useState<MajorDetails | null>(null);
  
  // Updated handleClose function to allow exit animation to complete
  const handleClose = () => {
    setIsClosing(true);
    // Give the exit animation time to complete before actually closing
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Adjust this to match your animation duration
  };

  // Set the first specialization and bậc đào tạo as selected by default when data changes
  useEffect(() => {
    if (majorDetails && majorDetails.length > 0) {
      setSelectedSpecialization(majorDetails[0]);
      if (majorDetails[0].bacDaoTaoList.length > 0) {
        setSelectedBacId(majorDetails[0].bacDaoTaoList[0].id);
      }
    }
  }, [majorDetails]);

  // Find the currently selected bậc đào tạo
  const selectedBac = selectedSpecialization?.bacDaoTaoList.find(bac => bac.id === selectedBacId);

  // Function to calculate total credit excluding GDQP and GDTC
  const calculateTotalCredits = (bac) => {
    if (!bac) return 0;
    
    return bac.hocKyList.reduce((totalCredits, hocKy) => {
      const hocKyCredits = hocKy.monHocList.reduce((sum, monHoc) => {
        // Skip non-cumulative courses (GDQP, GDTC marked with isNonCumulative)
        if (monHoc.isNonCumulative) {
          return sum;
        }
        return sum + monHoc.soTinChi;
      }, 0);
      
      return totalCredits + hocKyCredits;
    }, 0);
  };

  // Function to render specialization selector dropdown
  const renderSpecializationSelector = () => {
    if (!majorDetails || majorDetails.length <= 1) return null;
    
    return (
      <div className="specialization-selector info-row">
        <span className="info-label">Chọn chuyên ngành:</span>
        <select 
          value={selectedSpecialization?.chuyenNganh || ''}
          onChange={(e) => {
            const selected = majorDetails.find(md => md.chuyenNganh === e.target.value);
            if (selected) {
              setSelectedSpecialization(selected);
              if (selected.bacDaoTaoList.length > 0) {
                setSelectedBacId(selected.bacDaoTaoList[0].id);
              }
            }
          }}
          className="specialization-dropdown"
        >
          {majorDetails.map((md, index) => (
            <option key={index} value={md.chuyenNganh}>
              {md.chuyenNganh}
            </option>
          ))}
        </select>
      </div>
    );
  };

  

  if (!majorData) return null;

  return (
    <AnimatePresence>
      {(isOpen && !isClosing) && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="view-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              exit: { duration: 0.25 } 
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Thông tin chi tiết ngành học</h2>
              <button className="close-button" onClick={handleClose}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="major-info">
                <div className="info-row">
                  <span className="info-label">Mã ngành:</span>
                  <span className="info-value">{majorData.maNganh}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tên ngành:</span>
                  <span className="info-value">{majorData.tenNganh}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Khoa:</span>
                  <span className="info-value">{majorData.khoa}</span>
                </div>
                
                {/* Render specialization selector if multiple specializations exist */}
                {renderSpecializationSelector()}
                
                {/* Only show chuyên ngành field if we have a selected specialization */}
                {selectedSpecialization && (
                  <div className="info-row">
                    <span className="info-label">Chuyên ngành:</span>
                    <span className="info-value">{selectedSpecialization.chuyenNganh}</span>
                  </div>
                )}
              </div>
              {selectedSpecialization && selectedSpecialization.bacDaoTaoList.length > 0 ? (
                <div className="bac-dao-tao-section">
                  <div className="bac-dao-tao-tabs">
                    {selectedSpecialization.bacDaoTaoList.map(bac => (
                      <button
                        key={bac.id}
                        className={`tab-button ${selectedBacId === bac.id ? 'active' : ''}`}
                        onClick={() => setSelectedBacId(bac.id)}
                      >
                        {bac.tenBac} ({calculateTotalCredits(bac)} TC)
                      </button>
                    ))}
                  </div>

                  {selectedBac && (
                    <div className="semesters-section">
                      <h3 className="section-title">Chương trình đào tạo - Bậc {selectedBac.tenBac}</h3>
                      <div className="semesters-list">
                        {selectedBac.hocKyList.map((hocKy) => (
                          <div key={hocKy.id} className="semester-details">
                            <div className="semester-header">
                              <span className="semester-name">{hocKy.name}</span>
                              <span className="semester-total">
                                Tổng: {hocKy.monHocList.reduce((sum, mh) => 
                                  sum + mh.soTinChi, 0)} TC
                              </span>
                              <span className="semester-total cumulative">
                                Tích lũy: {hocKy.monHocList.reduce((sum, mh) => 
                                  mh.isNonCumulative ? sum : sum + mh.soTinChi, 0)} TC
                              </span>
                            </div>
                            <table className="courses-table">
                              <thead>
                                <tr>
                                  <th>Mã MH</th>
                                  <th>Tên Môn học</th>
                                  <th>Loại hình</th>
                                  <th>Số TC</th>
                                  <th>Loại</th>
                                </tr>
                              </thead>
                              <tbody>
                                {hocKy.monHocList.map((monHoc) => (
                                  <tr
                                    key={monHoc.id}
                                    className={monHoc.isNonCumulative ? 'non-cumulative' : ''}
                                  >
                                    <td>{monHoc.maMon || '-'}</td>
                                    <td>{monHoc.tenMon}</td>
                                    <td>{monHoc.loaiHinh || '-'}</td>
                                    <td>{monHoc.soTinChi}</td>
                                    <td>
                                      <span
                                        className={
                                          monHoc.isNonCumulative
                                            ? 'badge badge-non'
                                            : 'badge badge-cumulative'
                                        }
                                      >
                                        {monHoc.isNonCumulative ? 'Không TL' : 'Tích lũy'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan={3} style={{textAlign: 'right', fontWeight: 'bold'}}>
                                    Tổng số tín chỉ:
                                  </td>
                                  <td colSpan={2} style={{fontWeight: 'bold'}}>
                                    {hocKy.monHocList.reduce((sum, mh) => sum + mh.soTinChi, 0)} TC
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={3} style={{textAlign: 'right'}}>
                                    Tích lũy:
                                  </td>
                                  <td colSpan={2}>
                                    {hocKy.monHocList.reduce((sum, mh) => 
                                      mh.isNonCumulative ? sum : sum + mh.soTinChi, 0)} TC
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        ))}
                      </div>
                      
                      <div className="total-credits-summary">
                        <h4>Tổng kết toàn bộ chương trình</h4>
                        <div className="credits-row">
                          <span className="credits-label">Tổng số tín chỉ toàn chương trình:</span>
                          <span className="credits-value">
                            {selectedBac.hocKyList.reduce((total, hk) => 
                              total + hk.monHocList.reduce((sum, mh) => sum + mh.soTinChi, 0), 0)} TC
                          </span>
                        </div>
                        <div className="credits-row highlight">
                          <span className="credits-label">Tổng số tín chỉ tích lũy:</span>
                          <span className="credits-value">
                            {calculateTotalCredits(selectedBac)} TC
                          </span>
                        </div>
                        <div className="credits-row">
                          <span className="credits-label">Tổng số tín chỉ không tích lũy:</span>
                          <span className="credits-value">
                            {selectedBac.hocKyList.reduce((total, hk) => 
                              total + hk.monHocList.reduce((sum, mh) => 
                                mh.isNonCumulative ? sum + mh.soTinChi : sum, 0), 0)} TC
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>Không có dữ liệu chi tiết chương trình đào tạo cho ngành này.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleClose}>
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewMajorModal;