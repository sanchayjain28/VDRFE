import { useState, useEffect } from "react";
import { Button, Modal, Select } from "antd";
import "./RiskAssessment.scss";

export type Severity = "low" | "moderate" | "high" | "critical";
export type Likelihood = "rare" | "unlikely" | "possible" | "likely" | "certain";
export type RiskLevel = "very-high" | "high" | "moderate" | "low" | "negligible";

export interface RiskAssessmentData {
  severity: Severity;
  likelihood: Likelihood;
  riskLevel: RiskLevel;
  description: string;
}

interface RiskAssessmentProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (data: RiskAssessmentData) => void;
  initialData?: RiskAssessmentData | null;
}

// Risk calculation matrix: [severity][likelihood] => risk level
const RISK_MATRIX: Record<Severity, Record<Likelihood, RiskLevel>> = {
  critical: {
    rare: "high",
    unlikely: "very-high",
    possible: "very-high",
    likely: "very-high",
    certain: "very-high",
  },
  high: {
    rare: "moderate",
    unlikely: "high",
    possible: "very-high",
    likely: "very-high",
    certain: "very-high",
  },
  moderate: {
    rare: "low",
    unlikely: "moderate",
    possible: "high",
    likely: "high",
    certain: "very-high",
  },
  low: {
    rare: "negligible",
    unlikely: "low",
    possible: "moderate",
    likely: "moderate",
    certain: "high",
  },
};

// Risk descriptions
const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  "very-high": "Material costs will be borne by Gull and/or a potential acquirer. Immediate action required.",
  high: "Significant impact expected. Requires close monitoring and mitigation strategies.",
  moderate: "Moderate impact anticipated. Standard monitoring and controls should be sufficient.",
  low: "Low impact expected. Minimal intervention required.",
  negligible: "Negligible impact. No action required.",
};

const RiskAssessment = ({ open, onClose, onAdd, initialData }: RiskAssessmentProps) => {
  const [severity, setSeverity] = useState<Severity>(initialData?.severity || "moderate");
  const [likelihood, setLikelihood] = useState<Likelihood>(initialData?.likelihood || "possible");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("moderate");
  const [description, setDescription] = useState<string>("");

  // Calculate risk level when severity or likelihood changes
  useEffect(() => {
    if (severity && likelihood) {
      const calculatedRisk = RISK_MATRIX[severity][likelihood];
      setRiskLevel(calculatedRisk);
      setDescription(RISK_DESCRIPTIONS[calculatedRisk]);
    }
  }, [severity, likelihood]);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setSeverity(initialData.severity);
        setLikelihood(initialData.likelihood);
        setRiskLevel(initialData.riskLevel);
        setDescription(initialData.description);
      } else {
        setSeverity("moderate");
        setLikelihood("possible");
        const defaultRisk = RISK_MATRIX["moderate"]["possible"];
        setRiskLevel(defaultRisk);
        setDescription(RISK_DESCRIPTIONS[defaultRisk]);
      }
    }
  }, [open, initialData]);

  const handleAdd = () => {
    const riskData: RiskAssessmentData = {
      severity,
      likelihood,
      riskLevel,
      description,
    };
    onAdd?.(riskData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getRiskLevelLabel = (level: RiskLevel): string => {
    const labels: Record<RiskLevel, string> = {
      "very-high": "Very High",
      high: "High",
      moderate: "Moderate",
      low: "Low",
      negligible: "Negligible",
    };
    return labels[level];
  };

  const getRiskDotClass = (level: RiskLevel): string => {
    return `risk-dot ${level}`;
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
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
                value={severity}
                onChange={(value) => setSeverity(value as Severity)}
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
                value={likelihood}
                onChange={(value) => setLikelihood(value as Likelihood)}
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
              <span className={getRiskDotClass(riskLevel)}></span>
              <span className="risk-label">{getRiskLevelLabel(riskLevel)} :</span>
            </div>
            <p className="risk-description">{description}</p>
          </div>
        </div>

        <div className="risk-assessment-footer">
          <Button className="secondary-btn" shape="round" onClick={handleCancel}>
            CANCEL
          </Button>
          <Button className="primary-btn" shape="round" onClick={handleAdd}>
            {initialData ? "UPDATE" : "ADD"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RiskAssessment;
