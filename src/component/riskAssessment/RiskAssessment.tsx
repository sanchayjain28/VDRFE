import { Button, Modal, Select } from "antd";
import "./RiskAssessment.scss";

interface RiskAssessmentProps {
  open: boolean;
  onClose: () => void;
  onAdd?: () => void;
}

const RiskAssessment = ({ open, onClose, onAdd }: RiskAssessmentProps) => {
  const handleAdd = () => {
    onAdd?.();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={true}
      className="risk-assessment-modal"
      width={550}
      centered>
      <div className="risk-assessment-content">
        <h2 className="risk-assessment-title">Risk Assessment</h2>

        <div className="risk-assessment-form">
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Severity</label>
              <Select
                defaultValue="moderate"
                className="dropdown-ui"
                suffixIcon={
                  <>
                    <i className="erm-icon dropdown-arrow-icon" />
                    <i className="erm-icon dropdown-top-arrow-icon" />
                  </>
                }>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="moderate">Moderate</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="critical">Critical</Select.Option>
              </Select>
            </div>

            <div className="form-field">
              <label className="field-label">Likelihood</label>
              <Select
                defaultValue="possible"
                className="dropdown-ui"
                suffixIcon={
                  <>
                    <i className="erm-icon dropdown-arrow-icon" />
                    <i className="erm-icon dropdown-top-arrow-icon" />
                  </>
                }>
                <Select.Option value="rare">Rare</Select.Option>
                <Select.Option value="unlikely">Unlikely</Select.Option>
                <Select.Option value="possible">Possible</Select.Option>
                <Select.Option value="likely">Likely</Select.Option>
                <Select.Option value="certain">Certain</Select.Option>
              </Select>
            </div>
          </div>

          <div className="risk-indicator-box">
            <div className="risk-indicator">
              <span className="risk-dot very-high"></span>
              <span className="risk-label">Very High :</span>
            </div>
            <p className="risk-description">
              Material costs will be borne by Gull and/or a potential acquirer.
            </p>
          </div>
        </div>

        <div className="risk-assessment-footer">
          <Button className="secondary-btn" shape="round" onClick={onClose}>
            CANCEL
          </Button>
          <Button className="primary-btn" shape="round" onClick={handleAdd}>
            ADD
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RiskAssessment;
